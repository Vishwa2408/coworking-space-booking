const express = require("express");

const {
    getAllBookings,
    approveBooking,
    rejectBooking
} = require("../controllers/booking.controller");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

router.get(
    "/",
    authenticate,
    authorize("admin"),
    getAllBookings
);

router.patch(
    "/:id/approve",
    authenticate,
    authorize("admin"),
    approveBooking
);

router.patch(
    "/:id/reject",
    authenticate,
    authorize("admin"),
    rejectBooking
);

module.exports = router;