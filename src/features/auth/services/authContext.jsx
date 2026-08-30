import { createContext, useContext, useEffect, useState } from "react";
import api, {
    setAccessToken,
    clearAccessToken
} from "../../../api/axios.js";


// Create context
const AuthContext = createContext();


// Provider
export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // ==========================================
    // RESTORE SESSION WHEN APP STARTS
    // ==========================================

    useEffect(() => {

        const restoreSession = async () => {

            try {

                const response = await api.get("/refresh");

                const newAccessToken =
                    response.data.accessToken;

                setAccessToken(newAccessToken);


                
                const userResponse =
                    await api.get("/get-me");

                setUser(userResponse.data.user);

            } catch (error) {

             
                clearAccessToken();
                setUser(null);

            } finally {

                setLoading(false);

            }
        };


        restoreSession();

    }, []);


    // ==========================================
    // LOGIN
    // ==========================================

    const login = async (email, password) => {

        try {

            const response = await api.post("/login", {
                email,
                password
            });

            const {
                accessToken,
                user
            } = response.data;


            
            setAccessToken(accessToken);

            // Store user in React state
            setUser(user);


            return {
                success: true,
                user
            };

        } catch (error) {

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

            await api.post("/logout");

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

        }
    };


    // ==========================================
    // LOGOUT ALL DEVICES
    // ==========================================

    const logoutAll = async () => {

        try {

            await api.post("/logout-all");

        } catch (error) {

            console.log(
                error.response?.data?.message ||
                "Logout all failed"
            );

        } finally {

            clearAccessToken();
            setUser(null);
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
                "/register",
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
                "/verify-email",
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
            "/resend-otp",
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

        login,
        logout,
        logoutAll,
        register,
        verifyEmail,
        resendOTP,
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