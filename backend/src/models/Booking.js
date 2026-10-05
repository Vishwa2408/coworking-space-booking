const mongoose = require("mongoose");

const BOOKING_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
};

const bookingSchema = new mongoose.Schema(
    {
        space: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Space",
            required: true,
            index: true,
        },

        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        startTime: {
            type: Date,
            required: true,
            index: true,
        },

        endTime: {
            type: Date,
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: Object.values(BOOKING_STATUS),
            default: BOOKING_STATUS.PENDING,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

bookingSchema.index({
    space: 1,
    startTime: 1,
    endTime: 1,
    status: 1,
});

bookingSchema.index({
    member: 1,
    startTime: -1,
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = {
    Booking,
    BOOKING_STATUS,
};