import { useState } from "react";
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock3,
  LayoutDashboard,
  ListFilter,
  LogOut,
  Menu,
  MessageSquareText,
  Plus,
  Search,
  Settings,
  Sparkles,
  Ticket,
  Users,
  X,
} from "lucide-react";
import Themetogglebutton from "../../../components/Themetogglebutton";
import { useTheme } from "../../../context/ThemeContext.jsx";
import CreateTicket from "../../../pages/CreateTicket.jsx";
import { useAuth } from "../services/authContext.jsx";
import Header from "../../../components/admin/Header.jsx";
import DashboardMain from "../../../components/admin/DashboardMain.jsx";
import AllTickets from "../../../components/admin/AllTickets.jsx";
import Agents from "../../../components/admin/Agents.jsx";
import Customers from "../../../components/admin/Customers.jsx";
import Analytics from "../../../components/admin/Analytics.jsx";
import SettingsPage from "../../../components/admin/Settings.jsx";
import Profile from "../../../components/admin/Profile.jsx";
const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "All Tickets", icon: Ticket },
  { label: "Agents", icon: Users },
  { label: "Customers", icon: CircleUserRound },
  { label: "Analytics", icon: BarChart3 },
];

const stats = [
  {
    label: "Total Tickets",
    value: "248",
    trend: "+12.5%",
    icon: Ticket,
    tone: "violet",
  },
  {
    label: "New",
    value: "32",
    trend: "+8.2%",
    icon: MessageSquareText,
    tone: "blue",
  },
  {
    label: "Assigned",
    value: "41",
    trend: "+4.6%",
    icon: Users,
    tone: "indigo",
  },
  {
    label: "In Progress",
    value: "68",
    trend: "-2.4%",
    icon: Activity,
    tone: "amber",
  },
  {
    label: "Resolved",
    value: "107",
    trend: "+18.3%",
    icon: CheckCircle2,
    tone: "green",
  },
];

const tickets = [
  {
    id: "TKT-4928",
    customer: "Alex Mercer",
    subject: "Double charge on Pro subscription",
    category: "Billing",
    priority: "High",
    agent: "Sarah Khan",
    status: "In Progress",
    updated: "2 min ago",
  },
  {
    id: "TKT-4927",
    customer: "John Smith",
    subject: "Unable to reset password",
    category: "Account",
    priority: "Medium",
    agent: "Alex Johnson",
    status: "Assigned",
    updated: "8 min ago",
  },
  {
    id: "TKT-4926",
    customer: "Maria Khan",
    subject: "Payment failed repeatedly",
    category: "Billing",
    priority: "High",
    agent: "Unassigned",
    status: "New",
    updated: "12 min ago",
  },
  {
    id: "TKT-4925",
    customer: "Liam Wilson",
    subject: "Tracking link is not updating",
    category: "Shipping",
    priority: "Low",
    agent: "Daniel Ahmed",
    status: "Resolved",
    updated: "18 min ago",
  },
];

const agents = [
  {
    name: "Alex Johnson",
    initials: "AJ",
    assigned: 12,
    progress: 5,
    resolved: 27,
    tone: "violet",
  },
  {
    name: "Sarah Khan",
    initials: "SK",
    assigned: 9,
    progress: 4,
    resolved: 31,
    tone: "blue",
  },
  {
    name: "Daniel Ahmed",
    initials: "DA",
    assigned: 15,
    progress: 8,
    resolved: 22,
    tone: "green",
  },
];

const categories = [
  { label: "Billing", value: 72, color: "bg-[#9b5ce7]" },
  { label: "Technical", value: 51, color: "bg-[#6f8cff]" },
  { label: "Account", value: 42, color: "bg-[#58a7f8]" },
  { label: "Shipping", value: 38, color: "bg-[#6fc8a0]" },
  { label: "General", value: 29, color: "bg-[#a99bbf]" },
];

const statusStyles = {
  New: "bg-[#5d9dfc1a] text-[#74a9ff]",
  Assigned: "bg-[#7d5dfc1a] text-[#a995ff]",
  "In Progress": "bg-[#f3ae451a] text-[#e7ad55]",
  Resolved: "bg-[#53c7871a] text-[#4ecb91]",
};

const priorityStyles = {
  High: "bg-[#ff5a5a1a] text-[#ff7777]",
  Medium: "bg-[#f3ae451a] text-[#e7ad55]",
  Low: "bg-[#53c7871a] text-[#4ecb91]",
};

const AdminDashboard = () => {
  const { theme } = useTheme();
  const { logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
   const [activeView, setActiveView] = useState("dashboard");
  const isDark = theme === "dark";
  const filteredTickets = tickets.filter((ticket) =>
    `${ticket.id} ${ticket.customer} ${ticket.subject} ${ticket.category}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const panel = isDark
    ? "border-[#293449] bg-[#121c2d]"
    : "border-[#e8def4] bg-[#f8f3ff]";
  const muted = isDark ? "text-[#9fa9c5]" : "text-[#6c687d]";
  const heading = isDark ? "text-[#f8f0ff]" : "text-[#201d2c]";

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${isDark ? "bg-[#0d1018] text-[#f2edf7]" : "bg-[#eee5f7] text-[#171827]"}`}
    >
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={`fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col justify-between border-r px-5 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"} ${isDark ? "border-[#252b3c] bg-[#101722]" : "border-[#e7dff4] bg-[#f5f0fb]"}`}
        >
          <div>
            <div className="mb-8 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#905ae6] text-white shadow-[0_10px_25px_rgba(144,90,230,0.35)]">
                  <Sparkles size={21} />
                </div>
                <div>
                  <div
                    className={`text-[1.75rem] font-bold leading-none tracking-[-0.06em] ${heading}`}
                  >
                    SupportFlow
                  </div>
                  <div
                    className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${muted}`}
                  >
                    AI SUPPORT
                  </div>
                </div>
              </div>
              <button
                aria-label="Close navigation"
                onClick={() => setMenuOpen(false)}
                className="lg:hidden"
              >
                <X size={20} />
              </button>
            </div>
            <div
              className={`mb-6 rounded-xl border px-3 py-2.5 ${isDark ? "border-[#2a3549] bg-[#171f2d]" : "border-[#e4d8f7] bg-[#eee5fc]"}`}
            >
              <div
                className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${muted}`}
              >
                Workspace
              </div>
              <div
                className={`mt-1 flex items-center justify-between text-sm font-semibold ${heading}`}
              >
                Operations <ChevronRight size={15} />
              </div>
            </div>
            <nav className="space-y-2">
              {navItems.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => {
                    if (label === "All Tickets") setActiveView("tickets");
                    if (label === "Agents") setActiveView("agents");
                    if (label === "Customers") setActiveView("customers");
                    if (label === "Analytics") setActiveView("analytics");
                    if (label === "Dashboard") setActiveView("dashboard");
                    setMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-all ${((label === "Dashboard" && activeView === "dashboard") || (label === "All Tickets" && activeView === "tickets") || (label === "Agents" && activeView === "agents") || (label === "Customers" && activeView === "customers") || (label === "Analytics" && activeView === "analytics")) ? (isDark ? "bg-[#1f2736] text-white shadow-sm" : "bg-[#ebe1ff] text-[#1d1e2d]") : isDark ? "text-[#d7d9ea] hover:bg-[#171f2d]" : "text-[#4a4763] hover:bg-[#efe7ff]"}`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{label}</span>
                  {label === "All Tickets" && (
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${isDark ? "bg-[#2c3850] text-[#cad2eb]" : "bg-white text-[#6a5b83]"}`}
                    >
                      248
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
          <div
            className={`space-y-2 border-t pt-4 ${isDark ? "border-[#293449]" : "border-[#e5dced]"}`}
          >
            <button
              onClick={() => {
                setActiveView("settings");
                setMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium ${muted}`}
            >
              <Settings size={18} />
              Settings
            </button>
            <button
              onClick={() => {
                setActiveView("profile");
                setMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium ${muted}`}
            >
              <CircleUserRound size={18} />
              Profile
            </button>
            <button
            onClick={logout}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium ${muted}`}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {menuOpen && (
          <button
            aria-label="Close navigation overlay"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-20 bg-[#0b0c12]/50 lg:hidden"
          />
        )}
        <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">
        <Header onOpenMenu={() => setMenuOpen(true)} />

        {activeView === "tickets" ? <AllTickets /> : activeView === "agents" ? <Agents /> : activeView === "customers" ? <Customers /> : activeView === "analytics" ? <Analytics /> : activeView === "settings" ? <SettingsPage /> : activeView === "profile" ? <Profile /> : <DashboardMain />}
        </main>
      </div>
    
    </div>
  );
};

export default AdminDashboard;
