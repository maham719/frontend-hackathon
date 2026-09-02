import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle2, Clock3, Search, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import {useAuth} from "../../features/auth/services/authContext.jsx";
import api from "../../api/axios.js";


const getBaseTicketUrl = () =>
  window.location.hostname === "localhost"
    ? "http://localhost:3006/api/tickets"
    : "https://backend-hackathon-seven.vercel.app/api/tickets";

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const normalizeStatus = (status = "") => {
  const statusMap = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  };

  return statusMap[status?.toLowerCase()] || status || "Open";
};

const normalizePriority = (priority = "") => {
  const priorityMap = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };

  return priorityMap[priority?.toLowerCase()] || priority || "Medium";
};

const getStatusClass = (status = "Open") => {
  const normalized = status.toLowerCase();

  if (normalized.includes("open")) return "bg-[#5d9dfc1a] text-[#74a9ff]";
  if (normalized.includes("progress")) return "bg-[#7d5dfc1a] text-[#a995ff]";
  if (normalized.includes("resolve")) return "bg-[#53c7871a] text-[#4ecb91]";
  return "bg-[#f3ae451a] text-[#e7ad55]";
};

const getPriorityClass = (priority = "Medium") => {
  const normalized = priority.toLowerCase();

  if (normalized.includes("high") || normalized.includes("urgent")) return "bg-[#ff5a5a1a] text-[#ff6d6d]";
  if (normalized.includes("medium")) return "bg-[#3d77ff1a] text-[#5f8cff]";
  return "bg-[#5ac0871a] text-[#4dbe88]";
};

const AllTickets = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
const { loading: authLoading } = useAuth();
const fetchTickets = async () => {
  try {
    setLoading(true);
    setError("");

   const response = await api.get(getBaseTicketUrl());

    setTickets(response.data?.tickets || []);
  } catch (fetchError) {
    console.error("Failed to fetch user tickets:", fetchError);

    setError(
      fetchError.response?.data?.message ||
      "Unable to load your tickets right now."
    );

    setTickets([]);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    if (!authLoading) {
        fetchTickets();
    }
}, [authLoading]);

  const filteredTickets = useMemo(() => {
    const text = query.toLowerCase();

    return tickets.filter((ticket) =>
      `${ticket.subject || ""} ${ticket.description || ""} ${ticket.category || ""} ${normalizeStatus(ticket.status)} ${normalizePriority(ticket.priority)}`
        .toLowerCase()
        .includes(text)
    );
  }, [tickets, query]);

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((ticket) => normalizeStatus(ticket.status) === "Open").length;
  const inProgressTickets = tickets.filter((ticket) => normalizeStatus(ticket.status) === "In Progress").length;
  const resolvedTickets = tickets.filter((ticket) => normalizeStatus(ticket.status) === "Resolved").length;

  return (
    <section
      className={`rounded-[26px] border p-6 shadow-[0_18px_45px_rgba(67,47,92,0.12)] transition-colors duration-300 ${
        isDark ? "border-[#232d3f] bg-[#121c2d]" : "border-[#e7dff3] bg-[#f8f3ff]"
      }`}
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-[#9aa5c9]" : "text-[#67627b]"}`}>
            Ticket overview
          </p>
          <h2 className={`text-3xl font-semibold tracking-[-0.05em] ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
            All Tickets
          </h2>
        </div>

        <button
          type="button"
          onClick={fetchTickets}
          className="rounded-xl border border-[#8d5fe5]/40 bg-[#8d5fe5]/10 px-4 py-2.5 text-sm font-semibold text-[#b89af7] transition-colors hover:bg-[#8d5fe5]/20"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "My Tickets", value: totalTickets, description: "Total submitted tickets", tone: "neutral" },
          { label: "Open", value: openTickets, description: "Awaiting review", tone: "primary" },
          { label: "In Progress", value: inProgressTickets, description: "Being handled", tone: "secondary" },
          { label: "Resolved", value: resolvedTickets, description: "Completed requests", tone: "success" },
        ].map(({ label, value, description, tone }) => {
          const toneStyles = {
            neutral: isDark ? "border-[#2b354a] bg-[#1a1d2b]" : "border-[#e4daf6] bg-[#f4f0fb]",
            primary: "border-[#7a5fde] bg-[rgba(92,81,204,0.12)]",
            secondary: "border-[#5a7dff] bg-[rgba(75,108,255,0.12)]",
            success: "border-[#4bc58c] bg-[rgba(75,197,140,0.12)]",
          };

          return (
            <div
              key={label}
              className={`rounded-[18px] border p-5 shadow-[0_14px_30px_rgba(67,47,92,0.08)] ${toneStyles[tone]}`}
            >
              <div className={`mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#d0d5ec]" : "text-[#4e4e62]"}`}>
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${tone === "neutral" ? "bg-[#e3ddf4]" : tone === "primary" ? "bg-[#8d5fe5]" : tone === "secondary" ? "bg-[#5b8cff]" : "bg-[#4bc58c]"}`} />
                {label}
              </div>
              <div className={`text-4xl font-semibold tracking-[-0.06em] ${isDark ? "text-[#f4ebff]" : "text-[#18192a]"}`}>{value}</div>
              <p className={`mt-2 text-sm ${isDark ? "text-[#d5d1e7]" : "text-[#585270]"}`}>{description}</p>
            </div>
          );
        })}
      </div>

      <div className={`mt-8 rounded-[20px] border ${isDark ? "border-[#2b3548] bg-[#121d2d]" : "border-[#e7dff3] bg-[#f5f1fc]"}`}>
        <div className="flex flex-col gap-4 border-b px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isDark ? "bg-[#1d2537] text-[#d7c7ff]" : "bg-[#efe6ff] text-[#6d4bc8]"}`}>
              <Ticket size={18} />
            </div>
            <div>
              <h3 className={`text-xl font-semibold ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>Your support history</h3>
              <p className={`text-sm ${isDark ? "text-[#b9c4e8]" : "text-[#5e5a72]"}`}>{filteredTickets.length} ticket(s) shown</p>
            </div>
          </div>

          <div className={`relative w-full max-w-sm`}>
            <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? "text-[#a0a7c6]" : "text-[#635f7a]"}`} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tickets..."
              className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors ${
                isDark
                  ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff] placeholder:text-[#8c9ac0] focus:border-[#8d5fe5]"
                  : "border-[#e9ddf9] bg-[#f9f5ff] text-[#171827] placeholder:text-[#7d7788] focus:border-[#a36ae8]"
              }`}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm font-medium">
            <Clock3 className={`h-4 w-4 ${isDark ? "text-[#b59cff]" : "text-[#6a4ac9]"}`} />
            <span className={isDark ? "text-[#dfe6ff]" : "text-[#3e3a4f]"}>Loading tickets...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 px-6 py-16 text-sm">
            <AlertCircle className="h-5 w-5 text-[#ff6d6d]" />
            <span className={isDark ? "text-[#f2dede]" : "text-[#4e475d]"}>{error}</span>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${isDark ? "bg-[#1a2333] text-[#d7c7ff]" : "bg-[#efe6ff] text-[#6d4bc8]"}`}>
              <Ticket size={22} />
            </div>
            <h4 className={`text-xl font-semibold ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>No tickets found</h4>
            <p className={`mt-2 text-sm ${isDark ? "text-[#d5d1e7]" : "text-[#585270]"}`}>
              {query ? "Try a different keyword." : "You haven’t created any support tickets yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#e7dff3] dark:divide-[#2b3548]">
            {filteredTickets.map((ticket) => {
              const ticketId = ticket._id?.slice(-6).toUpperCase() || "NEW";
              const status = normalizeStatus(ticket.status);
              const priority = normalizePriority(ticket.priority);

              return (
                <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="block no-underline">
                  <article className={`p-5 transition-colors ${isDark ? "hover:bg-[#172335]" : "hover:bg-[#dad4e4]"}`}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>
                          TKT-{ticketId}
                        </div>
                        <h4 className={`text-lg font-semibold tracking-[-0.04em] ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
                          {ticket.subject}
                        </h4>
                        <p className={`mt-2 max-w-2xl text-sm ${isDark ? "text-[#dfe6ff]" : "text-[#47435d]"}`}>
                          {ticket.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(status)}`}>
                          {status}
                        </span>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getPriorityClass(priority)}`}>
                          {priority}
                        </span>
                        {ticket.category && (
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${isDark ? "bg-[#1e2740] text-[#d7dffb]" : "bg-[#ece5ff] text-[#5d4a96]"}`}>
                            {ticket.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={`mt-4 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between ${isDark ? "text-[#c7d2ef]" : "text-[#5b566b]"}`}>
                      <div className="flex items-center gap-2">
                        <Clock3 size={14} />
                        <span>Created {formatDate(ticket.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {status === "Resolved" ? <CheckCircle2 size={14} className="text-[#4ecb91]" /> : <ArrowUpRight size={14} className="text-[#8d5fe5]" />}
                        <span>{ticket.aiSummary || "AI summary not available yet."}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllTickets;
