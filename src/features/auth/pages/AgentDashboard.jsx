import React from "react";
import Themetogglebutton from "../../../components/Themetogglebutton";
import { useTheme } from "../../../context/ThemeContext.jsx";

const navItems = [
  { label: "Dashboard", active: true, icon: "▣" },
  { label: "Tickets", icon: "▤" },
  { label: "Create", icon: "+" },
  { label: "AI Insights", icon: "✦" },
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
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        isDark ? "bg-[#0c121b] text-[#eef3ff]" : "bg-[#eee5f7] text-[#191b2b]"
      }`}
    >
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={`flex w-[260px] flex-col justify-between border-r px-5 py-5 ${
            isDark
              ? "border-[#232d3d] bg-[#0d1420] text-[#edf1ff]"
              : "border-[#e7dff4] bg-[#f6f1fc] text-[#1f2133]"
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
                <div className="text-[1.9rem] font-bold leading-none tracking-[-0.05em]">SupportFlow</div>
                <div className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-[#9aa9d3]" : "text-[#5a5c76]"}`}>
                  AI SUPPORT
                </div>
              </div>
            </div>

            <button
              className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#9b5ce7] to-[#7f46d9] px-4 py-3 text-base font-semibold text-white shadow-[0_12px_25px_rgba(127,70,217,0.35)] transition-transform hover:scale-[1.01]"
            >
              <span className="text-lg">＋</span>
              <span>New Ticket</span>
            </button>

            <nav className="space-y-2">
              {navItems.map(({ label, active, icon }) => (
                <button
                  key={label}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium transition-colors ${
                    active
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

          <div className="space-y-2 border-t pt-4">
            <button
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium transition-colors ${
                isDark ? "text-[#d9def0] hover:bg-[#151f2d]" : "text-[#4e4b5d] hover:bg-[#f1e8ff]"
              }`}
            >
              <span className="text-sm">⚙</span>
              <span>Settings</span>
            </button>
            <button
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium transition-colors ${
                isDark ? "text-[#d9def0] hover:bg-[#151f2d]" : "text-[#4e4b5d] hover:bg-[#f1e8ff]"
              }`}
            >
              <span className="text-sm">◉</span>
              <span>Profile</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-7">
          <header className="mb-6 flex items-center justify-between gap-4">
            <div className="hidden items-center gap-2 md:flex">
              <button className={`rounded-lg px-3 py-2 text-sm font-medium ${isDark ? "text-[#f4f0ff]" : "text-[#22253b]"}`}>
                Global View
              </button>
              <button className={`rounded-lg px-3 py-2 text-sm font-medium ${isDark ? "text-[#d9def0]" : "text-[#4d4b60]"}`}>
                Teams
              </button>
              <button className={`rounded-lg px-3 py-2 text-sm font-medium ${isDark ? "text-[#d9def0]" : "text-[#4d4b60]"}`}>
                Reports
              </button>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button className={`rounded-full p-2 ${isDark ? "bg-[#171f2d] text-[#eae9ff]" : "bg-[#f8f3ff] text-[#2a2135]"}`}>
                ◔
              </button>
              <button className={`rounded-full p-2 ${isDark ? "bg-[#171f2d] text-[#eae9ff]" : "bg-[#f8f3ff] text-[#2a2135]"}`}>
                ◌
              </button>
              <Themetogglebutton />
              <div className="flex items-center gap-3 rounded-full border border-[#8d5fe5] bg-[#1b2434] px-2 py-1 pr-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#d7c3ff] to-[#8d5fe5] text-sm font-bold text-[#1b1027]">
                  A
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#f3edff]">Alex Chen</div>
                  <div className="text-[10px] text-[#b8bdd8]">L3 Support Specialist</div>
                </div>
              </div>
            </div>
          </header>

          <section
            className={`rounded-[22px] border p-6 shadow-[0_20px_45px_rgba(67,47,92,0.12)] ${
              isDark
                ? "border-[#2b3548] bg-[#101b2a]"
                : "border-[#e9def7] bg-[#f7f3ff]"
            }`}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h1 className={`text-[2.2rem] font-semibold tracking-[-0.055em] ${isDark ? "text-[#f4ecff]" : "text-[#1e2330]"}`}>
                  Queue Overview
                </h1>
                <p className={`mt-1 text-base ${isDark ? "text-[#d8cfe7]" : "text-[#4c4c60]"}`}>
                  Manage and resolve active support requests.
                </p>
              </div>

              <div className="relative w-[300px]">
                <input
                  type="text"
                  placeholder="Search all tickets..."
                  className={`w-full rounded-xl border px-4 py-3 pl-11 text-sm outline-none transition-colors placeholder:text-[#7f7a8c] ${
                    isDark
                      ? "border-[#2b3548] bg-[#1b2330] text-[#f3ebff] focus:border-[#8d5fe5]"
                      : "border-[#e7dff4] bg-[#f9f5ff] text-[#171827] focus:border-[#a36ae8]"
                  }`}
                />
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-base ${isDark ? "text-[#c4cbe3]" : "text-[#5c5d72]"}`}>
                  ⌕
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {summaryCards.map(({ label, value, meta, tone }) => {
                const toneStyles =
                  tone === "neutral"
                    ? isDark
                      ? "border-[#2b3447] bg-[#171d2a]"
                      : "border-[#e5daf4] bg-[#f4f0fb]"
                    : tone === "secondary"
                      ? isDark
                        ? "border-[#6f73b8] bg-[#363a5d]"
                        : "border-[#d8d2ff] bg-[#eee9ff]"
                      : tone === "primary"
                        ? isDark
                          ? "border-[#8d5fe5] bg-[#2f2f57]"
                          : "border-[#d6c3ff] bg-[#f1eaff]"
                        : isDark
                          ? "border-[#3a7f67] bg-[#1f3d35]"
                          : "border-[#ccefdc] bg-[#ecfbf2]";

                const dotStyles =
                  tone === "neutral"
                    ? "bg-[#e3ddf4]"
                    : tone === "secondary"
                      ? "bg-[#8e9cff]"
                      : tone === "primary"
                        ? "bg-[#8d5fe5]"
                        : "bg-[#4bc58c]";

                return (
                  <div key={label} className={`rounded-[18px] border p-5 ${toneStyles}`}>
                    <div className={`mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-[#d5d8ee]" : "text-[#4c5070]"}`}>
                      <span className={`inline-block h-2.5 w-2.5 rounded-full ${dotStyles}`} />
                      {label}
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <div className={`text-[3.6rem] font-semibold leading-none tracking-[-0.06em] ${isDark ? "text-[#f9f2ff]" : "text-[#1a1b2d]"}`}>
                        {value}
                      </div>
                      {meta && (
                        <div className={`text-sm font-medium ${isDark ? "text-[#d7d9ea]" : "text-[#49506a]"}`}>
                          {meta}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${isDark ? "border-[#2c3245] bg-[#151d2b] text-[#edf4ff]" : "border-[#e7dff4] bg-[#f8f4ff] text-[#2a2d3d]"}`}>
                  <span>Status: All</span>
                  <span>▾</span>
                </button>
                <button className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${isDark ? "border-[#2c3245] bg-[#151d2b] text-[#edf4ff]" : "border-[#e7dff4] bg-[#f8f4ff] text-[#2a2d3d]"}`}>
                  <span>Priority: High</span>
                  <span>▾</span>
                </button>
                <button className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${isDark ? "border-[#2c3245] bg-[#151d2b] text-[#edf4ff]" : "border-[#e7dff4] bg-[#f8f4ff] text-[#2a2d3d]"}`}>
                  <span>Category: All</span>
                  <span>▾</span>
                </button>
              </div>

              <button className={`text-sm font-medium ${isDark ? "text-[#d8d4e8]" : "text-[#4d4f68]"}`}>
                Clear Filters
              </button>
            </div>

            <div className={`mt-5 overflow-hidden rounded-[18px] border ${isDark ? "border-[#2b3548] bg-[#121b2a]" : "border-[#e7dff3] bg-[#f4f1fb]"}`}>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className={isDark ? "bg-[#171f2f] text-[#d5d9ee]" : "bg-[#f0ebf9] text-[#4b4661]"}>
                    <tr>
                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em]">Ticket #</th>
                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em]">Subject</th>
                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em]">Customer</th>
                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em]">Category</th>
                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em]">Priority</th>
                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em]">Status</th>
                      <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em]">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticketRows.map(({ id, subject, customer, category, priority, status, updated }) => (
                      <tr key={id} className={isDark ? "border-t border-[#212d3e]" : "border-t border-[#e8def6]"}>
                        <td className={`px-5 py-4 font-medium ${isDark ? "text-[#eef1ff]" : "text-[#2c2d39]"}`}>{id}</td>
                        <td className={`px-5 py-4 ${isDark ? "text-[#dfe8ff]" : "text-[#33364b]"}`}>{subject}</td>
                        <td className={`px-5 py-4 ${isDark ? "text-[#dfe8ff]" : "text-[#33364b]"}`}>{customer}</td>
                        <td className={`px-5 py-4 ${isDark ? "text-[#dfe8ff]" : "text-[#33364b]"}`}>{category}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              priority === "High"
                                ? "bg-[#ff5a5a1a] text-[#ff6d6d]"
                                : priority === "Medium"
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
                              status === "In Progress"
                                ? "bg-[#7d5dfc1a] text-[#a995ff]"
                                : status === "New"
                                  ? "bg-[#7a8cff1a] text-[#8ea4ff]"
                                  : status === "AI Responding"
                                    ? "bg-[#4d7cff1a] text-[#7ea7ff]"
                                    : "bg-[#53c7871a] text-[#4ecb91]"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className={`px-5 py-4 ${isDark ? "text-[#dae0f0]" : "text-[#4a495f]"}`}>{updated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={`flex items-center justify-between border-t px-5 py-4 ${isDark ? "border-[#212d3e] text-[#dfe4ef]" : "border-[#e8def6] text-[#4e4d68]"}`}>
                <div>Showing 1 to 5 of 42 entries</div>
                <div className="flex items-center gap-2">
                  <button className={`flex h-8 w-8 items-center justify-center rounded-md border ${isDark ? "border-[#2d3548] bg-[#151d2b]" : "border-[#e7dff4] bg-[#f7f4ff]"}`}>&lt;</button>
                  <button className={`flex h-8 w-8 items-center justify-center rounded-md bg-[#8d5fe5] text-white`}>1</button>
                  <button className={`flex h-8 w-8 items-center justify-center rounded-md border ${isDark ? "border-[#2d3548] bg-[#151d2b]" : "border-[#e7dff4] bg-[#f7f4ff]"}`}>2</button>
                  <button className={`flex h-8 w-8 items-center justify-center rounded-md border ${isDark ? "border-[#2d3548] bg-[#151d2b]" : "border-[#e7dff4] bg-[#f7f4ff]"}`}>3</button>
                  <button className={`flex h-8 w-8 items-center justify-center rounded-md border ${isDark ? "border-[#2d3548] bg-[#151d2b]" : "border-[#e7dff4] bg-[#f7f4ff]"}`}>&gt;</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AgentDashboard;
