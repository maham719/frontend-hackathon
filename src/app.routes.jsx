import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import VerifyEmail from "./features/auth/pages/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoutes.jsx";
import AgentDashboard from "./features/auth/pages/AgentDashboard.jsx";
import AdminDashboard from "./features/auth/pages/AdminDashboard.jsx";



export const router = createBrowserRouter([

 
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <PublicRoute><Login /></PublicRoute>,
  },
  {
    path: "/register",
    element: <PublicRoute><Register /></PublicRoute>,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path:"/dashboard",
     element:<ProtectedRoute/>
  },
  {
    path:'/agent-dashboard',
    element:<AgentDashboard/>
  },
  {
    path:'/admindashboard',
    element:<AdminDashboard/>
  }
]);