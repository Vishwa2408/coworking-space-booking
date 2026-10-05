const Joi = require("joi");

const createBookingSchema = Joi.object({
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

module.exports = {
    createBookingSchema,
};