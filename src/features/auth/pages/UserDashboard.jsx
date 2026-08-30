import React from "react";
import Themetogglebutton from "../../../components/Themetogglebutton";
import { useTheme } from "../../../context/ThemeContext.jsx";

const navItems = [
  { label: "Dashboard", active: true, icon: "▣" },
  { label: "Tickets", icon: "▤" },
  { label: "Create", icon: "+" },
  { label: "Insights", icon: "✦" },
  { label: "Analytics", icon: "↗" },
];

const summaryCards = [
  { label: "Total Tickets", value: "12", tone: "neutral" },
  { label: "Open", value: "2", tone: "primary" },
  { label: "In Progress", value: "1", tone: "secondary" },
  { label: "Resolved", value: "9", tone: "success" },
];

const ticketRows = [
  { id: "#TK-4029", subject: "Login Authentication Failure", priority: "High", status: "Open", time: "10 mins ago" },
  { id: "#TK-4028", subject: "Billing Cycle Inquiry", priority: "Med", status: "In Progress", time: "1 hr ago" },
  { id: "#TK-4027", subject: "Feature Request: Dark Mode Export", priority: "Low", status: "Closed", time: "Yesterday" },
];

const UserDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        isDark ? "bg-[#0d1018] text-[#f2edf7]" : "bg-[#eee5f7] text-[#171827]"
      }`}
    >
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={`flex w-[260px] flex-col justify-between border-r px-5 py-6 ${
            isDark
              ? "border-[#252b3c] bg-[#101722] text-[#e9dff8]"
              : "border-[#e7dff4] bg-[#f5f0fb] text-[#212437]"
          }`}
        >
          <div>
            <div className="mb-8 flex items-center gap-3 px-2">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg ${
                  isDark ? "bg-[#8d5fe5]" : "bg-[#905ae6]"
                }`}
              >
                ✦
              </div>
              <div>
                <div className="text-2xl font-bold tracking-[-0.05em]">SupportFlow</div>
                <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#98a4d2]" : "text-[#5f6174]"}`}>
                  AI SUPPORT
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map(({ label, active, icon }) => (
                <button
                  key={label}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium transition-colors ${
                    active
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
              ))}
            </nav>
          </div>

          <div className="space-y-2 border-t pt-4">
            <button
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium transition-colors ${
                isDark ? "text-[#d7d9ea] hover:bg-[#171f2d]" : "text-[#4a4763] hover:bg-[#efe7ff]"
              }`}
            >
              <span className="text-sm">⚙</span>
              <span>Settings</span>
            </button>
            <button
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium transition-colors ${
                isDark ? "text-[#d7d9ea] hover:bg-[#171f2d]" : "text-[#4a4763] hover:bg-[#efe7ff]"
              }`}
            >
              <span className="text-sm">◉</span>
              <span>Profile</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-8">
          <header className="mb-8 flex items-center justify-between gap-4">
            <div className="relative w-full max-w-[420px]">
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

            <div className="flex items-center gap-4">
              <nav className="hidden items-center gap-2 md:flex">
                <button className={`rounded-lg px-3 py-2 text-sm font-medium ${isDark ? "text-[#f0ecff]" : "text-[#232338]"}`}>
                  Global View
                </button>
                <button className={`rounded-lg px-3 py-2 text-sm font-medium ${isDark ? "text-[#d7d9ea]" : "text-[#4d475b]"}`}>
                  Teams
                </button>
                <button className={`rounded-lg px-3 py-2 text-sm font-medium ${isDark ? "text-[#d7d9ea]" : "text-[#4d475b]"}`}>
                  Reports
                </button>
              </nav>

              <button className={`rounded-full p-2 ${isDark ? "bg-[#1b2434] text-[#e9dff8]" : "bg-[#f8f3ff] text-[#201a2d]"}`}>
                ◔
              </button>
              <Themetogglebutton />
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#8d5fe5] bg-gradient-to-br from-[#d7c3ff] to-[#8d5fe5] text-sm font-bold text-[#1b1027]`}>
                A
              </div>
            </div>
          </header>

          <section
            className={`rounded-[22px] border p-6 shadow-[0_20px_45px_rgba(67,47,92,0.12)] ${
              isDark
                ? "border-[#232d3f] bg-[#121c2d]"
                : "border-[#e8def4] bg-[#f8f3ff]"
            }`}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h1 className={`text-4xl font-semibold tracking-[-0.05em] ${isDark ? "text-[#f8f0ff]" : "text-[#1f1f2e]"}`}>
                  Hello, Alex!
                </h1>
                <p className={`mt-2 text-base ${isDark ? "text-[#d8cfe7]" : "text-[#4f4a5d]"}`}>
                  Here is what&apos;s happening with your support queue today.
                </p>
              </div>

              <button className="rounded-xl bg-gradient-to-r from-[#9b5ce7] to-[#7f46d9] px-5 py-3 text-base font-semibold text-white shadow-[0_12px_25px_rgba(127,70,217,0.35)] transition-transform hover:scale-[1.01]">
                + Create New Ticket
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {summaryCards.map(({ label, value, tone }) => (
                <div
                  key={label}
                  className={`rounded-[18px] border p-5 ${
                    tone === "neutral"
                      ? isDark
                        ? "border-[#2b354a] bg-[#1a1d2b]"
                        : "border-[#e4daf6] bg-[#f4f0fb]"
                      : tone === "primary"
                        ? "border-[#7a5fde] bg-[rgba(92,81,204,0.12)]"
                        : tone === "secondary"
                          ? "border-[#5a7dff] bg-[rgba(75,108,255,0.12)]"
                          : "border-[#4bc58c] bg-[rgba(75,197,140,0.12)]"
                  }`}
                >
                  <div className={`mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] ${isDark ? "text-[#d0d5ec]" : "text-[#4e4e62]"}`}>
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${
                        tone === "neutral"
                          ? "bg-[#e3ddf4]"
                          : tone === "primary"
                            ? "bg-[#8d5fe5]"
                            : tone === "secondary"
                              ? "bg-[#5b8cff]"
                              : "bg-[#4bc58c]"
                      }`}
                    />
                    {label}
                  </div>
                  <div className={`text-5xl font-semibold tracking-[-0.06em] ${isDark ? "text-[#f4ebff]" : "text-[#18192a]"}`}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-8 rounded-[18px] border ${isDark ? "border-[#2b3548] bg-[#131b2a]" : "border-[#e7dff3] bg-[#f4f1fb]"}`}>
              <div className="flex items-center justify-between border-b px-5 py-4">
                <h2 className={`text-2xl font-semibold tracking-[-0.05em] ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
                  Recent Tickets
                </h2>
                <button className={`text-sm font-medium ${isDark ? "text-[#d2c5ef]" : "text-[#675f7d]"}`}>
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className={isDark ? "bg-[#171f2f] text-[#d0d6ee]" : "bg-[#f0ebf9] text-[#4b4661]"}>
                    <tr>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]">Ticket #</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]">Subject</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]">Priority</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]">Status</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticketRows.map(({ id, subject, priority, status, time }) => (
                      <tr key={id} className={isDark ? "border-t border-[#212d3e]" : "border-t border-[#e8def6]"}>
                        <td className={`px-5 py-4 font-medium ${isDark ? "text-[#edf0ff]" : "text-[#252336]"}`}>{id}</td>
                        <td className={`px-5 py-4 ${isDark ? "text-[#dfe6ff]" : "text-[#36354d]"}`}>{subject}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              priority === "High"
                                ? "bg-[#ff5a5a1a] text-[#ff6d6d]"
                                : priority === "Med"
                                  ? "bg-[#3d77ff1a] text-[#5f8cff]"
                                  : "bg-[#5ac0871a] text-[#4dbe88]"
                            }`}
                          >
                            {priority === "High" ? "! High" : priority}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              status === "Open"
                                ? "bg-[#5d9dfc1a] text-[#74a9ff]"
                                : status === "In Progress"
                                  ? "bg-[#7d5dfc1a] text-[#a995ff]"
                                  : "bg-[#53c7871a] text-[#4ecb91]"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className={`px-5 py-4 ${isDark ? "text-[#dfe3ef]" : "text-[#4a485e]"}`}>{time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
