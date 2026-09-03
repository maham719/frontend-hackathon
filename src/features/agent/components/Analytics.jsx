import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BarChart3, CheckCircle2, Clock3, Ticket } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext.jsx";
import { useAuth } from "../../auth/context/authContext.jsx";
import { getAgentTicketsService } from "../../tickets/services/ticket.service.js";

const formatTitle = (value) => {
  if (!value) return "General";
  const normalized = String(value).trim();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).replace(/_/g, " ");
};

const getStatusClass = (status = "") => {
  const normalized = String(status).toLowerCase();
  if (normalized === "open") return "bg-[#5d9dfc1a] text-[#74a9ff]";
  if (normalized === "in_progress") return "bg-[#7d5dfc1a] text-[#a995ff]";
  if (normalized === "resolved" || normalized === "closed") return "bg-[#53c7871a] text-[#4ecb91]";
  return "bg-[#f3ae451a] text-[#e7ad55]";
};

const getPriorityClass = (priority = "") => {
  const normalized = String(priority).toLowerCase();
  if (normalized === "high" || normalized === "urgent") return "bg-[#ff5a5a1a] text-[#ff6d6d]";
  if (normalized === "medium") return "bg-[#3d77ff1a] text-[#5f8cff]";
  return "bg-[#5ac0871a] text-[#4dbe88]";
};

const buildDistribution = (items, fallbackLabels = []) => {
  const map = {};

  items.forEach((item) => {
    const label = item.label || "General";
    map[label] = (map[label] || 0) + item.value;
  });

  const entries = fallbackLabels.length
    ? fallbackLabels.map((label) => ({ label, value: map[label] || 0 }))
    : Object.entries(map).map(([label, value]) => ({ label, value }));

  return entries.sort((a, b) => b.value - a.value);
};

const BarList = ({ items, isDark, showLegend = false }) => {
  const maxValue = Math.max(...items.map((item) => item.value), 1);
  const colors = ["bg-[#8d5fe5]", "bg-[#6f8cff]", "bg-[#58a7f8]", "bg-[#6fc8a0]", "bg-[#f3ae45]"];

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`}>
          <div className={`mb-1 flex items-center justify-between text-xs ${isDark ? "text-[#dfe6ff]" : "text-[#4d4a61]"}`}>
            <span>{item.label}</span>
            <span className="font-semibold">{item.value}</span>
          </div>
          <div className={`h-2.5 overflow-hidden rounded-full ${isDark ? "bg-[#202b3d]" : "bg-[#e9e1f2]"}`}>
            <div
              className={`h-full rounded-full ${colors[index % colors.length]}`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}

      {showLegend && (
        <div className={`flex flex-wrap gap-3 pt-1 text-[10px] uppercase tracking-[0.12em] ${isDark ? "text-[#9aa5c9]" : "text-[#67627b]"}`}>
          {items.map((item, index) => (
            <span key={`${item.label}-legend`} className="inline-flex items-center gap-1.5">
              <i className={`inline-block h-2 w-2 rounded-full ${colors[index % colors.length]}`} />
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const Analytics = () => {
  const { theme } = useTheme();
  const { restoringSession } = useAuth();
  const isDark = theme === "dark";

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const panel = isDark ? "border-[#293449] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]";
  const inner = isDark ? "border-[#2b3548] bg-[#171f2d]" : "border-[#e7dff3] bg-[#efe8f8]";
  const heading = isDark ? "text-[#f8f0ff]" : "text-[#201d2c]";
  const muted = isDark ? "text-[#9fa9c5]" : "text-[#6c687d]";
  const soft = isDark ? "border-[#2b3548] bg-[#171f2d]" : "border-[#e7dff3] bg-[#f4f0fb]";

  useEffect(() => {
    if (restoringSession) return;

    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAgentTicketsService();
        setTickets(response || []);
      } catch (fetchError) {
        console.error("AGENT ANALYTICS ERROR:", fetchError);
        setError(fetchError.response?.data?.message || "Unable to load your analytics right now.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [restoringSession]);

  const analytics = useMemo(() => {
    const total = tickets.length;
    const resolved = tickets.filter((ticket) => ["resolved", "closed"].includes(String(ticket.status || "").toLowerCase())).length;
    const inProgress = tickets.filter((ticket) => String(ticket.status || "").toLowerCase() === "in_progress").length;
    const open = tickets.filter((ticket) => String(ticket.status || "").toLowerCase() === "open").length;
    const resolutionRate = total ? ((resolved / total) * 100).toFixed(1) : "0.0";

    const categoryEntries = buildDistribution(
      tickets.map((ticket) => ({ label: formatTitle(ticket.category), value: 1 })),
      ["Technical", "Account", "Billing", "General"]
    );

    const statusEntries = buildDistribution(
      tickets.map((ticket) => ({ label: formatTitle(ticket.status), value: 1 })),
      ["Open", "In Progress", "Resolved", "Closed"]
    );

    const priorityEntries = buildDistribution(
      tickets.map((ticket) => ({ label: String(ticket.priority || "Medium").toLowerCase() === "urgent" ? "Critical" : formatTitle(ticket.priority), value: 1 })),
      ["Low", "Medium", "High", "Critical"]
    );

    const recentResolved = [...tickets]
      .filter((ticket) => ["resolved", "closed"].includes(String(ticket.status || "").toLowerCase()))
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 5)
      .map((ticket) => ({
        id: ticket._id,
        subject: ticket.subject || "Untitled ticket",
        category: formatTitle(ticket.category),
        priority: formatTitle(ticket.priority),
        resolvedAt: ticket.updatedAt || ticket.createdAt,
      }));

    return {
      total,
      resolved,
      inProgress,
      open,
      resolutionRate,
      categoryEntries,
      statusEntries,
      priorityEntries,
      recentResolved,
    };
  }, [tickets]);

  if (loading) {
    return (
      <section className={`flex items-center justify-center gap-3 rounded-[22px] border p-16 text-sm ${panel} ${muted}`}>
        <Clock3 size={18} /> Loading analytics...
      </section>
    );
  }

  if (error) {
    return (
      <section className={`flex items-center gap-3 rounded-[22px] border p-16 text-sm text-[#ff7777] ${panel}`}>
        <AlertCircle size={18} /> {error}
      </section>
    );
  }

  if (!tickets.length) {
    return (
      <section className={`flex flex-col items-center rounded-[22px] border border-dashed p-16 text-center ${panel}`}>
        <BarChart3 size={28} className={isDark ? "text-[#d7c7ff]" : "text-[#6d4bc8]"} />
        <p className={`mt-3 text-lg font-semibold ${heading}`}>No analytics yet</p>
        <p className={`mt-1 max-w-md text-sm ${muted}`}>
          Assigned tickets will appear here once work is available for this agent.
        </p>
      </section>
    );
  }

  const summaryCards = [
    { label: "Total Assigned", value: analytics.total, tone: "neutral" },
    { label: "Resolved", value: analytics.resolved, tone: "success" },
    { label: "In Progress", value: analytics.inProgress, tone: "primary" },
    { label: "Resolution Rate", value: `${analytics.resolutionRate}%`, tone: "secondary" },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${muted}`}>
            Support performance
          </p>
          <h1 className={`text-3xl font-semibold tracking-[-0.05em] ${heading}`}>
            Analytics
          </h1>
          <p className={`mt-1 text-sm ${muted}`}>
            Track your support performance and ticket workload.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(({ label, value, tone }, index) => {
          const toneStyles =
            tone === "neutral"
              ? isDark
                ? "border-[#2b3548] bg-[#171f2d]"
                : "border-[#e7dff3] bg-[#f4f0fb]"
              : tone === "primary"
                ? isDark
                  ? "border-[#7d5dfc] bg-[#221f3d]"
                  : "border-[#d8d0ff] bg-[#f0ebff]"
                : tone === "success"
                  ? isDark
                    ? "border-[#2f5b4a] bg-[#172a26]"
                    : "border-[#d0f0df] bg-[#ebfaf2]"
                  : isDark
                    ? "border-[#37528a] bg-[#18263e]"
                    : "border-[#dfe8ff] bg-[#edf4ff]";

          return (
            <div key={label} className={`rounded-[18px] border p-5 shadow-[0_14px_30px_rgba(67,47,92,0.08)] ${toneStyles}`}>
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#8d5fe5] text-white shadow-[0_10px_20px_rgba(141,95,229,0.25)]">
                {label === "Resolved" ? <CheckCircle2 size={17} /> : label === "In Progress" ? <Clock3 size={17} /> : <Ticket size={17} />}
              </div>
              <p className={`text-3xl font-semibold tracking-[-0.05em] ${heading}`}>{value}</p>
              <p className={`mt-1 text-xs font-medium uppercase tracking-[0.12em] ${muted}`}>{label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className={`rounded-[20px] border p-5 ${panel}`}>
          <h2 className={`mb-1 text-lg font-semibold ${heading}`}>Tickets by category</h2>
          <p className={`mb-5 text-xs ${muted}`}>Distribution of your assigned work</p>
          <BarList items={analytics.categoryEntries} isDark={isDark} />
        </section>

        <section className={`rounded-[20px] border p-5 ${panel}`}>
          <h2 className={`mb-1 text-lg font-semibold ${heading}`}>Tickets by status</h2>
          <p className={`mb-5 text-xs ${muted}`}>Current workload split</p>
          <BarList items={analytics.statusEntries} isDark={isDark} />
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={`rounded-[20px] border p-5 ${panel}`}>
          <h2 className={`mb-1 text-lg font-semibold ${heading}`}>Priority distribution</h2>
          <p className={`mb-5 text-xs ${muted}`}>Handled ticket mix</p>
          <BarList items={analytics.priorityEntries} isDark={isDark} />
        </section>

        <section className={`rounded-[20px] border p-5 ${panel}`}>
          <h2 className={`mb-1 text-lg font-semibold ${heading}`}>Recent performance</h2>
          <p className={`mb-5 text-xs ${muted}`}>Recently resolved tickets</p>

          {analytics.recentResolved.length === 0 ? (
            <div className={`rounded-[16px] border border-dashed p-5 text-sm ${muted}`}>
              No resolved tickets yet.
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.recentResolved.map((ticket) => (
                <div key={ticket.id} className={`rounded-[16px] border p-3 ${soft}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${muted}`}>
                        #{String(ticket.id).slice(-6).toUpperCase()}
                      </p>
                      <p className={`mt-2 font-semibold ${heading}`}>{ticket.subject}</p>
                    </div>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getPriorityClass(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                    <span className={`${muted}`}>{ticket.category}</span>
                    <span className={`${muted}`}>{new Date(ticket.resolvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default Analytics;
