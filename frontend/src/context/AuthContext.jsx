import { createContext, useContext, useEffect, useState } from "react";
import {
    getCurrentUser,
    loginUser,
    registerUser,
} from "../api/auth.api";
import {
    clearTokens,
    getAccessToken,
    getRefreshToken,
    setTokens,
} from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (credentials) => {
        const response = await loginUser(credentials);

        const { accessToken, refreshToken, user } =
            response.data.data;

        setTokens({
            accessToken,
            refreshToken,
        });

        setUser(user.user || user);
        return user.user || user;
    };

    const register = async (userData) => {
        const response = await registerUser(userData);

        return response.data;
    };

    const logout = () => {
        clearTokens();
        setUser(null);
    };

    const loadUser = async () => {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        if (!accessToken && !refreshToken) {
            setIsLoading(false);
            return;
        }

        try {
            if (accessToken) {
                const response = await getCurrentUser();
                const currentUser = response.data.data;

                setUser(currentUser.user || currentUser); return;
            }

            /*
             * If there is no access token but a refresh token exists,
             * the Axios interceptor cannot refresh automatically because
             * there is no failed authenticated request.
             *
             * We therefore perform the initial refresh manually.
             */
            if (refreshToken) {
                const apiResponse = await fetch(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            refreshToken,
                        }),
                    }
                );

                const responseData = await apiResponse.json();

                if (!apiResponse.ok) {
                    throw new Error(
                        responseData.message ||
                        "Unable to refresh session."
                    );
                }

                const newAccessToken =
                    responseData.data.accessToken;

                setTokens({
                    accessToken: newAccessToken,
                    refreshToken,
                });

                const userResponse = await getCurrentUser();
                const currentUser = userResponse.data.data;

                setUser(currentUser.user || currentUser);
            }
        } catch (error) {
            clearTokens();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isLoading,
                isAuthenticated: Boolean(user),
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};