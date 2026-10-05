const express = require("express");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

router.get("/me", authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            user: req.user,
        },
    });
});

router.get(
    "/admin-test",
    authenticate,
    authorize("admin"),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Admin authorization successful.",
        });
    }
);

module.exports = router;