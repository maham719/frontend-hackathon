import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/services/authContext.jsx";

import UserDashboard from "../features/auth/pages/UserDashboard.jsx";
import AdminDashboard from "../features/auth/pages/AdminDashboard.jsx";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    console.log("ProtectedRoute user:", user);
    console.log("ProtectedRoute loading:", loading);
    // Don't redirect while AuthContext is checking
    // the refresh token
    if (loading) {
        return <div>Loading...</div>;
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Admin
    if (user.role === "admin") {
        return <AdminDashboard />;
    }

    // Normal user
    if (user.role === "user") {
        return <UserDashboard />;
    }

    // Unknown role
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;