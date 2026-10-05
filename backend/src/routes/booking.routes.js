const express = require("express");

const {
    createBooking,
    getMyBookings,
    cancelMyBooking,
} = require("../controllers/booking.controller");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validate = require("../middlewares/validate");

const {
    createBookingSchema,
} = require("../validators/booking.validator");

const router = express.Router();

router.get(
    "/my",
    authenticate,
    authorize("member"),
    getMyBookings
);

router.post(
    "/",
    authenticate,
    authorize("member"),
    validate(createBookingSchema),
    createBooking
);

router.patch(
    "/:id/cancel",
    authenticate,
    authorize("member"),
    cancelMyBooking
);


module.exports = router;