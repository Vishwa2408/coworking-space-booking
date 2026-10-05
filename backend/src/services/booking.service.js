const mongoose = require("mongoose");

const { Booking, BOOKING_STATUS } = require("../models/Booking");
const { Space } = require("../models/Space");
const { Maintenance } = require("../models/Maintenance");

const {
    acquireBookingLock,
    releaseBookingLock,
} = require("./bookingLock.service");

const createBooking = async ({
    memberId,
    spaceId,
    startTime,
    endTime,
}) => {
    if (!mongoose.Types.ObjectId.isValid(spaceId)) {
        const error = new Error("Invalid space ID");
        error.statusCode = 400;
        throw error;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start <= new Date()) {
        const error = new Error(
            "Booking start time must be in the future"
        );
        error.statusCode = 400;
        throw error;
    }

    if (end <= start) {
        const error = new Error(
            "Booking end time must be after start time"
        );
        error.statusCode = 400;
        throw error;
    }

    const space = await Space.findOne({
        _id: spaceId,
        isActive: true,
    });

    if (!space) {
        const error = new Error("Space not found");
        error.statusCode = 404;
        throw error;
    }

    const lockId = await acquireBookingLock(spaceId);

    if (!lockId) {
        const error = new Error(
            "This space is currently being booked. Please try again."
        );
        error.statusCode = 409;
        throw error;
    }

    try {
        const maintenanceConflict = await Maintenance.findOne({
            space: spaceId,
            startTime: { $lt: end },
            endTime: { $gt: start },
        });

        if (maintenanceConflict) {
            const error = new Error(
                "Space is unavailable during the selected time because of maintenance"
            );
            error.statusCode = 409;
            throw error;
        }

        const bookingConflict = await Booking.findOne({
            space: spaceId,
            status: {
                $in: [
                    BOOKING_STATUS.PENDING,
                    BOOKING_STATUS.APPROVED,
                ],
            },
            startTime: { $lt: end },
            endTime: { $gt: start },
        });

        if (bookingConflict) {
            const error = new Error(
                "Space is already booked for the selected time"
            );
            error.statusCode = 409;
            throw error;
        }

        const booking = await Booking.create({
            space: spaceId,
            member: memberId,
            startTime: start,
            endTime: end,
            status: BOOKING_STATUS.PENDING,
        });

        return booking;
    } finally {
        await releaseBookingLock(lockId);
    }
};

const getMyBookings = async ({ memberId, status }) => {
    const filter = {
        member: memberId
    };

    if (status) {
        filter.status = status;
    }

    const bookings = await Booking.find(filter)
        .populate("space", "name type capacity amenities")
        .sort({ startTime: -1 });

    return bookings;
};

const cancelMyBooking = async ({ memberId, bookingId }) => {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        const error = new Error("Invalid booking ID");
        error.statusCode = 400;
        throw error;
    }

    const booking = await Booking.findOne({
        _id: bookingId,
        member: memberId
    });

    if (!booking) {
        const error = new Error("Booking not found");
        error.statusCode = 404;
        throw error;
    }

    if (
        ![
            BOOKING_STATUS.PENDING,
            BOOKING_STATUS.APPROVED
        ].includes(booking.status)
    ) {
        const error = new Error(
            "Only pending or approved bookings can be cancelled"
        );
        error.statusCode = 400;
        throw error;
    }

    if (booking.startTime <= new Date()) {
        const error = new Error(
            "Past or ongoing bookings cannot be cancelled"
        );
        error.statusCode = 400;
        throw error;
    }

    booking.status = BOOKING_STATUS.CANCELLED;

    await booking.save();

    return booking;
};

const getAllBookings = async ({
    status,
    space,
    date,
    page = 1,
    limit = 10
}) => {
    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (space) {
        if (!mongoose.Types.ObjectId.isValid(space)) {
            const error = new Error("Invalid space ID");
            error.statusCode = 400;
            throw error;
        }

        filter.space = space;
    }

    if (date) {
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);

        if (
            Number.isNaN(startOfDay.getTime()) ||
            Number.isNaN(endOfDay.getTime())
        ) {
            const error = new Error("Invalid date");
            error.statusCode = 400;
            throw error;
        }

        filter.startTime = {
            $lte: endOfDay
        };

        filter.endTime = {
            $gte: startOfDay
        };
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
        Booking.find(filter)
            .populate("space", "name type capacity amenities")
            .populate("member", "name email")
            .sort({ startTime: -1 })
            .skip(skip)
            .limit(limit),

        Booking.countDocuments(filter)
    ]);

    return {
        bookings,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const approveBooking = async ({ bookingId }) => {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        const error = new Error("Invalid booking ID");
        error.statusCode = 400;
        throw error;
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        const error = new Error("Booking not found");
        error.statusCode = 404;
        throw error;
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
        const error = new Error(
            "Only pending bookings can be approved"
        );
        error.statusCode = 400;
        throw error;
    }

    const lockId = await acquireBookingLock(booking.space);

    if (!lockId) {
        const error = new Error(
            "This space is currently being processed. Please try again."
        );
        error.statusCode = 409;
        throw error;
    }

    try {
        // Check maintenance conflict
        const maintenanceConflict = await Maintenance.findOne({
            space: booking.space,
            startTime: { $lt: booking.endTime },
            endTime: { $gt: booking.startTime }
        });

        if (maintenanceConflict) {
            const error = new Error(
                "Cannot approve booking because the space is under maintenance during the selected time"
            );
            error.statusCode = 409;
            throw error;
        }

        // Check approved booking conflict
        const approvedConflict = await Booking.findOne({
            _id: { $ne: booking._id },
            space: booking.space,
            status: BOOKING_STATUS.APPROVED,
            startTime: { $lt: booking.endTime },
            endTime: { $gt: booking.startTime }
        });

        if (approvedConflict) {
            const error = new Error(
                "Cannot approve booking because the space is already approved for the selected time"
            );
            error.statusCode = 409;
            throw error;
        }

        // Approve selected booking
        booking.status = BOOKING_STATUS.APPROVED;
        await booking.save();

        // Reject other pending overlapping bookings
        await Booking.updateMany(
            {
                _id: { $ne: booking._id },
                space: booking.space,
                status: BOOKING_STATUS.PENDING,
                startTime: { $lt: booking.endTime },
                endTime: { $gt: booking.startTime }
            },
            {
                $set: {
                    status: BOOKING_STATUS.REJECTED
                }
            }
        );

        return booking;
    } finally {
        await releaseBookingLock(lockId);
    }
};

const rejectBooking = async ({ bookingId }) => {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        const error = new Error("Invalid booking ID");
        error.statusCode = 400;
        throw error;
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        const error = new Error("Booking not found");
        error.statusCode = 404;
        throw error;
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
        const error = new Error(
            "Only pending bookings can be rejected"
        );
        error.statusCode = 400;
        throw error;
    }

    booking.status = BOOKING_STATUS.REJECTED;

    await booking.save();

    return booking;
};


module.exports = {
    createBooking,
    getMyBookings,
    cancelMyBooking,
    getAllBookings,
    approveBooking,
    rejectBooking
};