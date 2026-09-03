import { createContext, useContext, useEffect, useState } from "react";
import api, {
    setAccessToken,
    clearAccessToken,
} from "../../../api/axios.js";

import socket, { connectSocket } from "../../../services/socket.js";
// Create context
const AuthContext = createContext();


// Provider
export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
const [restoringSession, setRestoringSession] = useState(true);
const [accessToken, setAccessTokenState] = useState(null);
    // ==========================================
    // RESTORE SESSION WHEN APP STARTS
    // ==========================================

    useEffect(() => {

        const restoreSession = async () => {
    setRestoringSession(true);
            try {

             const response = await api.get("/auth/refresh");

console.log("REFRESH RESPONSE:", response.data);

const newAccessToken = response.data.accessToken;

console.log("NEW ACCESS TOKEN:", newAccessToken);

setAccessToken(newAccessToken);
setAccessTokenState(newAccessToken);
                connectSocket(newAccessToken);

                
                const userResponse =
                    await api.get("/auth/get-me");

                setUser(userResponse.data.user);

            } catch (error) {

    
               console.log("AUTH RESTORE ERROR:", error);
            console.log("ERROR STATUS:", error.response?.status);
            console.log("ERROR DATA:", error.response?.data);
                clearAccessToken();
                setUser(null);

            } finally {

                setLoading(false);
setRestoringSession(false);
            }
        };


        restoreSession();

    }, []);


    // ==========================================
    // LOGIN
    // ==========================================

  const login = async (email, password) => {
    try {
        const response = await api.post("/auth/login", {
            email,
            password
        });

        const {
            accessToken,
            user
        } = response.data;

        setAccessToken(accessToken);
        setAccessTokenState(accessToken);
        connectSocket(accessToken);

        setUser(user);

        return {
            success: true,
            user
        };
    } catch (error) {
        console.log("LOGIN ERROR:", error);
        console.log("LOGIN ERROR RESPONSE:", error.response?.data);
        console.log("LOGIN ERROR STATUS:", error.response?.status);

        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Login failed"
        };
    }
};


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = async () => {

        try {

            await api.post("/auth/logout");

        } catch (error) {

            console.log(
                error.response?.data?.message ||
                "Logout request failed"
            );

        } finally {

            // Remove access token from memory
            clearAccessToken();

            // Remove user from React state
            setUser(null);
             socket.disconnect();
        }
    };


    // ==========================================
    // LOGOUT ALL DEVICES
    // ==========================================

    const logoutAll = async () => {

        try {

            await api.post("/auth/logout-all");

        } catch (error) {

            console.log(
                error.response?.data?.message ||
                "Logout all failed"
            );

        } finally {

            clearAccessToken();
            setUser(null);
            socket.disconnect();
        }
    };


    // ==========================================
    // REGISTER
    // ==========================================

    const register = async (
        username,
        email,
        password
    ) => {

        try {
            
            const response = await api.post(
                "/auth/register",
                {
                    username,
                    email,
                    password
                }
            );

            setLoading(false);

            return {
                success: true,
                data: response.data
            };
 
        } catch (error) {

           return {
    success: false,

    code: error.response?.data?.code,

    message:
        error.response?.data?.message ||
        "Registration failed"
};
        }
    };


    // ==========================================
    // VERIFY EMAIL
    // ==========================================

    const verifyEmail = async (email, otp) => {

        try {

            const response = await api.post(
                "/auth/verify-email",
                {
                    email,
                    otp
                }
            );

            return {
                success: true,
                data: response.data
            };

        } catch (error) {

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Invalid OTP"
            };
        }
    };

const resendOTP = async (email) => {

    try {

        const response = await api.post(
            "/auth/resend-otp",
            {
                email
            }
        );

        return {
            success: true,
            message: response.data.message
        };

    } catch (error) {

        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Failed to resend OTP"
        };
    }
};
    // ==========================================
    // CONTEXT VALUE
    // ==========================================

    const value = {
        user,
        loading,
      setLoading,
        login,
        logout,
        logoutAll,
        register,
        verifyEmail,
        resendOTP,
        restoringSession,
         accessToken,
        isAuthenticated: !!user
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


// ==========================================
// CUSTOM HOOK
// ==========================================

export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};