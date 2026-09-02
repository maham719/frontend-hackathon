import { useState ,useEffect} from "react";
import { getAnalyticsService } from "../../features/tickets/services/admin.service.js";
import { getAllTicketsService } from "../../features/tickets/services/ticket.service.js";
import { getRecentActivitiesService } from "../../features/tickets/services/activity.service.js";
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
import { useTheme } from "../../context/ThemeContext.jsx";
import CreateTicket from "../../pages/CreateTicket.jsx";
import { useAuth } from "../../features/auth/services/authContext.jsx";
import Header from "../admin/Header.jsx";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "All Tickets", icon: Ticket },
  { label: "Agents", icon: Users },
  { label: "Customers", icon: CircleUserRound },
  { label: "Analytics", icon: BarChart3 },
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



const DashboardMain = () => {

    const { theme } = useTheme();
      const { logout, user } = useAuth();
      const [menuOpen, setMenuOpen] = useState(false);
      const [ticketModalOpen, setTicketModalOpen] = useState(false);
      const [query, setQuery] = useState("");
      const isDark = theme === "dark";
      const [analytics, setAnalytics] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [recentTickets, setRecentTickets] = useState([]); 
const [recentActivities, setRecentActivities] = useState([]);
const stats = [
    {
        label: "Total Tickets",
        value: analytics?.summary.totalTickets ?? 0,
        trend: "",
        icon: Ticket,
        tone: "violet",
    },
    {
        label: "New",
        value: analytics?.summary.newTickets ?? 0,
        trend: "",
        icon: MessageSquareText,
        tone: "blue",
    },
    {
        label: "Assigned",
        value: analytics?.summary.assignedTickets ?? 0,
        trend: "",
        icon: Users,
        tone: "indigo",
    },
    {
        label: "In Progress",
        value: analytics?.summary.inProgressTickets ?? 0,
        trend: "",
        icon: Activity,
        tone: "amber",
    },
    {
        label: "Resolved",
        value: analytics?.summary.resolvedTickets ?? 0,
        trend: "",
        icon: CheckCircle2,
        tone: "green",
    },
];
const tickets = recentTickets.map((ticket) => ({
    id: ticket._id,
    customer: ticket.customer?.username || "Unknown",
    subject: ticket.subject,
    category:
        ticket.category?.charAt(0).toUpperCase() +
        ticket.category?.slice(1),
    priority:
        ticket.priority?.charAt(0).toUpperCase() +
        ticket.priority?.slice(1),
    agent: ticket.assignedAgent?.username || "Unassigned",
    status:
        ticket.status === "in_progress"
            ? "In Progress"
            : ticket.status?.charAt(0).toUpperCase() +
              ticket.status?.slice(1),
    updated: new Date(ticket.updatedAt).toLocaleString(),
}));
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


//       useEffect(() => {
//     const fetchAnalytics = async () => {
//         try {
//             setLoading(true);
//             setError("");

//             const data = await getAnalyticsService(7);

//             setAnalytics(data);
//            console.log("DASHBOARD ANALYTICS:", JSON.stringify(data, null, 2));
//         } catch (error) {
//             console.error("FETCH ANALYTICS ERROR:", error);

//             setError(
//                 error.response?.data?.message ||
//                 "Unable to load dashboard analytics."
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     fetchAnalytics();
// }, []);
useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            // Fetch analytics
            const analyticsData = await getAnalyticsService(7);
            setAnalytics(analyticsData);

            console.log(
                "DASHBOARD ANALYTICS:",
                JSON.stringify(analyticsData, null, 2)
            );

            // Fetch tickets
       const ticketsData = await getAllTicketsService();

const allTickets =
    ticketsData?.tickets ||
    ticketsData?.data ||
    ticketsData ||
    [];

const now = new Date();

const recent = allTickets
    .filter((ticket) => {
        const ticketDate = new Date(ticket.createdAt);

        const diffInHours =
            (now - ticketDate) / (1000 * 60 * 60);

        return diffInHours <= 24;
    })
    .sort(
        (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 10);

setRecentTickets(recent)
const activitiesData = await getRecentActivitiesService();

setRecentActivities(
    activitiesData?.activities ||
    activitiesData?.data ||
    [])
        } catch (error) {
            console.error("FETCH DASHBOARD ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    fetchDashboardData();
}, []);
return (
    <div>
        <section
            className={`mb-6 rounded-[22px] border p-5 shadow-[0_20px_45px_rgba(67,47,92,0.12)] sm:p-7 ${panel}`}
          >
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p
                  className={`mb-2 text-sm font-medium ${isDark ? "text-[#b8a4ee]" : "text-[#7655a9]"}`}
                >
                  Good morning, Support Team
                </p>
                <h2
                  className={`text-2xl font-semibold tracking-[-0.05em] sm:text-3xl ${heading}`}
                >
                  A clear view of your operation.
                </h2>
                <p className={`mt-2 max-w-xl text-sm ${muted}`}>
                  Here&apos;s what&apos;s happening across your support
                  operation today.
                </p>
              </div>
              <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#9b5ce7] to-[#7f46d9] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(127,70,217,0.3)] transition-transform hover:scale-[1.01]">
                View All Tickets <ChevronRight size={16} />
              </button>
            </div>
          </section>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {stats.map(({ label, value, trend, icon: Icon, tone }) => (
              <div
                key={label}
                className={`group rounded-[18px] border p-5 shadow-[0_14px_30px_rgba(67,47,92,0.08)] transition-transform hover:-translate-y-1 ${panel}`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone === "green" ? "bg-[#53c7871a] text-[#4ecb91]" : tone === "amber" ? "bg-[#f3ae451a] text-[#e7ad55]" : tone === "blue" ? "bg-[#5d9dfc1a] text-[#74a9ff]" : "bg-[#8d5fe51a] text-[#a995ff]"}`}
                  >
                    <Icon size={17} />
                  </div>
                  <span
                    className={`text-xs font-semibold ${trend.startsWith("-") ? "text-[#e7ad55]" : "text-[#4ecb91]"}`}
                  >
                    {trend}
                  </span>
                </div>
                <div
                  className={`text-4xl font-semibold tracking-[-0.06em] ${heading}`}
                >
                  {value}
                </div>
                <div
                  className={`mt-1 text-xs font-medium uppercase tracking-[0.12em] ${muted}`}
                >
                  {label}
                </div>
              </div>
            ))}
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <section className={`rounded-[20px] border p-5 ${panel}`}>
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className={`text-lg font-semibold ${heading}`}>
                    Ticket Status Overview
                  </h2>
                  <p className={`mt-1 text-xs ${muted}`}>
                    Current ticket lifecycle
                  </p>
                </div>
                <Activity size={19} className={muted} />
              </div>
              <div className="mb-6 flex h-4 overflow-hidden rounded-full bg-[#ffffff0d]">
                <div className="w-[13%] bg-[#6f8cff]" />
                <div className="w-[17%] bg-[#a995ff]" />
                <div className="w-[27%] bg-[#e7ad55]" />
                <div className="w-[43%] bg-[#4ecb91]" />
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                {[
                 ["New", analytics?.summary.newTickets ?? 0, "bg-[#6f8cff]"],
    ["Assigned", analytics?.summary.assignedTickets ?? 0, "bg-[#a995ff]"],
    ["In Progress", analytics?.summary.inProgressTickets ?? 0, "bg-[#e7ad55]"],
    ["Resolved", analytics?.summary.resolvedTickets ?? 0, "bg-[#4ecb91]"],
                ].map(([label, value, color]) => (
                  <div key={label}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${color}`} />
                      <span className={`text-xs ${muted}`}>{label}</span>
                    </div>
                    <div className={`text-2xl font-semibold ${heading}`}>
                      {value}
                    </div>
                    <div className={`mt-1 text-[11px] ${muted}`}>tickets</div>
                  </div>
                ))}
              </div>
            </section>
            <section className={`rounded-[20px] border p-5 ${panel}`}>
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h2 className={`text-lg font-semibold ${heading}`}>
                    Priority Distribution
                  </h2>
                  <p className={`mt-1 text-xs ${muted}`}>
                    Where attention is needed
                  </p>
                </div>
                <ListFilter size={18} className={muted} />
              </div>
              <div className="space-y-4">
                {[
                ["Urgent", analytics?.priority?.find(item => item.label === "Urgent")?.value ?? 0, "bg-[#ff7777]"],
    ["High", analytics?.priority?.find(item => item.label === "High")?.value ?? 0, "bg-[#ff7777]"],
    ["Medium", analytics?.priority?.find(item => item.label === "Medium")?.value ?? 0, "bg-[#e7ad55]"],
    ["Low", analytics?.priority?.find(item => item.label === "Low")?.value ?? 0, "bg-[#4ecb91]"],
                ].map(([label, value, color]) => (
                  <div key={label}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className={muted}>{label}</span>
                      <span className={`font-semibold ${heading}`}>
                        {value}
                      </span>
                    </div>
                    <div
                      className={`h-2 rounded-full ${isDark ? "bg-[#222b3b]" : "bg-[#e9e1f2]"}`}
                    >
                     <div
    className={`h-full rounded-full ${color}`}
    style={{
        width: `${
            analytics?.priority?.length
                ? (value / Math.max(...analytics.priority.map(item => item.value), 1)) * 100
                : 0
        }%`,
    }}
/>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className={`mt-6 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs ${isDark ? "border-[#493449] bg-[#281e2d] text-[#e9b1bd]" : "border-[#f0dbe5] bg-[#fff4f7] text-[#9c586e]"}`}
              >
                <AlertCircle size={15} />
              {analytics?.priority?.find(item => item.label === "High")?.value ?? 0} high-priority tickets require attention.
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <section className={`rounded-[20px] border p-5 ${panel}`}>
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h2 className={`text-lg font-semibold ${heading}`}>
                    Tickets by Category
                  </h2>
                  {analytics?.summary?.totalTickets ?? 0} total tickets
                </div>
                <BarChart3 size={18} className={muted} />
              </div>
              <div className="space-y-4">
             {(analytics?.category ?? []).map(({ label, value }, index) => {
    const colors = [
        "bg-[#9b5ce7]",
        "bg-[#6f8cff]",
        "bg-[#58a7f8]",
        "bg-[#a99bbf]",
    ];

    return (
        <div key={label}>
            <div className="mb-1.5 flex justify-between text-xs">
                <span className={muted}>{label}</span>
                <span className={`font-semibold ${heading}`}>
                    {value}
                </span>
            </div>

            <div
                className={`h-2 rounded-full ${
                    isDark ? "bg-[#222b3b]" : "bg-[#e9e1f2]"
                }`}
            >
                <div
                    className={`h-full rounded-full ${colors[index % colors.length]}`}
                    style={{
                        width: `${
                            analytics?.category?.length
                                ? (value /
                                    Math.max(
                                        ...analytics.category.map(
                                            item => item.value
                                        ),
                                        1
                                    )) *
                                  100
                                : 0
                        }%`,
                    }}
                />
            </div>
        </div>
    );
})}
              </div>
            </section>
            <section className={`rounded-[20px] border p-5 ${panel}`}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className={`text-lg font-semibold ${heading}`}>
                    Agent Workload
                  </h2>
                {analytics?.summary?.totalTickets ?? 0} total tickets
                </div>
                <button
                  className={`text-xs font-semibold ${isDark ? "text-[#b8a4ee]" : "text-[#7655a9]"}`}
                >
                  View agents
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr
                      className={`border-b text-[10px] uppercase tracking-[0.14em] ${isDark ? "border-[#293449] text-[#7e8aa9]" : "border-[#e8def4] text-[#81788f]"}`}
                    >
                      <th className="pb-3">Agent</th>
                      <th className="pb-3">Assigned</th>
                      <th className="pb-3">In progress</th>
                      <th className="pb-3">Resolved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics?.agentPerformance ?? []).map((agent) =>  (
                      <tr
                        key={agent.name}
                        className={`border-b last:border-0 ${isDark ? "border-[#202b3d]" : "border-[#eee6f5]"}`}
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white ${agent.tone === "green" ? "bg-[#4ecb91]" : agent.tone === "blue" ? "bg-[#6f8cff]" : "bg-[#9b5ce7]"}`}
                            >
                            {agent.name
    ?.split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()}
                            </span>
                            <div>
                              <div
                                className={`text-xs font-semibold ${heading}`}
                              >
                                {agent.name}
                              </div>
                              <div className="mt-1 flex items-center gap-1 text-[10px] text-[#4ecb91]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#4ecb91]" />
                                Active
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={`py-3 text-xs ${muted}`}>
                          {agent.assigned}
                        </td>
                        <td className={`py-3 text-xs ${muted}`}>
                          {agent.inProgress}
                        </td>
                        <td className={`py-3 text-xs ${muted}`}>
                          {agent.resolved}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <section className={`mt-6 rounded-[20px] border ${panel}`}>
            <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className={`text-lg font-semibold ${heading}`}>
                  Recent Tickets
                </h2>
                <p className={`mt-1 text-xs ${muted}`}>
                  Latest activity across your support operation
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search
                  size={15}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${muted}`}
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search tickets..."
                  className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-xs outline-none ${isDark ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff] focus:border-[#8d5fe5]" : "border-[#e9ddf9] bg-[#f9f5ff] text-[#171827] focus:border-[#a36ae8]"}`}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[850px] w-full text-left">
                <thead
                  className={
                    isDark
                      ? "bg-[#171f2f] text-[#8792ae]"
                      : "bg-[#f0ebf9] text-[#6f687d]"
                  }
                >
                  <tr>
                    {[
                      "Ticket",
                      "Customer",
                      "Subject",
                      "Category",
                      "Priority",
                      "Agent",
                      "Status",
                      "Updated",
                    ].map((head) => (
                      <th
                        key={head}
                        className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em]"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className={`border-t transition-colors hover:bg-[#ffffff05] ${isDark ? "border-[#212d3e]" : "border-[#e8def6]"}`}
                    >
                      <td
                        className={`px-5 py-4 text-xs font-semibold ${isDark ? "text-[#bca7f1]" : "text-[#7655a9]"}`}
                      >
                        {ticket.id}
                      </td>
                      <td className={`px-5 py-4 text-xs ${heading}`}>
                        {ticket.customer}
                      </td>
                      <td
                        className={`max-w-[230px] truncate px-5 py-4 text-xs ${muted}`}
                      >
                        {ticket.subject}
                      </td>
                      <td className={`px-5 py-4 text-xs ${muted}`}>
                        {ticket.category}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${priorityStyles[ticket.priority]}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className={`px-5 py-4 text-xs ${muted}`}>
                        {ticket.agent}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[ticket.status]}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className={`px-5 py-4 text-xs ${muted}`}>
                        {ticket.updated}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTickets.length === 0 && (
                <div className={`p-10 text-center text-sm ${muted}`}>
                  No tickets found.
                </div>
              )}
            </div>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr_0.8fr]">
            <section className={`rounded-[20px] border p-5 ${panel}`}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className={`text-lg font-semibold ${heading}`}>
                  Recent Activity
                </h2>
                <Clock3 size={18} className={muted} />
              </div>
             <div className="space-y-4">
    {recentActivities.map((activity) => (
        <div
            key={activity._id}
            className="flex gap-3"
        >
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#9b5ce7] shadow-[0_0_0_4px_#9b5ce71a]" />

            <div>
                <p className={`text-xs ${heading}`}>
                    {activity.message}
                </p>

                <p className={`mt-1 text-[10px] ${muted}`}>
                    {new Date(
                        activity.createdAt
                    ).toLocaleString()}
                </p>
            </div>
        </div>
    ))}

    {recentActivities.length === 0 && (
        <p className={`text-xs ${muted}`}>
            No recent activity.
        </p>
    )}
</div>
            </section>
            <section className={`rounded-[20px] border p-5 ${panel}`}>
              <div className="mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-[#a995ff]" />
                <h2 className={`text-lg font-semibold ${heading}`}>
                  AI Triage Activity
                </h2>
              </div>
           <div className="grid grid-cols-3 gap-2">
  {[
    ["Analyzed", analytics?.aiTriage?.analyzed ?? 0],
    ["Reviewed", "—"],
    ["Manual", "—"],
  ].map(([label, value]) => (
    <div
      key={label}
      className={`rounded-xl p-3 text-center ${
        isDark ? "bg-[#1b2434]" : "bg-[#f0e8fb]"
      }`}
    >
      <div className={`text-xl font-semibold ${heading}`}>
        {value}
      </div>

      <div className={`mt-1 text-[10px] ${muted}`}>
        {label}
      </div>
    </div>
  ))}
</div>
              <p className={`mt-5 text-xs leading-5 ${muted}`}>
                AI assists agents with categorization, priority, and summaries.{" "}
                <span className={heading}>Humans make the final decision.</span>
              </p>
            </section>
            <section className={`rounded-[20px] border p-5 ${panel}`}>
              <div className="mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-[#ff7777]" />
                <h2 className={`text-lg font-semibold ${heading}`}>
                  Requires Attention
                </h2>
              </div>
             <div className="space-y-3">
  {(analytics?.requiresAttention ?? []).map((ticket) => (
    <div
      key={ticket._id}
      className={`rounded-xl border p-3 ${
        isDark
          ? "border-[#493449] bg-[#281e2d]"
          : "border-[#f0dbe5] bg-[#fff4f7]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#ff7777]">
          {ticket.priority}
        </span>

        <span className={`text-[10px] ${muted}`}>
          {ticket._id}
        </span>
      </div>

      <p className={`mt-2 text-xs font-semibold ${heading}`}>
        {ticket.subject}
      </p>

      <p className={`mt-1 text-[10px] ${muted}`}>
        {ticket.assignedAgent?.username || "Unassigned"} ·{" "}
        {ticket.status === "in_progress"
          ? "In Progress"
          : ticket.status}
      </p>
    </div>
  ))}

  {(analytics?.requiresAttention ?? []).length === 0 && (
    <p className={`text-xs ${muted}`}>
      No tickets require attention.
    </p>
  )}
</div>
            </section>
          </div>
    </div>
  )
}

export default DashboardMain
