import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/services/authContext.jsx";

import UserDashboard from "../features/auth/pages/UserDashboard.jsx";
import Loading from "./Loading.jsx";
import AgentDashboard from "../features/auth/pages/AgentDashboard.jsx";
import AdminDashboard from "../features/auth/pages/AdminDashboard.jsx";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

   console.log("ProtectedRoute user:", user);
console.log("ProtectedRoute role:", user?.role);
console.log("ProtectedRoute loading:", loading);
    // Don't redirect while AuthContext is checking
    // the refresh token
    if (loading) {
        return <Loading text="Authenticating your session..." />;
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Admin

   if (user.role === "admin") {
        return <AdminDashboard />;
    }

    if (user.role === "agent") {
        return <AgentDashboard />;
    }

    // Normal user
    if (user.role === "user") {
        return <UserDashboard />;
    }

    // Unknown role
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;