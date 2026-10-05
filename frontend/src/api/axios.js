import axios from "axios";
import {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
} from "../utils/storage";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeToRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const notifyRefreshSubscribers = (token) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            originalRequest?._retry ||
            originalRequest?.url?.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            clearTokens();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                subscribeToRefresh((newAccessToken) => {
                    if (!newAccessToken) {
                        reject(error);
                        return;
                    }

                    originalRequest.headers.Authorization =
                        `Bearer ${newAccessToken}`;

                    resolve(api(originalRequest));
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/refresh`,
                {
                    refreshToken,
                }
            );

            const newAccessToken =
                response.data?.data?.accessToken ||
                response.data?.accessToken;

            if (!newAccessToken) {
                throw new Error("Access token was not returned.");
            }

            setTokens({
                accessToken: newAccessToken,
                refreshToken,
            });

            notifyRefreshSubscribers(newAccessToken);

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            notifyRefreshSubscribers(null);
            clearTokens();

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;