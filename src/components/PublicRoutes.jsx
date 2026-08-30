import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/services/authContext.jsx";

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    console.log("PublicRoute:", { user, loading });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PublicRoute;