const bcrypt = require("bcryptjs");

const { User } = require("../models/User");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} = require("../utils/token");

const registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error("An account with this email already exists.");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select(
        "+password +refreshToken"
    );

    if (!user) {
        const error = new Error("Invalid email or password.");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password.");
        error.statusCode = 401;
        throw error;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
};

const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        const error = new Error("Refresh token is required.");
        error.statusCode = 401;
        throw error;
    }

    let payload;

    try {
        payload = verifyRefreshToken(refreshToken);
    } catch (error) {
        const authError = new Error("Invalid or expired refresh token.");
        authError.statusCode = 401;
        throw authError;
    }

    const user = await User.findById(payload.userId).select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken) {
        const error = new Error("Invalid or expired refresh token.");
        error.statusCode = 401;
        throw error;
    }

    const newAccessToken = generateAccessToken(user);

    return {
        accessToken: newAccessToken,
    };
};

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
};