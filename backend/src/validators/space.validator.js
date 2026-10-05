const Joi = require("joi");

const spaceTypes = ["desk", "meeting_room"];

const createSpaceSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),

    type: Joi.string()
        .valid(...spaceTypes)
        .required(),

    capacity: Joi.number().integer().min(1).required(),

    amenities: Joi.array()
        .items(Joi.string().trim().min(1).max(100))
        .default([]),

    description: Joi.string().trim().max(1000).allow("").default(""),

    isActive: Joi.boolean().default(true),
});

const updateSpaceSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100),

    type: Joi.string().valid(...spaceTypes),

    capacity: Joi.number().integer().min(1),

    amenities: Joi.array().items(
        Joi.string().trim().min(1).max(100)
    ),

    description: Joi.string().trim().max(1000).allow(""),

    isActive: Joi.boolean(),
}).min(1);

module.exports = {
    createSpaceSchema,
    updateSpaceSchema,
};