const jwt = require("jsonwebtoken");

const {
    jwtAccessSecret,
    jwtRefreshSecret,
    jwtAccessExpiresIn,
    jwtRefreshExpiresIn,
} = require("../config/env");

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id.toString(),
            role: user.role,
        },
        jwtAccessSecret,
        {
            expiresIn: jwtAccessExpiresIn,
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user._id.toString(),
        },
        jwtRefreshSecret,
        {
            expiresIn: jwtRefreshExpiresIn,
        }
    );
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, jwtAccessSecret);
};

const verifyRefreshToken = (token) => {
    return jwt.verify(token, jwtRefreshSecret);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};