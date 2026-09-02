import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Clock3, Search, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../features/auth/services/authContext.jsx";
import { getAllTicketsService } from "../../features/tickets/services/ticket.service.js";

const statusLabels = { open: "Open", in_progress: "In Progress", resolved: "Resolved", closed: "Closed" };
const priorityLabels = { low: "Low", medium: "Medium", high: "High", urgent: "Urgent" };
const formatLabel = (value, labels) => labels[value?.toLowerCase()] || value || "—";
const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const statusClass = (value) => value === "Resolved" || value === "Closed" ? "bg-[#53c7871a] text-[#4ecb91]" : value === "In Progress" ? "bg-[#f3ae451a] text-[#e7ad55]" : "bg-[#5d9dfc1a] text-[#74a9ff]";
const priorityClass = (value) => value === "High" || value === "Urgent" ? "bg-[#ff5a5a1a] text-[#ff7777]" : value === "Low" ? "bg-[#53c7871a] text-[#4ecb91]" : "bg-[#f3ae451a] text-[#e7ad55]";

const AllTickets = () => {
  const { theme } = useTheme();
  const { restoringSession } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const [tickets, setTickets] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pageSize = 8;

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");
      setTickets(await getAllTicketsService());
      console.log("admin ticckets", tickets);
    } catch (fetchError) {
        console.error("FETCH ALL TICKETS ERROR:", fetchError);
    console.error("STATUS:", fetchError.response?.status);
    console.error("DATA:", fetchError.response?.data);

      setError(fetchError.response?.data?.message || "Unable to load tickets right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!restoringSession) fetchTickets();
  }, [restoringSession]);

  const categories = [...new Set(tickets.map((ticket) => ticket.category).filter(Boolean))];
  const filteredTickets = useMemo(() => tickets.filter((ticket) => {
    const normalizedStatus = formatLabel(ticket.status, statusLabels);
    const normalizedPriority = formatLabel(ticket.priority, priorityLabels);
    const searchable = `${ticket._id || ""} ${ticket.subject || ""} ${ticket.customer?.username || ""} ${ticket.customer?.email || ""}`.toLowerCase();
    return searchable.includes(query.toLowerCase()) && (!status || normalizedStatus === status) && (!priority || normalizedPriority === priority) && (!category || ticket.category === category);
  }), [tickets, query, status, priority, category]);
  const pageCount = Math.max(1, Math.ceil(filteredTickets.length / pageSize));
  const visibleTickets = filteredTickets.slice((page - 1) * pageSize, page * pageSize);
  const panel = isDark ? "border-[#293449] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]";
  const heading = isDark ? "text-[#f8f0ff]" : "text-[#201d2c]";
  const muted = isDark ? "text-[#9fa9c5]" : "text-[#6c687d]";
  const control = isDark ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff]" : "border-[#e9ddf9] bg-[#f9f5ff] text-[#171827]";

  useEffect(() => setPage(1), [query, status, priority, category]);

  return (
    <section className={`rounded-[22px] border p-5 shadow-[0_20px_45px_rgba(67,47,92,0.12)] sm:p-7 ${panel}`}>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${muted}`}>Support operations</p><h1 className={`text-3xl font-semibold tracking-[-0.05em] ${heading}`}>All Tickets</h1></div><button type="button" onClick={fetchTickets} className={`rounded-xl border px-4 py-2 text-sm font-semibold ${control}`}>Refresh</button></div>
      <div className="mb-5 grid gap-3 lg:grid-cols-[minmax(220px,1fr)_repeat(3,minmax(140px,0.25fr))]"><label className="relative block"><Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${muted}`} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subject, customer, or ID" className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#8d5fe5] ${control}`} /></label>{[["Status", status, setStatus, ["Open", "In Progress", "Resolved", "Closed"]], ["Priority", priority, setPriority, ["Low", "Medium", "High", "Urgent"]], ["Category", category, setCategory, categories]].map(([label, value, setter, options]) => <select key={label} value={value} onChange={(event) => setter(event.target.value)} aria-label={`Filter by ${label.toLowerCase()}`} className={`rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#8d5fe5] ${control}`}><option value="">All {label}s</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>)}</div>
      {loading ? <div className={`flex items-center justify-center gap-3 px-6 py-16 text-sm ${muted}`}><Clock3 size={18} /> Loading tickets...</div> : error ? <div className="flex items-center gap-3 px-6 py-16 text-sm text-[#ff7777]"><AlertCircle size={18} /> {error}</div> : filteredTickets.length === 0 ? <div className={`flex flex-col items-center px-6 py-16 text-center ${muted}`}><Ticket size={26} /><p className={`mt-3 text-lg font-semibold ${heading}`}>No tickets found</p><p className="mt-1 text-sm">Try changing your search or filters.</p></div> : <div className={`overflow-hidden rounded-[18px] border ${isDark ? "border-[#2b3548]" : "border-[#e7dff3]"}`}><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className={isDark ? "bg-[#171f2d]" : "bg-[#efe8f8]"}><tr>{["Ticket ID", "Customer", "Subject", "Category", "Priority", "Agent", "Status", "Created"].map((label) => <th key={label} className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] ${muted}`}>{label}</th>)}</tr></thead><tbody className={`divide-y ${isDark ? "divide-[#2b3548]" : "divide-[#e7dff3]"}`}>{visibleTickets.map((ticket) => { const ticketStatus = formatLabel(ticket.status, statusLabels); const ticketPriority = formatLabel(ticket.priority, priorityLabels); return <tr key={ticket._id} onClick={() => navigate(`/tickets/${ticket._id}`)} className={`cursor-pointer transition-colors ${isDark ? "hover:bg-[#172335]" : "hover:bg-[#f0e9f8]"}`}><td className={`px-4 py-4 font-semibold ${heading}`}>TKT-{ticket._id?.slice(-6).toUpperCase() || "NEW"}</td><td className={`px-4 py-4 ${heading}`}>{ticket.customer?.username || ticket.customer?.email || "Unassigned"}</td><td className={`max-w-[240px] truncate px-4 py-4 font-medium ${heading}`}>{ticket.subject || "Untitled ticket"}</td><td className={`px-4 py-4 capitalize ${muted}`}>{ticket.category || "—"}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${priorityClass(ticketPriority)}`}>{ticketPriority}</span></td><td className={`px-4 py-4 ${muted}`}>{ticket.assignedAgent?.username || "Unassigned"}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClass(ticketStatus)}`}>{ticketStatus}</span></td><td className={`whitespace-nowrap px-4 py-4 ${muted}`}>{formatDate(ticket.createdAt)}</td></tr>; })}</tbody></table></div><div className={`flex items-center justify-between border-t px-4 py-3 text-xs ${muted} ${isDark ? "border-[#2b3548]" : "border-[#e7dff3]"}`}><span>{filteredTickets.length} ticket{filteredTickets.length === 1 ? "" : "s"}</span><div className="flex items-center gap-2"><button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className={`rounded-lg border p-1.5 disabled:cursor-not-allowed disabled:opacity-40 ${control}`}><ChevronLeft size={15} /></button><span>Page {page} of {pageCount}</span><button type="button" aria-label="Next page" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)} className={`rounded-lg border p-1.5 disabled:cursor-not-allowed disabled:opacity-40 ${control}`}><ChevronRight size={15} /></button></div></div></div>}
    </section>
  );
};

export default AllTickets;
