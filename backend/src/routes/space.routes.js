const express = require("express");

const {
    createSpace,
    getSpaces,
    getSpaceById,
    updateSpace,
    deleteSpace,
    getSpaceAvailability,
} = require("../controllers/space.controller");


const {
    createSpaceSchema,
    updateSpaceSchema,
} = require("../validators/space.validator");

const authorize = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

// Public / Visitor routes
router.get("/", getSpaces);

router.get(
    "/:id/availability",
    getSpaceAvailability
);

router.get("/:id", getSpaceById);

// Admin routes
router.post(
    "/",
    authenticate,
    authorize("admin"),
    validate(createSpaceSchema),
    createSpace
);

router.patch(
    "/:id",
    authenticate,
    authorize("admin"),
    validate(updateSpaceSchema),
    updateSpace
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteSpace
);

module.exports = router;