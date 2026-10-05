const express = require("express");

const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
} = require("../validators/auth.validator");

const { authRateLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();


router.post(
    "/register",
    authRateLimiter,
    validate(registerSchema),
    authController.register
);

router.post(
    "/login",
    authRateLimiter,
    validate(loginSchema),
    authController.login
);

router.post(
    "/refresh",
    validate(refreshTokenSchema),
    authController.refreshToken
);


module.exports = router;