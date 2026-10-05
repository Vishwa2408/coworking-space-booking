const mongoose = require("mongoose");

const { Maintenance } = require("../models/Maintenance");
const { Space } = require("../models/Space");

const createMaintenance = async (maintenanceData) => {
    const { space, startTime, endTime } = maintenanceData;

    if (!mongoose.Types.ObjectId.isValid(space)) {
        const error = new Error("Invalid space ID");
        error.statusCode = 400;
        throw error;
    }

    const existingSpace = await Space.findOne({
        _id: space,
        isActive: true,
    });

    if (!existingSpace) {
        const error = new Error("Space not found");
        error.statusCode = 404;
        throw error;
    }

    const overlappingMaintenance = await Maintenance.findOne({
        space,
        startTime: { $lt: new Date(endTime) },
        endTime: { $gt: new Date(startTime) },
    });

    if (overlappingMaintenance) {
        const error = new Error(
            "Maintenance window overlaps with an existing maintenance window"
        );
        error.statusCode = 409;
        throw error;
    }

    return Maintenance.create(maintenanceData);
};

const getMaintenance = async ({
    space,
    startDate,
    endDate,
}) => {
    const filter = {};

    if (space) {
        if (!mongoose.Types.ObjectId.isValid(space)) {
            const error = new Error("Invalid space ID");
            error.statusCode = 400;
            throw error;
        }

        filter.space = space;
    }

    if (startDate || endDate) {
        filter.startTime = {};

        if (startDate) {
            filter.startTime.$gte = new Date(startDate);
        }

        if (endDate) {
            filter.startTime.$lte = new Date(endDate);
        }
    }

    return Maintenance.find(filter)
        .populate("space", "name type capacity")
        .sort({ startTime: 1 });
};

const getMaintenanceById = async (maintenanceId) => {
    if (!mongoose.Types.ObjectId.isValid(maintenanceId)) {
        const error = new Error("Invalid maintenance ID");
        error.statusCode = 400;
        throw error;
    }

    const maintenance = await Maintenance.findById(
        maintenanceId
    ).populate("space", "name type capacity");

    if (!maintenance) {
        const error = new Error("Maintenance record not found");
        error.statusCode = 404;
        throw error;
    }

    return maintenance;
};

const updateMaintenance = async (
    maintenanceId,
    updateData
) => {
    if (!mongoose.Types.ObjectId.isValid(maintenanceId)) {
        const error = new Error("Invalid maintenance ID");
        error.statusCode = 400;
        throw error;
    }

    const maintenance = await Maintenance.findById(
        maintenanceId
    );

    if (!maintenance) {
        const error = new Error("Maintenance record not found");
        error.statusCode = 404;
        throw error;
    }

    const space = updateData.space || maintenance.space;
    const startTime =
        updateData.startTime || maintenance.startTime;
    const endTime =
        updateData.endTime || maintenance.endTime;

    const overlappingMaintenance =
        await Maintenance.findOne({
            _id: { $ne: maintenanceId },
            space,
            startTime: { $lt: new Date(endTime) },
            endTime: { $gt: new Date(startTime) },
        });

    if (overlappingMaintenance) {
        const error = new Error(
            "Maintenance window overlaps with an existing maintenance window"
        );
        error.statusCode = 409;
        throw error;
    }

    Object.assign(maintenance, updateData);

    await maintenance.save();

    return maintenance;
};

const deleteMaintenance = async (maintenanceId) => {
    if (!mongoose.Types.ObjectId.isValid(maintenanceId)) {
        const error = new Error("Invalid maintenance ID");
        error.statusCode = 400;
        throw error;
    }

    const maintenance =
        await Maintenance.findByIdAndDelete(maintenanceId);

    if (!maintenance) {
        const error = new Error("Maintenance record not found");
        error.statusCode = 404;
        throw error;
    }

    return maintenance;
};

module.exports = {
    createMaintenance,
    getMaintenance,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance,
};