import { useEffect, useState } from "react";
import { AlertCircle, BarChart3, Clock3, Ticket } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../features/auth/services/authContext.jsx";
import { getAnalyticsService } from "../../features/auth/services/auth.api.js";

const colors = ["bg-[#9b5ce7]", "bg-[#6f8cff]", "bg-[#58a7f8]", "bg-[#6fc8a0]"];
const Analytics = () => {
	const { theme } = useTheme();
	const { user, restoringSession } = useAuth();
	const isDark = theme === "dark";
	const [range, setRange] = useState(7);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const panel = isDark ? "border-[#293449] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]";
	const heading = isDark ? "text-[#f8f0ff]" : "text-[#201d2c]";
	const muted = isDark ? "text-[#9fa9c5]" : "text-[#6c687d]";
	const inner = isDark ? "border-[#2b3548] bg-[#171f2d]" : "border-[#e7dff3] bg-[#efe8f8]";

	useEffect(() => {
		if (restoringSession || user?.role !== "admin") return;
		const loadAnalytics = async () => {
			try { setLoading(true); setError(""); setData(await getAnalyticsService(range)); }
			catch (fetchError) { setError(fetchError.response?.data?.message || "Unable to load analytics right now."); }
			finally { setLoading(false); }
		};
		loadAnalytics();
	}, [range, restoringSession, user?.role]);

	if (user && user.role !== "admin") return <section className={`rounded-[22px] border p-8 ${panel}`}><p className="text-[#ff7777]">Admin access required.</p></section>;
	if (loading) return <section className={`flex items-center justify-center gap-3 rounded-[22px] border p-16 text-sm ${panel} ${muted}`}><Clock3 size={18} /> Loading analytics...</section>;
	if (error) return <section className={`flex items-center gap-3 rounded-[22px] border p-16 text-sm text-[#ff7777] ${panel}`}><AlertCircle size={18} /> {error}</section>;
	if (!data || data.summary.totalTickets === 0) return <section className={`flex flex-col items-center rounded-[22px] border p-16 text-center ${panel} ${muted}`}><BarChart3 size={28} /><p className={`mt-3 text-lg font-semibold ${heading}`}>No analytics data</p><p className="mt-1 text-sm">There are no tickets in the selected period.</p></section>;

	const maxVolume = Math.max(...data.volume.map((item) => Math.max(item.created, item.resolved)), 1);
	const maxCategory = Math.max(...data.category.map((item) => item.value), 1);
	const maxPriority = Math.max(...data.priority.map((item) => item.value), 1);
	const maxStatus = Math.max(...data.status.map((item) => item.value), 1);
	const cards = [["Total Tickets", data.summary.totalTickets], ["New Tickets", data.summary.newTickets], ["Resolved Tickets", data.summary.resolvedTickets], ["Resolution Rate", `${data.summary.resolutionRate}%`]];
	const barList = (items, max, tone = "bg-[#8d5fe5]") => <div className="space-y-3">{items.map((item, index) => <div key={item.label}><div className={`mb-1 flex justify-between text-xs ${muted}`}><span>{item.label}</span><span>{item.value}</span></div><div className={`h-2 overflow-hidden rounded-full ${isDark ? "bg-[#253047]" : "bg-[#ded4eb]"}`}><div className={`h-full rounded-full ${tone === "multi" ? colors[index % colors.length] : tone}`} style={{ width: `${(item.value / max) * 100}%` }} /></div></div>)}</div>;

	return <section className="space-y-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${muted}`}>Support operations</p><h1 className={`text-3xl font-semibold tracking-[-0.05em] ${heading}`}>Analytics</h1></div><div className={`flex rounded-xl border p-1 ${inner}`}>{[7, 30, 90].map((option) => <button type="button" key={option} onClick={() => setRange(option)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${range === option ? "bg-[#8d5fe5] text-white" : muted}`}>{option} days</button>)}</div></div>
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value], index) => <div key={label} className={`rounded-[18px] border p-5 shadow-[0_14px_30px_rgba(67,47,92,0.08)] ${panel}`}><div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl ${colors[index]} text-white`}><Ticket size={17} /></div><p className={`text-3xl font-semibold tracking-[-0.05em] ${heading}`}>{value}</p><p className={`mt-1 text-xs font-medium uppercase tracking-[0.12em] ${muted}`}>{label}</p></div>)}</div>
		<div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]"><section className={`rounded-[20px] border p-5 ${panel}`}><div className="mb-5 flex items-center justify-between"><div><h2 className={`text-lg font-semibold ${heading}`}>Ticket Volume</h2><p className={`mt-1 text-xs ${muted}`}>Created and resolved tickets</p></div><BarChart3 size={19} className={muted} /></div><div className="flex h-52 items-end gap-1 overflow-hidden border-b border-[#8d5fe533] px-1">{data.volume.map((item) => <div key={item.date} className="group flex h-full min-w-[10px] flex-1 items-end justify-center gap-0.5"><div title={`${item.label}: ${item.created} created`} className="w-1/2 rounded-t bg-[#8d5fe5]" style={{ height: `${(item.created / maxVolume) * 90}%` }} /><div title={`${item.label}: ${item.resolved} resolved`} className="w-1/2 rounded-t bg-[#58a7f8]" style={{ height: `${(item.resolved / maxVolume) * 90}%` }} /></div>)}</div><div className={`mt-3 flex justify-between text-[10px] ${muted}`}><span>{data.volume[0]?.label}</span><span>{data.volume.at(-1)?.label}</span></div><div className={`mt-4 flex gap-4 text-xs ${muted}`}><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#8d5fe5]" />Created</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#58a7f8]" />Resolved</span></div></section><section className={`rounded-[20px] border p-5 ${panel}`}><h2 className={`mb-1 text-lg font-semibold ${heading}`}>Ticket Status</h2><p className={`mb-5 text-xs ${muted}`}>Current ticket distribution</p>{barList(data.status, maxStatus, "multi")}</section></div>
		<div className="grid gap-6 lg:grid-cols-2"><section className={`rounded-[20px] border p-5 ${panel}`}><h2 className={`mb-1 text-lg font-semibold ${heading}`}>Tickets by Category</h2><p className={`mb-5 text-xs ${muted}`}>Tickets grouped by category</p>{barList(data.category, maxCategory, "multi")}</section><section className={`rounded-[20px] border p-5 ${panel}`}><h2 className={`mb-1 text-lg font-semibold ${heading}`}>Priority Distribution</h2><p className={`mb-5 text-xs ${muted}`}>Tickets grouped by priority</p>{barList(data.priority, maxPriority, "multi")}</section></div>
		<section className={`rounded-[20px] border p-5 ${panel}`}><h2 className={`mb-1 text-lg font-semibold ${heading}`}>Agent Performance</h2><p className={`mb-5 text-xs ${muted}`}>Ticket workload in the selected period</p><div className="overflow-x-auto"><table className="w-full min-w-[540px] text-left text-sm"><thead className={isDark ? "bg-[#171f2d]" : "bg-[#efe8f8]"}><tr>{["Agent", "Assigned", "Resolved", "In Progress"].map((label) => <th key={label} className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] ${muted}`}>{label}</th>)}</tr></thead><tbody className={`divide-y ${isDark ? "divide-[#2b3548]" : "divide-[#e7dff3]"}`}>{data.agentPerformance.map((agent) => <tr key={agent._id}><td className={`px-4 py-3 font-semibold ${heading}`}>{agent.name}</td><td className={`px-4 py-3 ${muted}`}>{agent.assigned}</td><td className={`px-4 py-3 ${muted}`}>{agent.resolved}</td><td className={`px-4 py-3 ${muted}`}>{agent.inProgress}</td></tr>)}</tbody></table></div></section></section>;
};

export default Analytics;
