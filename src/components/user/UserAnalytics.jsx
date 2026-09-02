import React, { useEffect, useState } from "react";
import { useTicket } from "../../features/tickets/context/TicketContext.jsx";
import { getMyActivitiesService } from "../../features/tickets/services/activity.service.js";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  LogOut,
  MessageSquareText,
  Plus,
  Search,
  Sparkles,
  Ticket,
} from "lucide-react";
import { useNavigate,useLocation  } from "react-router-dom";
import Themetogglebutton from "../Themetogglebutton.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../features/auth/services/authContext.jsx";





const navItems = [
  { label: "Dashboard", icon: "▣",  },
  { label: "Tickets", icon: "▤",  },
  { label: "Analytics", icon: "↗", },
];

const getPriorityClass = (priority) => {
  const normalizedPriority = priority?.toLowerCase();

  if (
    normalizedPriority === "high" ||
    normalizedPriority === "urgent"
  ) {
    return "bg-[#ff5a5a1a] text-[#ff6d6d]";
  }

  if (normalizedPriority === "medium") {
    return "bg-[#3d77ff1a] text-[#5f8cff]";
  }

  return "bg-[#5ac0871a] text-[#4dbe88]";
};

const getStatusClass = (status) => {
  if (status === "open") {
    return "bg-[#5d9dfc1a] text-[#74a9ff]";
  }

  if (status === "assigned") {
    return "bg-[#f3ae451a] text-[#e7ad55]";
  }

  if (status === "in_progress") {
    return "bg-[#7d5dfc1a] text-[#a995ff]";
  }

  return "bg-[#53c7871a] text-[#4ecb91]";
};
const StatusOverviewBar = ({ breakdown, isDark }) => {
  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0) || 1;

  return (
    <div className="space-y-4">
      {[
        { key: "New", value: breakdown.new },
        { key: "Assigned", value: breakdown.assigned },
        { key: "In Progress", value: breakdown.inProgress },
        { key: "Resolved", value: breakdown.resolved },
      ].map(({ key, value }) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className={isDark ? "text-[#dfe6ff]" : "text-[#4d4a61]"}>{key}</span>
            <span className={`font-semibold ${isDark ? "text-[#f5ebff]" : "text-[#1f1f2e]"}`}>{value}</span>
          </div>
          <div className={`h-2.5 overflow-hidden rounded-full ${isDark ? "bg-[#202b3d]" : "bg-[#e9e1f2]"}`}>
            <div
              className={`h-full rounded-full ${
                key === "New"
                  ? "bg-[#7aa8ff]"
                  : key === "Assigned"
                    ? "bg-[#a995ff]"
                    : key === "In Progress"
                      ? "bg-[#d0a6ff]"
                      : "bg-[#4ecb91]"
              }`}
              style={{ width: `${(value / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const InsightStatCard = ({ label, value, description, tone, isDark }) => {
  const toneStyles = {
    neutral: isDark ? "border-[#2b354a] bg-[#1a1d2b]" : "border-[#e4daf6] bg-[#f4f0fb]",
    primary: "border-[#7a5fde] bg-[rgba(92,81,204,0.12)]",
    secondary: "border-[#5a7dff] bg-[rgba(75,108,255,0.12)]",
    success: "border-[#4bc58c] bg-[rgba(75,197,140,0.12)]",
  };

  return (
    <div className={`rounded-[18px] border p-5 shadow-[0_14px_30px_rgba(67,47,92,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#8d5fe5]/60 ${toneStyles[tone]}`}>
      <div className={`mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#d0d5ec]" : "text-[#4e4e62]"}`}>
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${tone === "neutral" ? "bg-[#e3ddf4]" : tone === "primary" ? "bg-[#8d5fe5]" : tone === "secondary" ? "bg-[#5b8cff]" : "bg-[#4bc58c]"}`} />
        {label}
      </div>
      <div className={`text-4xl font-semibold tracking-[-0.06em] ${isDark ? "text-[#f4ebff]" : "text-[#18192a]"}`}>{value}</div>
      <p className={`mt-2 text-sm ${isDark ? "text-[#d5d1e7]" : "text-[#585270]"}`}>{description}</p>
    </div>
  );
};

const TicketActivityCard = ({ ticket, isDark, onView }) => (
  <div className={`rounded-[20px] border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#8d5fe5]/60 ${isDark ? "border-[#2b3548] bg-[#121c2d]/90" : "border-[#e8def4] bg-[#f8f3ff]"}`}>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>{ticket.ticketNumber}</div>
        <h3 className={`text-lg font-semibold tracking-[-0.04em] ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>{ticket.subject}</h3>
      </div>
      <button
        type="button"
        onClick={onView}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#8d5fe5]/40 bg-[#8d5fe5]/10 px-3 py-2 text-xs font-semibold text-[#b89af7] transition-colors hover:bg-[#8d5fe5]/20"
      >
        View Ticket
        <ArrowRight size={14} />
      </button>
    </div>

    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <div>
        <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>Category</div>
        <div className={`mt-1 font-medium ${isDark ? "text-[#e9e7f5]" : "text-[#2e2d3d]"}`}>{ticket.category}</div>
      </div>
      <div>
        <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>Priority</div>
    <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getPriorityClass(ticket.priority)}`}>
  {ticket.priority?.charAt(0).toUpperCase() + ticket.priority?.slice(1)}
</span>
      </div>
      <div>
        <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>Status</div>
        <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(ticket.status)}`}>{ticket.status === "in_progress"
  ? "In Progress"
  : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span>
      </div>
    </div>

    <div className={`mt-4 flex items-center gap-2 text-sm ${isDark ? "text-[#dfe6ff]" : "text-[#4a485e]"}`}>
      <Clock3 size={15} className={isDark ? "text-[#b89af7]" : "text-[#7655a9]"} />
      <span>Last updated: {new Date(ticket.updatedAt).toLocaleString()}</span>
    </div>
  </div>
);



const ResolvedTicketCard = ({ ticket, isDark, onView }) => (
  <div className={`rounded-[18px] border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#4ecb91]/50 ${isDark ? "border-[#2a3549] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`}>
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>#{ticket._id.slice(-6).toUpperCase()}</div>
        <h3 className={`mt-2 text-base font-semibold ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>{ticket.subject}</h3>
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4ecb91]/15 text-[#4ecb91]">
        <CheckCircle2 size={16} />
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between gap-3">
      <div>
        <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>Resolved</div>
        <div className={`mt-1 text-sm ${isDark ? "text-[#dfe6ff]" : "text-[#424259]"}`}>{new Date(ticket.updatedAt).toLocaleString()}</div>
      </div>
      <button
        type="button"
        onClick={onView}
        className="inline-flex items-center gap-2 rounded-xl border border-[#4ecb91]/30 bg-[#4ecb91]/10 px-3 py-2 text-xs font-semibold text-[#71d7a2] transition-colors hover:bg-[#4ecb91]/20"
      >
        View Conversation
      </button>
    </div>
  </div>
);

const SupportSummary = ({ totalTickets, openTickets, inProgressTickets, resolvedTickets, isDark }) => (
  <div className={`rounded-[18px] border p-5 ${isDark ? "border-[#2a3549] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`}>
    <div className="mb-3 flex items-center gap-2">
      <Sparkles size={16} className={isDark ? "text-[#b89af7]" : "text-[#7655a9]"} />
      <h3 className={`text-lg font-semibold ${isDark ? "text-[#f2ebff]" : "text-[#1f1f2e]"}`}>Your Support Activity</h3>
    </div>
    <div className="space-y-3 text-sm leading-6">
      <p className={isDark ? "text-[#dfe6ff]" : "text-[#40425b]"}>You currently have <span className="font-semibold text-[#8d5fe5]">{openTickets} open support requests.</span></p>
      <p className={isDark ? "text-[#dfe6ff]" : "text-[#40425b]"}><span className="font-semibold text-[#8d5fe5]">{inProgressTickets} ticket</span> is currently being handled by a support agent.</p>
      <p className={isDark ? "text-[#dfe6ff]" : "text-[#40425b]"}>You have resolved <span className="font-semibold text-[#4ecb91]">{resolvedTickets} support requests.</span></p>
      <p className={`pt-2 text-xs uppercase tracking-[0.14em] ${isDark ? "text-[#9aa5c9]" : "text-[#67627b]"}`}>{totalTickets} total tickets</p>
    </div>
  </div>
);

const EmptyState = ({ onCreate, isDark }) => (
  <div className={`rounded-[22px] border border-dashed p-8 text-center ${isDark ? "border-[#2d374d] bg-[#111a2b]" : "border-[#d8c9f0] bg-[#f7f3ff]"}`}>
    <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${isDark ? "bg-[#1e2940] text-[#d7c0ff]" : "bg-[#efe7ff] text-[#7d5fe5]"}`}>
      <Ticket size={28} />
    </div>
    <h3 className={`text-2xl font-semibold tracking-[-0.05em] ${isDark ? "text-[#f3ebff]" : "text-[#212235]"}`}>No support tickets yet</h3>
    <p className={`mx-auto mt-3 max-w-md text-sm leading-6 ${isDark ? "text-[#d0d9f4]" : "text-[#57546b]"}`}>
      When you need help, create a support ticket and our team will take it from there.
    </p>
    <button
      type="button"
      onClick={onCreate}
      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#9b5ce7] to-[#7f46d9] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(127,70,217,0.3)]"
    >
      <Plus size={16} />
      Create Your First Ticket
    </button>
  </div>
);

const LoadingSkeleton = ({ isDark }) => (
  <div className="space-y-6 animate-pulse">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className={`h-32 rounded-[18px] border ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`} />
      ))}
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className={`h-72 rounded-[20px] border ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`} />
      <div className={`h-72 rounded-[20px] border ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`} />
    </div>

    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <div className={`h-64 rounded-[20px] border ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`} />
      <div className={`h-64 rounded-[20px] border ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`} />
    </div>
  </div>
);

const UserAnalytics = ({ embedded = false }) => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [recentActivities, setRecentActivities] = useState([]);
  const isDark = theme === "dark";
const {
  tickets,
  getCustomerTickets,
  loading,
  error,
} = useTicket();


useEffect(() => {
    getCustomerTickets();

    const fetchActivities = async () => {
        try {
            const data = await getMyActivitiesService();
            setRecentActivities(data.activities || []);
        } catch (error) {
            console.error("Failed to fetch recent activities:", error);
        }
    };

    fetchActivities();
}, [getCustomerTickets]);


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
  
const activeTickets = tickets.filter(
  (ticket) =>
    ticket.status === "open" ||
    ticket.status === "assigned" ||
    ticket.status === "in_progress"
);

const resolvedTicketList = tickets
  .filter(
    (ticket) =>
      ticket.status === "resolved" || ticket.status === "closed"
  )
  .slice(0, 2);

const breakdown = {
  new: tickets.filter((ticket) => ticket.status === "open").length,
  assigned: tickets.filter((ticket) => ticket.status === "assigned").length,
  inProgress: tickets.filter((ticket) => ticket.status === "in_progress").length,
  resolved: tickets.filter(
    (ticket) => ticket.status === "resolved" || ticket.status === "closed"
  ).length,
};

  const filteredTickets = activeTickets.filter((ticket) =>
    `${ticket._id.slice(-6).toUpperCase()} ${ticket.subject} ${ticket.category || "General"}`.toLowerCase().includes(query.toLowerCase()),
  );

  const handleCreateTicket = () => navigate("/dashboard");
  const handleViewTicket = () => navigate("/dashboard");




  if (embedded) {
    return (
      <div className={`space-y-6 ${isDark ? "text-[#f2edf7]" : "text-[#171827]"}`}>
        <header className="mb-2">
          <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>Customer insights</p>
          <h1 className={`mt-2 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl ${isDark ? "text-[#f8f0ff]" : "text-[#1f1f2e]"}`}>
            My Support Activity
          </h1>
          <p className={`mt-2 max-w-2xl text-base ${isDark ? "text-[#d5d1e7]" : "text-[#4f4a5d]"}`}>
            Track your support requests, recent updates, and resolved issues.
          </p>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InsightStatCard label="My Tickets" value={totalTickets} description="Total support requests" tone="neutral" isDark={isDark} />
          <InsightStatCard label="Open" value={openTickets} description="Currently awaiting resolution" tone="primary" isDark={isDark} />
          <InsightStatCard label="In Progress" value={inProgressTickets} description="Being handled by support" tone="secondary" isDark={isDark} />
          <InsightStatCard label="Resolved" value={resolvedTickets} description="Successfully resolved" tone="success" isDark={isDark} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className={`rounded-[22px] border p-5 shadow-[0_20px_45px_rgba(67,47,92,0.12)] ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className={`text-2xl font-semibold tracking-[-0.05em] ${isDark ? "text-[#f5ebff]" : "text-[#1f1f2e]"}`}>Ticket Overview</h2>
              <div className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${isDark ? "border-[#2d374d] bg-[#161f2f] text-[#d7d7eb]" : "border-[#e7dff3] bg-[#f3ebff] text-[#625a76]"}`}>
                Your tickets
              </div>
            </div>
            <StatusOverviewBar breakdown={breakdown} isDark={isDark} />
          </section>

          <SupportSummary totalTickets={totalTickets} openTickets={openTickets} inProgressTickets={inProgressTickets} resolvedTickets={resolvedTickets} isDark={isDark} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className={`rounded-[22px] border p-5 ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className={`text-2xl font-semibold tracking-[-0.05em] ${isDark ? "text-[#f5ebff]" : "text-[#1f1f2e]"}`}>Active Tickets</h2>
              <div className={`text-xs font-medium ${isDark ? "text-[#d0d9f4]" : "text-[#5e556c]"}`}>{activeTickets.length} unresolved</div>
            </div>

           

            {filteredTickets.length === 0 ? (
              <div className={`rounded-[18px] border border-dashed p-4 text-sm ${isDark ? "border-[#2d374d] bg-[#101a2b] text-[#d9ddf5]" : "border-[#d8c9f0] bg-[#f5f0ff] text-[#5a536d]"}`}>
                No active tickets match your search.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <TicketActivityCard key={ticket.ticketNumber} ticket={ticket} isDark={isDark} onView={handleViewTicket} />
                ))}
              </div>
            )}
          </section>
 <section className={`rounded-[22px] border p-5 ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className={`text-2xl font-semibold tracking-[-0.05em] ${isDark ? "text-[#f5ebff]" : "text-[#1f1f2e]"}`}>Recent Activity</h2>
          
            </div>

          
  <div className="space-y-4">
 {recentActivities.length === 0 ? (
    <p className="text-sm text-gray-500">
        No recent activity.
    </p>
) : (
    recentActivities.slice(0, 4).map((activity) => (
        <div
            key={activity._id}
            className="flex items-start gap-3"
        >
            <div className="flex-1">
                <p className="text-sm font-medium">
                    {activity.message}
                </p>

                <p className="text-xs text-gray-500">
                    {activity.ticket?.subject || "Ticket"}
                </p>

                <p className="text-xs text-gray-400">
                    {new Date(activity.createdAt).toLocaleString()}
                </p>
            </div>
        </div>
    ))
)}
</div>
          </section>
     
        </div>


        

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <section className={`rounded-[22px] border p-5 ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className={`text-2xl font-semibold tracking-[-0.05em] ${isDark ? "text-[#f5ebff]" : "text-[#1f1f2e]"}`}>Recently Resolved</h2>
              <div className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${isDark ? "border-[#2d374d] bg-[#161f2f] text-[#d7d7eb]" : "border-[#e7dff3] bg-[#f3ebff] text-[#625a76]"}`}>
                {resolvedTicketList.length} records
              </div>
            </div>

            <div className="space-y-4">
              {resolvedTicketList.map((ticket) => (
                <ResolvedTicketCard key={ticket.ticketNumber} ticket={ticket} isDark={isDark} onView={handleViewTicket} />
              ))}
            </div>
          </section>

          <section className={`rounded-[22px] border p-5 ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className={`text-2xl font-semibold tracking-[-0.05em] ${isDark ? "text-[#f5ebff]" : "text-[#1f1f2e]"}`}>Support Snapshot</h2>
              <FileText size={18} className={isDark ? "text-[#b89af7]" : "text-[#7655a9]"} />
            </div>

            <div className="space-y-4">
              <div className={`rounded-[18px] border p-4 ${isDark ? "border-[#2d374d] bg-[#171f2f]" : "border-[#e7dff3] bg-[#f4f0fb]"}`}>
                <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>Current focus</div>
               <div className={`mt-2 text-lg font-semibold ${isDark ? "text-[#edf0ff]" : "text-[#1f1f2e]"}`}>
  {activeTickets.length} {activeTickets.length === 1 ? "ticket needs" : "tickets need"} attention
</div>
                <div className={`mt-2 text-sm ${isDark ? "text-[#d0d9f4]" : "text-[#58546d]"}`}>Most of your remaining requests are either new or already in progress.</div>
              </div>

              <div className={`rounded-[18px] border p-4 ${isDark ? "border-[#2d374d] bg-[#171f2f]" : "border-[#e7dff3] bg-[#f4f0fb]"}`}>
                <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>Resolved</div>
                <div className={`mt-2 text-lg font-semibold ${isDark ? "text-[#edf0ff]" : "text-[#1f1f2e]"}`}>{resolvedTickets} support requests closed</div>
                <div className={`mt-2 text-sm ${isDark ? "text-[#d0d9f4]" : "text-[#58546d]"}`}>Your recent history shows steady resolution progress over the last few weeks.</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex min-h-screen items-center justify-center px-6 transition-colors duration-300 ${isDark ? "bg-[#0d1018] text-[#f2edf7]" : "bg-[#eee5f7] text-[#171827]"}`}>
        <div className={`rounded-[22px] border p-8 text-center shadow-[0_20px_45px_rgba(67,47,92,0.12)] ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`}>
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${isDark ? "bg-[#1e2940] text-[#d7c0ff]" : "bg-[#efe7ff] text-[#7d5fe5]"}`}>
            <AlertCircle size={28} />
          </div>
          <h2 className={`text-2xl font-semibold tracking-[-0.05em] ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>Unable to load your support activity.</h2>
          <p className={`mt-2 text-sm ${isDark ? "text-[#d0d9f4]" : "text-[#58546d]"}`}>Please try again in a moment.</p>
          <button
            type="button"
            onClick={getCustomerTickets}
            className="mt-6 rounded-xl bg-gradient-to-r from-[#9b5ce7] to-[#7f46d9] px-5 py-3 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen w-full transition-colors duration-300 ${isDark ? "bg-[#0d1018] text-[#f2edf7]" : "bg-[#eee5f7] text-[#171827]"}`}>
        <div className="mx-auto flex min-h-screen max-w-[1600px]">
          <aside className={`flex w-[260px] flex-col justify-between border-r px-5 py-6 ${isDark ? "border-[#252b3c] bg-[#101722]" : "border-[#e7dff4] bg-[#f5f0fb]"}`}>
            <div>
              <div className="mb-8 flex items-center gap-3 px-2">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg ${isDark ? "bg-[#8d5fe5]" : "bg-[#905ae6]"}`}>
                  ✦
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-[-0.05em]">SupportFlow</div>
                  <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#98a4d2]" : "text-[#5f6174]"}`}>AI SUPPORT</div>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 p-6 md:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className={`h-10 w-52 rounded-xl ${isDark ? "bg-[#1b2330]" : "bg-[#f5effe]"}`} />
              <div className={`h-10 w-40 rounded-xl ${isDark ? "bg-[#1b2330]" : "bg-[#f5effe]"}`} />
            </div>
            <LoadingSkeleton isDark={isDark} />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${isDark ? "bg-[#0d1018] text-[#f2edf7]" : "bg-[#eee5f7] text-[#171827]"}`}>
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className={`flex w-[260px] flex-col justify-between border-r px-5 py-6 ${isDark ? "border-[#252b3c] bg-[#101722] text-[#e9dff8]" : "border-[#e7dff4] bg-[#f5f0fb] text-[#212437]"}`}>
          <div>
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg ${isDark ? "bg-[#8d5fe5]" : "bg-[#905ae6]"}`}>
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
              {navItems.map(({ label, icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (label === "Dashboard") navigate("/dashboard");
                    if (label === "Tickets") navigate("/tickets");
                    if (label === "Analytics") navigate("/insights");
                  }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium transition-colors ${
  (
    (label === "Dashboard" && location.pathname === "/dashboard") ||
    (label === "Tickets" && location.pathname === "/tickets") ||
    (label === "Analytics" && location.pathname === "/insights")
  )
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
              type="button"
              onClick={logout}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium transition-colors ${
                isDark ? "text-[#d7d9ea] hover:bg-[#171f2d]" : "text-[#4a4763] hover:bg-[#efe7ff]"
              }`}
            >
              <LogOut size={18} className="shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-8">
          <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>Customer insights</p>
              <h1 className={`mt-2 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl ${isDark ? "text-[#f8f0ff]" : "text-[#1f1f2e]"}`}>
                My Support Activity
              </h1>
              <p className={`mt-2 max-w-2xl text-base ${isDark ? "text-[#d5d1e7]" : "text-[#4f4a5d]"}`}>
                Track your support requests, recent updates, and resolved issues.
              </p>
            </div>

           
          </header>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InsightStatCard label="My Tickets" value={totalTickets} description="Total support requests" tone="neutral" isDark={isDark} />
            <InsightStatCard label="Open" value={openTickets} description="Currently awaiting resolution" tone="primary" isDark={isDark} />
            <InsightStatCard label="In Progress" value={inProgressTickets} description="Being handled by support" tone="secondary" isDark={isDark} />
            <InsightStatCard label="Resolved" value={resolvedTickets} description="Successfully resolved" tone="success" isDark={isDark} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <section className={`rounded-[22px] border p-5 shadow-[0_20px_45px_rgba(67,47,92,0.12)] ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className={`text-2xl font-semibold tracking-[-0.05em] ${isDark ? "text-[#f5ebff]" : "text-[#1f1f2e]"}`}>Ticket Overview</h2>
                <div className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${isDark ? "border-[#2d374d] bg-[#161f2f] text-[#d7d7eb]" : "border-[#e7dff3] bg-[#f3ebff] text-[#625a76]"}`}>
                  Your tickets
                </div>
              </div>
              <StatusOverviewBar breakdown={breakdown} isDark={isDark} />
            </section>

            <SupportSummary totalTickets={totalTickets} openTickets={openTickets} inProgressTickets={inProgressTickets} resolvedTickets={resolvedTickets} isDark={isDark} />
          </div>

          <div className="mt-6 space-y-6">
            <section className={`rounded-[22px] border p-5 ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className={`text-2xl font-semibold tracking-[-0.05em] ${isDark ? "text-[#f5ebff]" : "text-[#1f1f2e]"}`}>Active Tickets</h2>
                <div className={`text-xs font-medium ${isDark ? "text-[#d0d9f4]" : "text-[#5e556c]"}`}>{activeTickets.length} unresolved</div>
              </div>

              <div className="mb-4 relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-[#c7cce5]" : "text-[#605d74]"}`} size={16} />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search your tickets"
                  className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none ${isDark ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff] placeholder:text-[#7f7a8c] focus:border-[#8d5fe5]" : "border-[#e9ddf9] bg-[#f9f5ff] text-[#171827] placeholder:text-[#7f7a8c] focus:border-[#a36ae8]"}`}
                />
              </div>

              {filteredTickets.length === 0 ? (
                <div className={`rounded-[18px] border border-dashed p-4 text-sm ${isDark ? "border-[#2d374d] bg-[#101a2b] text-[#d9ddf5]" : "border-[#d8c9f0] bg-[#f5f0ff] text-[#5a536d]"}`}>
                  No active tickets match your search.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <TicketActivityCard key={ticket.ticketNumber} ticket={ticket} isDark={isDark} onView={handleViewTicket} />
                  ))}
                </div>
              )}
            </section>

            <section className={`rounded-[22px] border p-5 ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className={`text-2xl font-semibold tracking-[-0.05em] ${isDark ? "text-[#f5ebff]" : "text-[#1f1f2e]"}`}>Recent Activity</h2>
              
              </div>

              <div className="space-y-4">
                {tickets.length === 0 ? (
                  <p className={`text-sm ${isDark ? "text-[#d0d9f4]" : "text-[#58546d]"}`}>
                    No recent activity.
                  </p>
                ) : (
                  tickets
                    .slice()
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .slice(0, 4)
                    .map((ticket) => (
                      <div
                        key={ticket._id}
                        className={`rounded-[18px] border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#8d5fe5]/60 ${
                          isDark ? "border-[#2d374d] bg-[#171f2f]" : "border-[#e7dff3] bg-[#f4f0fb]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>
                              #{ticket._id.slice(-6).toUpperCase()}
                            </p>
                            <h3 className={`mt-2 text-base font-semibold ${isDark ? "text-[#edf0ff]" : "text-[#20212d]"}`}>
                              {ticket.subject}
                            </h3>
                          </div>

                          <div className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(ticket.status)}`}>
                            {ticket.status === "in_progress"
                              ? "In Progress"
                              : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </div>
                        </div>

                        <p className={`mt-3 text-sm ${isDark ? "text-[#d0d9f4]" : "text-[#59546d]"}`}>
                          Ticket #{ticket._id.slice(-6).toUpperCase()} is {ticket.status === "in_progress"
                            ? "In Progress"
                            : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </p>

                        <div className={`mt-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] ${isDark ? "text-[#9aa5c9]" : "text-[#6a637a]"}`}>
                          <Clock3 size={12} className={isDark ? "text-[#b89af7]" : "text-[#7655a9]"} />
                          <span>{new Date(ticket.updatedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
            <section className={`rounded-[22px] border p-5 ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className={`text-2xl font-semibold tracking-[-0.05em] ${isDark ? "text-[#f5ebff]" : "text-[#1f1f2e]"}`}>Recently Resolved</h2>
                <div className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${isDark ? "border-[#2d374d] bg-[#161f2f] text-[#d7d7eb]" : "border-[#e7dff3] bg-[#f3ebff] text-[#625a76]"}`}>
                  {resolvedTicketList.length} records
                </div>
              </div>

              <div className="space-y-4">
                {resolvedTicketList.map((ticket) => (
                  <ResolvedTicketCard key={ticket.ticketNumber} ticket={ticket} isDark={isDark} onView={handleViewTicket} />
                ))}
              </div>
            </section>

            <section className={`rounded-[22px] border p-5 ${isDark ? "border-[#2b3548] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]"}`}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className={`text-2xl font-semibold tracking-[-0.05em] ${isDark ? "text-[#f5ebff]" : "text-[#1f1f2e]"}`}>Support Snapshot</h2>
                <FileText size={18} className={isDark ? "text-[#b89af7]" : "text-[#7655a9]"} />
              </div>

              <div className="space-y-4">
                <div className={`rounded-[18px] border p-4 ${isDark ? "border-[#2d374d] bg-[#171f2f]" : "border-[#e7dff3] bg-[#f4f0fb]"}`}>
                  <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>Current focus</div>
                <div className={`mt-2 text-lg font-semibold ${isDark ? "text-[#edf0ff]" : "text-[#1f1f2e]"}`}>
  {activeTickets.length} {activeTickets.length === 1 ? "ticket needs" : "tickets need"} attention
</div>
                  <div className={`mt-2 text-sm ${isDark ? "text-[#d0d9f4]" : "text-[#58546d]"}`}>Most of your remaining requests are either new or already in progress.</div>
                </div>

                <div className={`rounded-[18px] border p-4 ${isDark ? "border-[#2d374d] bg-[#171f2f]" : "border-[#e7dff3] bg-[#f4f0fb]"}`}>
                  <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>Resolved</div>
                  <div className={`mt-2 text-lg font-semibold ${isDark ? "text-[#edf0ff]" : "text-[#1f1f2e]"}`}>{resolvedTickets} support requests closed</div>
                  <div className={`mt-2 text-sm ${isDark ? "text-[#d0d9f4]" : "text-[#58546d]"}`}>Your recent history shows steady resolution progress over the last few weeks.</div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserAnalytics;
