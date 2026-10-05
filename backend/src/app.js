const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const cookieParser = require("cookie-parser")
const { clientUrl } = require("./config/env")
const errorHandler = require("./middlewares/errorHandler")

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const spaceRoutes = require("./routes/space.routes");
const maintenanceRoutes = require("./routes/maintenance.routes");
const bookingRoutes = require("./routes/booking.routes");
const adminBookingRoutes = require("./routes/adminBooking.routes");


const app = express()

app.use(helmet())

app.use(cors({
    origin: clientUrl,
    credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes);
app.use("/api/spaces", spaceRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Coworking Space Booking API is running",
    });
});

app.use(errorHandler);

module.exports = app