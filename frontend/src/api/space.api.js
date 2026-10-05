import api from "./axios";

export const getSpaces = (params = {}) =>
    api.get("/spaces", { params });

export const getSpaceById = (id) =>
    api.get(`/spaces/${id}`);

export const getSpaceAvailability = (id, date) =>
    api.get(`/spaces/${id}/availability`, {
        params: { date },
    });

export const createSpace = (data) =>
    api.post("/spaces", data);

export const updateSpace = (id, data) =>
    api.patch(`/spaces/${id}`, data);

export const deleteSpace = (id) =>
    api.delete(`/spaces/${id}`);