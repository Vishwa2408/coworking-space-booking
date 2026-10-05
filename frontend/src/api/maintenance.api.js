import api from "./axios";

export const getMaintenance = () =>
    api.get("/maintenance");

export const getMaintenanceById = (id) =>
    api.get(`/maintenance/${id}`);

export const createMaintenance = (data) =>
    api.post("/maintenance", data);

export const updateMaintenance = (id, data) =>
    api.patch(`/maintenance/${id}`, data);

export const deleteMaintenance = (id) =>
    api.delete(`/maintenance/${id}`);