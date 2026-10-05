const mongoose = require("mongoose");

const bookingLockSchema = new mongoose.Schema(
    {
        space: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Space",
            required: true,
            unique: true,
            index: true,
        },

        lockedUntil: {
            type: Date,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

const BookingLock = mongoose.model(
    "BookingLock",
    bookingLockSchema
);

module.exports = {
    BookingLock,
};