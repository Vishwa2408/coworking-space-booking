const Joi = require("joi");

const createMaintenanceSchema = Joi.object({
    space: Joi.string()
        .hex()
        .length(24)
        .required(),

    startTime: Joi.date()
        .iso()
        .required(),

    endTime: Joi.date()
        .iso()
        .greater(Joi.ref("startTime"))
        .required(),
});

const updateMaintenanceSchema = Joi.object({
    startTime: Joi.date().iso(),

    endTime: Joi.date().iso(),

}).min(1);

module.exports = {
    createMaintenanceSchema,
    updateMaintenanceSchema,
};