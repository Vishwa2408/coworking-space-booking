const mongoose = require("mongoose");
const { Space } = require("../models/Space");

const { Booking, BOOKING_STATUS } = require("../models/Booking");
const { Maintenance } = require("../models/Maintenance");

const createSpace = async (spaceData) => {
    const space = await Space.create(spaceData);

    return space;
};

const getSpaces = async ({
    search,
    type,
    capacity,
    date,
    page = 1,
    limit = 10
}) => {
    const filter = {
        isActive: true
    };

    // Search by space name or type
    if (search) {
        filter.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                type: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    // Filter by type
    if (type) {
        filter.type = type;
    }

    // Filter by capacity
    if (capacity) {
        filter.capacity = {
            $gte: Number(capacity)
        };
    }

    // Date availability filter
    //  we only exclude a space when it has
    // an event covering the entire selected date.
    if (date) {
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const startOfNextDay = new Date(`${date}T00:00:00.000Z`);

        startOfNextDay.setUTCDate(
            startOfNextDay.getUTCDate() + 1
        );

        if (
            Number.isNaN(startOfDay.getTime()) ||
            Number.isNaN(startOfNextDay.getTime())
        ) {
            const error = new Error("Invalid date");
            error.statusCode = 400;
            throw error;
        }

        const [bookings, maintenance] = await Promise.all([
            Booking.find({
                status: {
                    $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.APPROVED],
                },
                startTime: {
                    $lt: startOfNextDay,
                },
                endTime: {
                    $gt: startOfDay,
                },
            }).select("space"),

            Maintenance.find({
                startTime: {
                    $lt: startOfNextDay,
                },
                endTime: {
                    $gt: startOfDay,
                },
            }).select("space"),
        ]);

        const unavailableSpaceIds = [
            ...bookings.map((booking) => booking.space),
            ...maintenance.map((item) => item.space)
        ];

        if (unavailableSpaceIds.length > 0) {
            filter._id = {
                $nin: unavailableSpaceIds
            };
        }
    }

    const skip = (page - 1) * limit;

    const [spaces, total] = await Promise.all([
        Space.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        Space.countDocuments(filter)
    ]);

    return {
        spaces,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const getSpaceById = async (spaceId) => {
    if (!mongoose.Types.ObjectId.isValid(spaceId)) {
        const error = new Error("Invalid space ID");
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

    return space;
};

const updateSpace = async (spaceId, updateData) => {
    if (!mongoose.Types.ObjectId.isValid(spaceId)) {
        const error = new Error("Invalid space ID");
        error.statusCode = 400;
        throw error;
    }

    const space = await Space.findByIdAndUpdate(
        spaceId,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!space) {
        const error = new Error("Space not found");
        error.statusCode = 404;
        throw error;
    }

    return space;
};

const deleteSpace = async (spaceId) => {
    if (!mongoose.Types.ObjectId.isValid(spaceId)) {
        const error = new Error("Invalid space ID");
        error.statusCode = 400;
        throw error;
    }

    const space = await Space.findByIdAndUpdate(
        spaceId,
        {
            isActive: false,
        },
        {
            new: true,
        }
    );

    if (!space) {
        const error = new Error("Space not found");
        error.statusCode = 404;
        throw error;
    }

    return space;
};

const getSpaceAvailability = async ({ spaceId, date }) => {
    if (!date) {
        const error = new Error("Date is required");
        error.statusCode = 400;
        throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(spaceId)) {
        const error = new Error("Invalid space ID");
        error.statusCode = 400;
        throw error;
    }

    const space = await Space.findOne({
        _id: spaceId,
        isActive: true
    });

    if (!space) {
        const error = new Error("Space not found");
        error.statusCode = 404;
        throw error;
    }

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const startOfNextDay = new Date(`${date}T00:00:00.000Z`);

    startOfNextDay.setUTCDate(startOfNextDay.getUTCDate() + 1);

    if (
        Number.isNaN(startOfDay.getTime()) ||
        Number.isNaN(startOfNextDay.getTime())
    ) {
        const error = new Error("Invalid date");
        error.statusCode = 400;
        throw error;
    }

    const dateRangeFilter = {
        space: spaceId,
        startTime: { $lt: startOfNextDay },
        endTime: { $gt: startOfDay }
    };

    const [bookings, maintenance] = await Promise.all([
        Booking.find({
            ...dateRangeFilter,
            status: {
                $in: [
                    BOOKING_STATUS.PENDING,
                    BOOKING_STATUS.APPROVED
                ]
            }
        })
            .select("startTime endTime status")
            .sort({ startTime: 1 }),

        Maintenance.find(dateRangeFilter)
            .select("startTime endTime")
            .sort({ startTime: 1 })
    ]);

    return {
        date,
        space: {
            _id: space._id,
            name: space.name,
            type: space.type,
            capacity: space.capacity
        },
        bookings,
        maintenance
    };
};

module.exports = {
    createSpace,
    getSpaces,
    getSpaceById,
    updateSpace,
    deleteSpace,
    getSpaceAvailability
};