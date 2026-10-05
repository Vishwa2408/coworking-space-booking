const { verifyAccessToken } = require("../utils/token");
const { User } = require("../models/User");

const authenticate = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const accessToken = authorizationHeader.split(" ")[1];

        const payload = verifyAccessToken(accessToken);

        const user = await User.findById(payload.userId).select(
            "_id name email role"
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account no longer exists.",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Access token has expired.",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid access token.",
            });
        }

        next(error);
    }
};

module.exports = authenticate;