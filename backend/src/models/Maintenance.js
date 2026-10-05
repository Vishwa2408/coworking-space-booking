const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
    {
        space: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Space",
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
    },
    {
        timestamps: true,
    }
);

maintenanceSchema.index({
    space: 1,
    startTime: 1,
    endTime: 1,
});

const Maintenance = mongoose.model(
    "Maintenance",
    maintenanceSchema
);

module.exports = {
    Maintenance,
};