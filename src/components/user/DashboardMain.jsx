
import React, { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../features/auth/services/authContext.jsx";
import {useTicket} from "../../features/tickets/context/TicketContext.jsx"






const DashboardMain = ({ onCreateTicket }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const {
    tickets,
    getCustomerTickets,
    loading,
    error
} = useTicket();

const recentTickets = [...tickets]
    .sort(
        (a, b) =>
            new Date(b.updatedAt) - new Date(a.updatedAt)
    )
    .slice(0, 5);
  const isDark = theme === "dark";
useEffect(() => {
    if (!user) return;

    getCustomerTickets();
}, [user]);
console.log("REAL TICKETS:", tickets);


const totalTickets = tickets.length;

const openTickets = tickets.filter(
  (ticket) => ticket.status === "open"
).length;

const inProgressTickets = tickets.filter(
  (ticket) => ticket.status === "in_progress"
).length;

const resolvedTickets = tickets.filter(
  (ticket) =>
    ticket.status === "resolved" ||
    ticket.status === "closed"
).length;

const summaryCards = [
  {
    label: "Total Tickets",
    value: totalTickets,
    tone: "neutral"
  },
  {
    label: "Open",
    value: openTickets,
    tone: "primary"
  },
  {
    label: "In Progress",
    value: inProgressTickets,
    tone: "secondary"
  },
  {
    label: "Resolved",
    value: resolvedTickets,
    tone: "success"
  }
];



  return (
    <section
      className={`rounded-[22px] border p-6 shadow-[0_20px_45px_rgba(67,47,92,0.12)] ${
        isDark ? "border-[#232d3f] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"
      }`}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
         <h1
  className={`text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.05em] ${
    isDark ? "text-[#f8f0ff]" : "text-[#1f1f2e]"
  }`}
>
  Hello, {user?.username || "User"}!
</h1>
         <p
  className={`mt-2 text-sm sm:text-base ${
    isDark ? "text-[#d8cfe7]" : "text-[#4f4a5d]"
  }`}
>
  Here is what&apos;s happening with your support queue today.
</p>
        </div>

       <button
  type="button"
  onClick={onCreateTicket}
  className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#9b5ce7] to-[#7f46d9] px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-[0_12px_25px_rgba(127,70,217,0.35)] transition-transform hover:scale-[1.01]"
>
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
  {recentTickets.length === 0 ? (
    <tr>
      <td
        colSpan="5"
        className={`px-5 py-10 text-center ${
          isDark ? "text-[#a9afd4]" : "text-[#67627b]"
        }`}
      >
        No tickets found.
      </td>
    </tr>
  ) : (
    tickets.map((ticket) => (
      <tr
        key={ticket._id}
        className={
          isDark
            ? "border-t border-[#212d3e]"
            : "border-t border-[#e8def6]"
        }
      >
        <td
          className={`px-5 py-4 font-medium ${
            isDark ? "text-[#edf0ff]" : "text-[#252336]"
          }`}
        >
          #{ticket._id.slice(-6).toUpperCase()}
        </td>

        <td
          className={`px-5 py-4 ${
            isDark ? "text-[#dfe6ff]" : "text-[#36354d]"
          }`}
        >
          {ticket.subject}
        </td>

        <td className="px-5 py-4">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              ticket.priority === "high" ||
              ticket.priority === "urgent"
                ? "bg-[#ff5a5a1a] text-[#ff6d6d]"
                : ticket.priority === "medium"
                ? "bg-[#3d77ff1a] text-[#5f8cff]"
                : "bg-[#5ac0871a] text-[#4dbe88]"
            }`}
          >
            {ticket.priority}
          </span>
        </td>

        <td className="px-5 py-4">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              ticket.status === "open"
                ? "bg-[#5d9dfc1a] text-[#74a9ff]"
                : ticket.status === "in_progress"
                ? "bg-[#7d5dfc1a] text-[#a995ff]"
                : "bg-[#53c7871a] text-[#4ecb91]"
            }`}
          >
            {ticket.status === "in_progress"
              ? "In Progress"
              : ticket.status.charAt(0).toUpperCase() +
                ticket.status.slice(1)}
          </span>
        </td>

        <td
          className={`px-5 py-4 ${
            isDark ? "text-[#dfe3ef]" : "text-[#4a485e]"
          }`}
        >
          {new Date(ticket.updatedAt).toLocaleString()}
        </td>
      </tr>
    ))
  )}
</tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default DashboardMain;
