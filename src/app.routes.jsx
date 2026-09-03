import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import VerifyEmail from "./features/auth/pages/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoutes.jsx";
import AgentDashboard from "./features/agent/pages/AgentDashboard.jsx";
import AdminDashboard from "./features/admin/pages/AdminDashboard.jsx";
import UserAnalytics from "./features/user/components/UserAnalytics.jsx";
import TicketDetail from "./features/user/components/TicketDetail.jsx";
import AgentTicketDetails from "./features/agent/components/TicketDetails.jsx";
import InvalidEmail from "./features/auth/pages/InvalidEmail.jsx";

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
  path: "/invalid-email",
  element: <InvalidEmail/>
},
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
  },
  {
    path: "/insights",
    element: <UserAnalytics />,
  },
  {
    path: "/agent-dashboard",
    element: <AgentDashboard />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/tickets/:ticketId",
    element: <TicketDetail />,
  },
  {
    path: "/agent-dashboard/tickets/:ticketId",
    element: <AgentTicketDetails />,
  },
]);