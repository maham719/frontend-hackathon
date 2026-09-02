
import { useState } from "react";
import { LogOut, X } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext.jsx";
import { useAuth } from "../services/authContext.jsx";
import Header from "../../../components/agent/Header.jsx";
import DashboardMain from "../../../components/agent/DashboardMain.jsx";
import AllTickets from "../../../components/agent/AllTickets.jsx";
import Analytics from "../../../components/agent/Analytics.jsx";
import Profile from "../../../components/agent/Profile.jsx";
import Settings from "../../../components/agent/Settings.jsx";

const navItems = [
  { label: "Dashboard", icon: "▣" },
  { label: "Tickets", icon: "▤" },
  { label: "Analytics", icon: "↗" },
];

const summaryCards = [
  { label: "New Tickets", value: "5", meta: "+2 from last hr", tone: "neutral" },
  { label: "Assigned to Me", value: "12", tone: "secondary" },
  { label: "In Progress (AI Assisted)", value: "8", tone: "primary" },
  { label: "Resolved Today", value: "15", meta: "↗", tone: "success" },
];

const ticketRows = [
  { id: "#SF-8092", subject: "Integration API failure", customer: "Acme Corp", category: "Technical", priority: "High", status: "In Progress", updated: "2 mins ago" },
  { id: "#SF-8091", subject: "Billing cycle incorrect", customer: "Sarah Jenkins", category: "Billing", priority: "Medium", status: "New", updated: "15 mins ago" },
  { id: "#SF-8088", subject: "Password reset loop", customer: "Global Tech", category: "Access", priority: "High", status: "AI Responding", updated: "1 hr ago" },
  { id: "#SF-8085", subject: "Feature request: Data export", customer: "Nexa Logistics", category: "Product", priority: "Low", status: "Resolved", updated: "3 hrs ago" },
  { id: "#SF-8079", subject: "Dashboard latency issues", customer: "Pinnacle Corp", category: "Performance", priority: "Medium", status: "In Progress", updated: "Yesterday" },
];

const AgentDashboard = () => {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const isDark = theme === "dark";
  const [activeView, setActiveView] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectView = (view) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  const renderActiveView = () => {
    if (activeView === "Tickets") return <AllTickets />;
    if (activeView === "Analytics") return <Analytics />;
    if (activeView === "Profile") return <Profile />;
    if (activeView === "Settings") return <Settings />;
    return <DashboardMain />;
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        isDark ? "bg-[#0c121b] text-[#eef3ff]" : "bg-[#eee5f7] text-[#191b2b]"
      }`}
    >
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-[#080b12]/60 lg:hidden"
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-70 flex-col justify-between border-r px-3 py-4 shadow-[12px_0_35px_rgba(15,10,30,0.18)] transition-transform duration-200 sm:px-5 lg:static lg:z-auto lg:w-65 lg:translate-x-0 lg:border-b-0 lg:shadow-none lg:py-5 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${
            isDark
              ? "border-[#232d3d] bg-[#0d1420] text-[#edf1ff]"
              : "border-[#e7dff4] bg-[#f6f1fc] text-[#1f2133]"
          }`}
        >
          <div>
            <div className="mb-8 flex items-center justify-between gap-3 px-2">
              <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg ${
                  isDark ? "bg-[#8d5fe5]" : "bg-[#905ae6]"
                }`}
              >
                ✦
              </div>
              <div>
                <div className="text-[1.9rem] font-bold leading-none tracking-tighter">SupportFlow</div>
                <div className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-[#9aa9d3]" : "text-[#5a5c76]"}`}>
                  AI SUPPORT
                </div>
              </div>
              </div>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setSidebarOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9fa9c5] hover:bg-[#1d2434] lg:hidden"
              >
                <X size={19} />
              </button>
            </div>

         

            <nav className="space-y-2">
              {navItems.map(({ label, icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => selectView(label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors lg:text-base ${
                    activeView === label
                      ? isDark
                        ? "bg-[#1d2434] text-white"
                        : "bg-[#efe7ff] text-[#171827]"
                      : isDark
                        ? "text-[#d9def0] hover:bg-[#151f2d]"
                        : "text-[#4e4b5d] hover:bg-[#f1e8ff]"
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center text-sm">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-3 space-y-2 border-t pt-3 lg:mt-0 lg:pt-4">
            <button
              type="button"
              onClick={() => selectView("Settings")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors lg:text-base ${
                activeView === "Settings"
                  ? isDark
                    ? "bg-[#1d2434] text-white"
                    : "bg-[#efe7ff] text-[#171827]"
                  : isDark
                    ? "text-[#d9def0] hover:bg-[#151f2d]"
                    : "text-[#4e4b5d] hover:bg-[#f1e8ff]"
              }`}
            >
              <span className="text-sm">⚙</span>
              <span>Settings</span>
            </button>
            <button
              type="button"
              onClick={() => selectView("Profile")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors lg:text-base ${
                activeView === "Profile"
                  ? isDark
                    ? "bg-[#1d2434] text-white"
                    : "bg-[#efe7ff] text-[#171827]"
                  : isDark
                    ? "text-[#d9def0] hover:bg-[#151f2d]"
                    : "text-[#4e4b5d] hover:bg-[#f1e8ff]"
              }`}
            >
              <span className="text-sm">◉</span>
              <span>Profile</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                logout();
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors lg:text-base ${
                isDark
                  ? "text-[#d9def0] hover:bg-[#151f2d]"
                  : "text-[#4e4b5d] hover:bg-[#f1e8ff]"
              }`}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-7">
      <Header onMenuToggle={() => setSidebarOpen(true)} />

        {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default AgentDashboard;
