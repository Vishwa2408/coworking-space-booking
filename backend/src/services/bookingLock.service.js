const { BookingLock } = require("../models/BookingLock");

const LOCK_DURATION_MS = 10 * 1000;

const acquireBookingLock = async (spaceId) => {
    const now = new Date();

    const lockedUntil = new Date(
        now.getTime() + LOCK_DURATION_MS
    );

    const existingLock = await BookingLock.findOneAndUpdate(
        {
            space: spaceId,
            lockedUntil: { $lte: now },
        },
        {
            $set: {
                lockedUntil,
            },
        },
        {
            new: true,
        }
    );

    if (existingLock) {
        return existingLock._id;
    }

    try {
        const newLock = await BookingLock.create({
            space: spaceId,
            lockedUntil,
        });

        return newLock._id;
    } catch (error) {
        if (error.code === 11000) {
            return null;
        }

        throw error;
    }
};

const releaseBookingLock = async (lockId) => {
    if (!lockId) {
        return;
    }

    await BookingLock.deleteOne({
        _id: lockId,
    });
};

module.exports = {
    acquireBookingLock,
    releaseBookingLock,
};