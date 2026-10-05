const bookingService = require("../services/booking.service");

const createBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.createBooking({
            memberId: req.user._id,
            spaceId: req.body.space,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
        });

        return res.status(201).json({
            success: true,
            message: "Booking request created successfully",
            data: booking,
        });
    } catch (error) {
        next(error);
    }
};

const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await bookingService.getMyBookings({
            memberId: req.user._id,
            status: req.query.status
        });

        return res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

const cancelMyBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.cancelMyBooking({
            memberId: req.user._id,
            bookingId: req.params.id
        });

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

const getAllBookings = async (req, res, next) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            100
        );

        const result = await bookingService.getAllBookings({
            status: req.query.status,
            space: req.query.space,
            date: req.query.date,
            page,
            limit
        });

        return res.status(200).json({
            success: true,
            data: result.bookings,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

const approveBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.approveBooking({
            bookingId: req.params.id
        });

        return res.status(200).json({
            success: true,
            message: "Booking approved successfully",
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

const rejectBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.rejectBooking({
            bookingId: req.params.id
        });

        return res.status(200).json({
            success: true,
            message: "Booking rejected successfully",
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    cancelMyBooking,
    getAllBookings,
    approveBooking,
    rejectBooking
};