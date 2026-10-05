const mongoose = require("mongoose");

const SPACE_TYPES = {
    DESK: "desk",
    MEETING_ROOM: "meeting_room",
}

const spaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        type: {
            type: String,
            enum: Object.values(SPACE_TYPES),
            required: true,
            index: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        amenities: {
            type: [String],
            default: [],
        },
        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

spaceSchema.index({
    name: "text",
    type: 1,
});

spaceSchema.index({
    capacity: 1,
});

const Space = mongoose.model("Space", spaceSchema);


module.exports = {
    Space,
    SPACE_TYPES,
};