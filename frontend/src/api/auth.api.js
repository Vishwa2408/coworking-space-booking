import api from "./axios";

export const registerUser = (data) =>
    api.post("/auth/register", data);

export const loginUser = (data) =>
    api.post("/auth/login", data);

export const refreshAccessToken = (refreshToken) =>
    api.post("/auth/refresh", { refreshToken });

export const getCurrentUser = () =>
    api.get("/users/me");