const mongoose = require('mongoose');

const USER_ROLES = {
    MEMBER: 'member',
    ADMIN: 'admin',
}

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false, // Exclude password from query results by default
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            default: USER_ROLES.MEMBER,
            index: true,
        },
        refreshToken: {
            type: String,
            select: false,
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userSchema);

module.exports = {
    User,
    USER_ROLES,
};