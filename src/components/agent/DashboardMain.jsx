import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useTicket } from "../../features/tickets/context/TicketContext.jsx";

const DashboardMain = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { tickets, loading, error, getAgentTickets } = useTicket();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    getAgentTickets();
  }, [getAgentTickets]);

  const categories = useMemo(
    () => [...new Set(tickets.map((ticket) => ticket.category).filter(Boolean))],
    [tickets]
  );

  const filteredTickets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const searchable = `${ticket._id || ""} ${ticket.subject || ""} ${ticket.customer?.username || ""} ${ticket.customer?.email || ""}`.toLowerCase();
      return (
        searchable.includes(normalizedQuery) &&
        (!statusFilter || ticket.status === statusFilter) &&
        (!priorityFilter || ticket.priority === priorityFilter) &&
        (!categoryFilter || ticket.category === categoryFilter)
      );
    });
  }, [tickets, query, statusFilter, priorityFilter, categoryFilter]);

  const summaryCards = useMemo(() => {
    const today = new Date();
    const isToday = (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date.toDateString() === today.toDateString();
    };
    const openTickets = tickets.filter((ticket) => ticket.status === "open").length;
    const inProgressTickets = tickets.filter((ticket) => ticket.status === "in_progress").length;
    const resolvedToday = tickets.filter(
      (ticket) => ["resolved", "closed"].includes(ticket.status) && isToday(ticket.updatedAt)
    ).length;

    return [
      { label: "New Tickets", value: openTickets, meta: "Currently open", tone: "neutral" },
      { label: "Assigned to Me", value: tickets.length, meta: "Total assigned", tone: "secondary" },
      { label: "In Progress (AI Assisted)", value: inProgressTickets, meta: "Being handled", tone: "primary" },
      { label: "Resolved Today", value: resolvedToday, meta: "Updated today", tone: "success" },
    ];
  }, [tickets]);


  return (
   <section
            className={`rounded-[22px] border p-6 shadow-[0_20px_45px_rgba(67,47,92,0.12)] ${
              isDark
                ? "border-[#2b3548] bg-[#101b2a]"
                : "border-[#e9def7] bg-[#f7f3ff]"
            }`}
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className={`text-[2.2rem] font-semibold tracking-[-0.055em] ${isDark ? "text-[#f4ecff]" : "text-[#1e2330]"}`}>
                  Queue Overview
                </h1>
                <p className={`mt-1 text-base ${isDark ? "text-[#d8cfe7]" : "text-[#4c4c60]"}`}>
                  Manage and resolve active support requests.
                </p>
              </div>

              <div className="relative w-full max-w-75">
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
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
                {[
                  ["Status", statusFilter, setStatusFilter, ["open", "in_progress", "resolved", "closed"]],
                  ["Priority", priorityFilter, setPriorityFilter, ["low", "medium", "high", "urgent"]],
                  ["Category", categoryFilter, setCategoryFilter, categories],
                ].map(([label, value, setter, options]) => (
                  <select
                    key={label}
                    value={value}
                    onChange={(event) => setter(event.target.value)}
                    aria-label={`Filter by ${label.toLowerCase()}`}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium ${isDark ? "border-[#2c3245] bg-[#151d2b] text-[#edf4ff]" : "border-[#e7dff4] bg-[#f8f4ff] text-[#2a2d3d]"}`}
                  >
                    <option value="">{label}: All</option>
                    {options.map((option) => (
                      <option key={option} value={option}>{option.replace("_", " ")}</option>
                    ))}
                  </select>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setStatusFilter("");
                  setPriorityFilter("");
                  setCategoryFilter("");
                }}
                className={`text-sm font-medium ${isDark ? "text-[#d8d4e8]" : "text-[#4d4f68]"}`}
              >
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
                 {loading ? (
    <tr>
        <td colSpan="7" className="px-5 py-8 text-center">
            Loading tickets...
        </td>
    </tr>
) : error ? (
    <tr>
        <td colSpan="7" className="px-5 py-8 text-center text-red-500">
            {error}
        </td>
    </tr>
) : filteredTickets.length === 0 ? (
    <tr>
        <td colSpan="7" className="px-5 py-8 text-center">
      No tickets match the current filters.
        </td>
    </tr>
) : (
  filteredTickets.map((ticket) => (
        <tr
            key={ticket._id}
      onClick={() => navigate(`/agent-dashboard/tickets/${ticket._id}`)}
      className={`cursor-pointer ${isDark ? "hover:bg-[#172335]" : "hover:bg-[#eee8f8]"}`}
        >
            <td className={`px-5 py-4 font-medium ${
                isDark ? "text-[#eef1ff]" : "text-[#2c2d39]"
            }`}>
                TKT-{ticket._id?.slice(-6).toUpperCase() || "NEW"}
            </td>

            <td className={`px-5 py-4 ${
                isDark ? "text-[#dfe8ff]" : "text-[#33364b]"
            }`}>
                {ticket.subject || "Untitled ticket"}
            </td>

            <td className={`px-5 py-4 ${
                isDark ? "text-[#dfe8ff]" : "text-[#33364b]"
            }`}>
                {ticket.customer?.username ||
                 ticket.customer?.email ||
                 "Unknown"}
            </td>

            <td className={`px-5 py-4 ${
                isDark ? "text-[#dfe8ff]" : "text-[#33364b]"
            }`}>
                {ticket.category || "General"}
            </td>

            <td className="px-5 py-4">
                <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        ticket.priority === "high" || ticket.priority === "urgent"
                            ? "bg-[#ff5a5a1a] text-[#ff6d6d]"
                            : ticket.priority === "medium"
                                ? "bg-[#3d77ff1a] text-[#5f8cff]"
                                : "bg-[#5ac0871a] text-[#4dbe88]"
                    }`}
                >
                    {ticket.priority === "high"
                        ? ticket.priority
                        : ticket.priority || "medium"}
                </span>
            </td>

            <td className="px-5 py-4">
                <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        ticket.status === "in_progress"
                            ? "bg-[#7d5dfc1a] text-[#a995ff]"
                            : ticket.status === "open"
                                ? "bg-[#7a8cff1a] text-[#8ea4ff]"
                                : "bg-[#53c7871a] text-[#4ecb91]"
                    }`}
                >
                        {ticket.status?.replace("_", " ") || "open"}
                </span>
            </td>

            <td className={`px-5 py-4 ${
                isDark ? "text-[#dae0f0]" : "text-[#4a495f]"
            }`}>
                {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : "—"}
            </td>
        </tr>
    ))
)}
                  </tbody>
                </table>
              </div>

              <div className={`flex items-center justify-between border-t px-5 py-4 ${isDark ? "border-[#212d3e] text-[#dfe4ef]" : "border-[#e8def6] text-[#4e4d68]"}`}>
                  <div>
                    Showing {filteredTickets.length ? 1 : 0} to {filteredTickets.length} of {tickets.length} entries
                  </div>
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
  )
}

export default DashboardMain
