import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Clock3, Search, Ticket, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../features/auth/services/authContext.jsx";
import { getCustomerDetailsService, getCustomersService } from "../../features/auth/services/auth.api.js";

const formatDate = (value) => {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const statusLabel = { open: "Open", in_progress: "In Progress", resolved: "Resolved", closed: "Closed" };
const statusClass = (status) => status === "resolved" || status === "closed" ? "bg-[#53c7871a] text-[#4ecb91]" : status === "in_progress" ? "bg-[#f3ae451a] text-[#e7ad55]" : "bg-[#5d9dfc1a] text-[#74a9ff]";

const Customers = () => {
	const { theme } = useTheme();
	const { user, restoringSession } = useAuth();
	const navigate = useNavigate();
	const isDark = theme === "dark";
	const [customers, setCustomers] = useState([]);
	const [query, setQuery] = useState("");
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [details, setDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const [detailsLoading, setDetailsLoading] = useState(false);
	const [error, setError] = useState("");
	const [detailsError, setDetailsError] = useState("");
	const panel = isDark ? "border-[#293449] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]";
	const heading = isDark ? "text-[#f8f0ff]" : "text-[#201d2c]";
	const muted = isDark ? "text-[#9fa9c5]" : "text-[#6c687d]";
	const control = isDark ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff]" : "border-[#e9ddf9] bg-[#f9f5ff] text-[#171827]";

	useEffect(() => {
		if (restoringSession || user?.role !== "admin") return;
		const loadCustomers = async () => {
			try { setLoading(true); setError(""); setCustomers(await getCustomersService()); }
			catch (fetchError) { setError(fetchError.response?.data?.message || "Unable to load customers right now."); }
			finally { setLoading(false); }
		};
		loadCustomers();
	}, [restoringSession, user?.role]);

	const filteredCustomers = useMemo(() => customers.filter((customer) => `${customer.username} ${customer.email}`.toLowerCase().includes(query.toLowerCase())), [customers, query]);

	const openCustomer = async (customer) => {
		setSelectedCustomer(customer);
		setDetails(null);
		setDetailsError("");
		try { setDetailsLoading(true); setDetails(await getCustomerDetailsService(customer._id)); }
		catch (fetchError) { setDetailsError(fetchError.response?.data?.message || "Unable to load customer history."); }
		finally { setDetailsLoading(false); }
	};

	if (user && user.role !== "admin") return <section className={`rounded-[22px] border p-8 ${panel}`}><p className="text-[#ff7777]">Admin access required.</p></section>;

	return <section className={`rounded-[22px] border p-5 shadow-[0_20px_45px_rgba(67,47,92,0.12)] sm:p-7 ${panel}`}>
		<div className="mb-6"><p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${muted}`}>Support operations</p><h1 className={`text-3xl font-semibold tracking-[-0.05em] ${heading}`}>Customers</h1></div>
		<div className="relative mb-5 max-w-md"><Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${muted}`} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or email" className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#8d5fe5] ${control}`} /></div>
		{loading ? <div className={`flex items-center justify-center gap-3 px-6 py-16 text-sm ${muted}`}><Clock3 size={18} /> Loading customers...</div> : error ? <div className="flex items-center gap-3 px-6 py-16 text-sm text-[#ff7777]"><AlertCircle size={18} /> {error}</div> : filteredCustomers.length === 0 ? <div className={`flex flex-col items-center px-6 py-16 text-center ${muted}`}><Ticket size={26} /><p className={`mt-3 text-lg font-semibold ${heading}`}>No customers found</p><p className="mt-1 text-sm">Try a different name or email.</p></div> : <div className={`overflow-x-auto rounded-[18px] border ${isDark ? "border-[#2b3548]" : "border-[#e7dff3]"}`}><table className="w-full min-w-[760px] text-left text-sm"><thead className={isDark ? "bg-[#171f2d]" : "bg-[#efe8f8]"}><tr>{["Customer", "Email", "Total Tickets", "Open Tickets", "Resolved Tickets", "Joined Date"].map((label) => <th key={label} className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] ${muted}`}>{label}</th>)}</tr></thead><tbody className={`divide-y ${isDark ? "divide-[#2b3548]" : "divide-[#e7dff3]"}`}>{filteredCustomers.map((customer) => <tr key={customer._id} onClick={() => openCustomer(customer)} className={`cursor-pointer transition-colors ${isDark ? "hover:bg-[#172335]" : "hover:bg-[#f0e9f8]"}`}><td className={`px-4 py-4 font-semibold ${heading}`}>{customer.username}</td><td className={`px-4 py-4 ${muted}`}>{customer.email}</td><td className={`px-4 py-4 ${heading}`}>{customer.totalTickets ?? 0}</td><td className={`px-4 py-4 ${muted}`}>{customer.openTickets ?? 0}</td><td className={`px-4 py-4 ${muted}`}>{customer.resolvedTickets ?? 0}</td><td className={`whitespace-nowrap px-4 py-4 ${muted}`}>{formatDate(customer.createdAt)}</td></tr>)}</tbody></table></div>}
		{selectedCustomer && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080a10]/70 p-4" onClick={() => setSelectedCustomer(null)}><div className={`max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[22px] border p-6 shadow-2xl ${panel}`} onClick={(event) => event.stopPropagation()}><div className="mb-6 flex items-start justify-between"><div><p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${muted}`}>Customer information</p><h2 className={`mt-1 text-2xl font-semibold ${heading}`}>{selectedCustomer.username}</h2><p className={`mt-1 text-sm ${muted}`}>{selectedCustomer.email}</p></div><button type="button" onClick={() => setSelectedCustomer(null)} aria-label="Close customer details" className={muted}><X size={20} /></button></div>{detailsLoading ? <div className={`flex items-center justify-center gap-3 py-12 text-sm ${muted}`}><Clock3 size={18} /> Loading ticket history...</div> : detailsError ? <p className="py-8 text-sm text-[#ff7777]">{detailsError}</p> : <><div className="mb-6 grid grid-cols-3 gap-3">{[["Total", details?.tickets?.length ?? 0], ["Open", details?.tickets?.filter((ticket) => ticket.status === "open" || ticket.status === "in_progress").length ?? 0], ["Resolved", details?.tickets?.filter((ticket) => ticket.status === "resolved").length ?? 0]].map(([label, value]) => <div key={label} className={`rounded-xl border p-3 ${isDark ? "border-[#2b3548] bg-[#171f2d]" : "border-[#e7dff3] bg-[#efe8f8]"}`}><p className={`text-[10px] uppercase tracking-[0.12em] ${muted}`}>{label}</p><p className={`mt-1 text-xl font-semibold ${heading}`}>{value}</p></div>)}</div><h3 className={`mb-3 font-semibold ${heading}`}>Ticket history</h3>{details?.tickets?.length ? <div className="space-y-2">{details.tickets.map((ticket) => <button type="button" key={ticket._id} onClick={() => navigate(`/tickets/${ticket._id}`)} className={`flex w-full items-center justify-between gap-4 rounded-xl border p-3 text-left ${control}`}><span className={`min-w-0 truncate font-medium ${heading}`}>{ticket.subject}</span><span className={`whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(ticket.status)}`}>{statusLabel[ticket.status] || ticket.status}</span></button>)}</div> : <p className={`py-6 text-sm ${muted}`}>No tickets yet.</p>}</>}</div></div>}
	</section>;
};

export default Customers;
