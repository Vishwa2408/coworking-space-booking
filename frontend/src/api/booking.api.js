import api from "./axios";

export const createBooking = (data) =>
    api.post("/bookings", data);

export const getMyBookings = (params = {}) =>
    api.get("/bookings/my", { params });

export const cancelBooking = (id) =>
    api.patch(`/bookings/${id}/cancel`);