const maintenanceService = require("../services/maintenance.service");

const createMaintenance = async (req, res, next) => {
    try {
        const maintenance =
            await maintenanceService.createMaintenance(req.body);

        return res.status(201).json({
            success: true,
            message: "Maintenance window created successfully",
            data: maintenance,
        });
    } catch (error) {
        next(error);
    }
};

const getMaintenance = async (req, res, next) => {
    try {
        const {
            space,
            startDate,
            endDate,
        } = req.query;

        const maintenance =
            await maintenanceService.getMaintenance({
                space,
                startDate,
                endDate,
            });

        return res.status(200).json({
            success: true,
            data: maintenance,
        });
    } catch (error) {
        next(error);
    }
};

const getMaintenanceById = async (req, res, next) => {
    try {
        const maintenance =
            await maintenanceService.getMaintenanceById(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            data: maintenance,
        });
    } catch (error) {
        next(error);
    }
};

const updateMaintenance = async (req, res, next) => {
    try {
        const maintenance =
            await maintenanceService.updateMaintenance(
                req.params.id,
                req.body
            );

        return res.status(200).json({
            success: true,
            message: "Maintenance window updated successfully",
            data: maintenance,
        });
    } catch (error) {
        next(error);
    }
};

const deleteMaintenance = async (req, res, next) => {
    try {
        const maintenance =
            await maintenanceService.deleteMaintenance(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            message: "Maintenance window deleted successfully",
            data: maintenance,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createMaintenance,
    getMaintenance,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance,
};