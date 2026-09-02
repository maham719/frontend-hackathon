import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/services/authContext.jsx";
import Loading from "./Loading.jsx";

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    console.log("PublicRoute:", { user, loading });

    if (loading) {
        return <Loading text="Preparing your experience..." />;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PublicRoute;