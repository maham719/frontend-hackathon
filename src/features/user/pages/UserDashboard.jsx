import React, { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import Themetogglebutton from "../../../components/Themetogglebutton.jsx";
import DashboardMain from "../components/DashboardMain.jsx";
import { useTheme } from "../../../context/ThemeContext.jsx";
import CreateTicket from "../components/CreateTicket.jsx";
import UserAnalytics from "../components/UserAnalytics.jsx";
import AllTickets from "../components/AllTickets.jsx";
import { useAuth } from "../../auth/context/authContext.jsx";
import NotificationBell from "../../../components/NotificationBell.jsx";
const navItems = [
  { label: "Dashboard", icon: "▣" },
  { label: "Tickets", icon: "▤" },
  { label: "Analytics", icon: "↗" },
];




const UserDashboard = () => {
  const { theme } = useTheme();
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDark = theme === "dark";
  const { user, logout } = useAuth();
  const handleCreateTicket = () => setTicketModalOpen(true);
  const selectView = (view) => {
    setActiveView(view);
    setSidebarOpen(false);
  };



  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        isDark ? "bg-[#0d1018] text-[#f2edf7]" : "bg-[#eee5f7] text-[#171827]"
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
          className={`fixed inset-y-0 left-0 z-40 flex w-70 flex-col justify-between border-r px-3 py-4 shadow-[12px_0_35px_rgba(15,10,30,0.18)] transition-transform duration-200 sm:px-5 lg:static lg:z-auto lg:w-65 lg:translate-x-0 lg:border-b-0 lg:shadow-none lg:py-6 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${
            isDark
              ? "border-[#252b3c] bg-[#101722] text-[#e9dff8]"
              : "border-[#e7dff4] bg-[#f5f0fb] text-[#212437]"
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
                <div className="text-2xl font-bold tracking-tighter">SupportFlow</div>
                <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#98a4d2]" : "text-[#5f6174]"}`}>
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
              {navItems.map(({ label, icon }) => {
                const isActive = activeView === (label === "Dashboard" ? "dashboard" : label === "Analytics" ? "analytics" : "tickets");

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      selectView(label === "Dashboard" ? "dashboard" : label === "Analytics" ? "analytics" : "tickets");
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors lg:text-base ${
                      isActive
                        ? isDark
                          ? "bg-[#1f2736] text-white"
                          : "bg-[#ebe1ff] text-[#1d1e2d]"
                        : isDark
                          ? "text-[#d7d9ea] hover:bg-[#171f2d]"
                          : "text-[#4a4763] hover:bg-[#efe7ff]"
                    }`}
                  >
                    <span className="flex h-5 w-5 items-center justify-center text-sm">{icon}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-3 border-t pt-3 lg:mt-0 lg:space-y-2 lg:pt-4">
            <button
              type="button"
              onClick={() => { setSidebarOpen(false); logout(); }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors lg:text-base ${
                isDark ? "text-[#d7d9ea] hover:bg-[#171f2d]" : "text-[#4a4763] hover:bg-[#efe7ff]"
              }`}
            >
              <LogOut size={18} className="shrink-0" />
              <span>Logout</span>
            </button>
            
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#8d5fe5] bg-[#1b2434] text-[#f3edff] lg:hidden"
            >
              <Menu size={19} />
            </button>
            <div className="relative order-3 w-full max-w-105 lg:order-0">
              <input
                type="text"
                placeholder="Search tickets, customers, or insights..."
                className={`w-full rounded-xl border px-4 py-3 pl-11 text-sm outline-none transition-colors placeholder:text-[#7f7a8c] ${
                  isDark
                    ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff] focus:border-[#8d5fe5]"
                    : "border-[#e9ddf9] bg-[#f9f5ff] text-[#171827] focus:border-[#a36ae8]"
                }`}
              />
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-base ${isDark ? "text-[#c6c7d9]" : "text-[#5c5d72]"}`}>
                ⌕
              </span>
            </div>

            <div className="ml-auto flex items-center gap-3 sm:gap-4">
              <Themetogglebutton />
              <NotificationBell />
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#8d5fe5] bg-linear-to-br from-[#d7c3ff] to-[#8d5fe5] text-sm font-bold text-[#1b1027]`}>
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </header>

          {activeView === "analytics" ? (
            <UserAnalytics embedded />
          ) : activeView === "tickets" ? (
            <AllTickets />
          ) : (
            <DashboardMain onCreateTicket={handleCreateTicket} />
          )}
        </main>
      </div>

      {ticketModalOpen && <CreateTicket onClose={() => setTicketModalOpen(false)} />}
    </div>
  );
};

export default UserDashboard;
