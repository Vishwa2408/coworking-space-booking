import api from "./axios";

export const getAllBookings = (params = {}) =>
    api.get("/admin/bookings", { params });

export const approveBooking = (id) =>
    api.patch(`/admin/bookings/${id}/approve`);

export const rejectBooking = (id) =>
    api.patch(`/admin/bookings/${id}/reject`);