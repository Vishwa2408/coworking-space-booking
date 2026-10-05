const spaceService = require("../services/space.service");

const createSpace = async (req, res, next) => {
    try {
        const space = await spaceService.createSpace(req.body);

        return res.status(201).json({
            success: true,
            message: "Space created successfully",
            data: space,
        });
    } catch (error) {
        next(error);
    }
};

const getSpaces = async (req, res, next) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);

        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            100
        );

        const result = await spaceService.getSpaces({
            search: req.query.search,
            type: req.query.type,
            capacity: req.query.capacity,
            date: req.query.date,
            page,
            limit
        });

        return res.status(200).json({
            success: true,
            data: result.spaces,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

const getSpaceById = async (req, res, next) => {
    try {
        const space = await spaceService.getSpaceById(req.params.id);

        return res.status(200).json({
            success: true,
            data: space,
        });
    } catch (error) {
        next(error);
    }
};

const updateSpace = async (req, res, next) => {
    try {
        const space = await spaceService.updateSpace(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Space updated successfully",
            data: space,
        });
    } catch (error) {
        next(error);
    }
};

const deleteSpace = async (req, res, next) => {
    try {
        const space = await spaceService.deleteSpace(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Space deleted successfully",
            data: space,
        });
    } catch (error) {
        next(error);
    }
};

const getSpaceAvailability = async (req, res, next) => {
    try {
        const availability = await spaceService.getSpaceAvailability({
            spaceId: req.params.id,
            date: req.query.date
        });

        return res.status(200).json({
            success: true,
            data: availability
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSpace,
    getSpaces,
    getSpaceById,
    updateSpace,
    deleteSpace,
    getSpaceAvailability
};