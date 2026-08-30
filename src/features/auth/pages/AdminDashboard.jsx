import { useState } from "react";
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
  Search,
  Settings,
  Sparkles,
  Ticket,
  Users,
  X,
} from "lucide-react";
import Themetogglebutton from "../../../components/Themetogglebutton";
import { useTheme } from "../../../context/ThemeContext.jsx";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "All Tickets", icon: Ticket },
  { label: "Agents", icon: Users },
  { label: "Customers", icon: CircleUserRound },
  { label: "Analytics", icon: BarChart3 },
];

const stats = [
  { label: "Total Tickets", value: "248", trend: "+12.5%", icon: Ticket, tone: "violet" },
  { label: "New", value: "32", trend: "+8.2%", icon: MessageSquareText, tone: "blue" },
  { label: "Assigned", value: "41", trend: "+4.6%", icon: Users, tone: "indigo" },
  { label: "In Progress", value: "68", trend: "-2.4%", icon: Activity, tone: "amber" },
  { label: "Resolved", value: "107", trend: "+18.3%", icon: CheckCircle2, tone: "green" },
];

const tickets = [
  { id: "TKT-4928", customer: "Alex Mercer", subject: "Double charge on Pro subscription", category: "Billing", priority: "High", agent: "Sarah Khan", status: "In Progress", updated: "2 min ago" },
  { id: "TKT-4927", customer: "John Smith", subject: "Unable to reset password", category: "Account", priority: "Medium", agent: "Alex Johnson", status: "Assigned", updated: "8 min ago" },
  { id: "TKT-4926", customer: "Maria Khan", subject: "Payment failed repeatedly", category: "Billing", priority: "High", agent: "Unassigned", status: "New", updated: "12 min ago" },
  { id: "TKT-4925", customer: "Liam Wilson", subject: "Tracking link is not updating", category: "Shipping", priority: "Low", agent: "Daniel Ahmed", status: "Resolved", updated: "18 min ago" },
];

const agents = [
  { name: "Alex Johnson", initials: "AJ", assigned: 12, progress: 5, resolved: 27, tone: "violet" },
  { name: "Sarah Khan", initials: "SK", assigned: 9, progress: 4, resolved: 31, tone: "blue" },
  { name: "Daniel Ahmed", initials: "DA", assigned: 15, progress: 8, resolved: 22, tone: "green" },
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

const AdminDashboard = () => {
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const isDark = theme === "dark";
  const filteredTickets = tickets.filter((ticket) =>
    `${ticket.id} ${ticket.customer} ${ticket.subject} ${ticket.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  const panel = isDark ? "border-[#293449] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]";
  const muted = isDark ? "text-[#9fa9c5]" : "text-[#6c687d]";
  const heading = isDark ? "text-[#f8f0ff]" : "text-[#201d2c]";

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${isDark ? "bg-[#0d1018] text-[#f2edf7]" : "bg-[#eee5f7] text-[#171827]"}`}>
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className={`fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col justify-between border-r px-5 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${menuOpen ? "translate-x-0" : "-translate-x-full"} ${isDark ? "border-[#252b3c] bg-[#101722]" : "border-[#e7dff4] bg-[#f5f0fb]"}`}>
          <div>
            <div className="mb-8 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#905ae6] text-white shadow-[0_10px_25px_rgba(144,90,230,0.35)]"><Sparkles size={21} /></div>
                <div><div className={`text-[1.75rem] font-bold leading-none tracking-[-0.06em] ${heading}`}>SupportFlow</div><div className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${muted}`}>AI SUPPORT</div></div>
              </div>
              <button aria-label="Close navigation" onClick={() => setMenuOpen(false)} className="lg:hidden"><X size={20} /></button>
            </div>
            <div className={`mb-6 rounded-xl border px-3 py-2.5 ${isDark ? "border-[#2a3549] bg-[#171f2d]" : "border-[#e4d8f7] bg-[#eee5fc]"}`}>
              <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${muted}`}>Workspace</div>
              <div className={`mt-1 flex items-center justify-between text-sm font-semibold ${heading}`}>Operations <ChevronRight size={15} /></div>
            </div>
            <nav className="space-y-2">
              {navItems.map(({ label, icon: Icon, active }) => <button key={label} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-all ${active ? (isDark ? "bg-[#1f2736] text-white shadow-sm" : "bg-[#ebe1ff] text-[#1d1e2d]") : (isDark ? "text-[#d7d9ea] hover:bg-[#171f2d]" : "text-[#4a4763] hover:bg-[#efe7ff]")}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === "All Tickets" && <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${isDark ? "bg-[#2c3850] text-[#cad2eb]" : "bg-white text-[#6a5b83]"}`}>248</span>}</button>)}
            </nav>
          </div>
          <div className={`space-y-2 border-t pt-4 ${isDark ? "border-[#293449]" : "border-[#e5dced]"}`}>
            <button className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium ${muted}`}><Settings size={18} />Settings</button>
            <button className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium ${muted}`}><CircleUserRound size={18} />Profile</button>
            <button className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium ${muted}`}><LogOut size={18} />Logout</button>
          </div>
        </aside>

        {menuOpen && <button aria-label="Close navigation overlay" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-20 bg-[#0b0c12]/50 lg:hidden" />}
        <main className="min-w-0 flex-1 p-5 sm:p-6 lg:p-8">
          <header className="mb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3"><button aria-label="Open navigation" onClick={() => setMenuOpen(true)} className={`rounded-xl p-2 lg:hidden ${isDark ? "bg-[#1b2434]" : "bg-[#f8f3ff]"}`}><Menu size={20} /></button><div><div className={`text-xs font-semibold uppercase tracking-[0.16em] ${muted}`}>Sunday, August 30, 2026</div><h1 className={`mt-1 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl ${heading}`}>Support Overview</h1></div></div>
            <div className="flex items-center gap-2 sm:gap-4"><div className="hidden items-center gap-2 sm:flex"><button aria-label="Notifications" className={`relative rounded-xl p-2.5 ${isDark ? "bg-[#1b2434] text-[#e9dff8]" : "bg-[#f8f3ff] text-[#201a2d]"}`}><AlertCircle size={19} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#9b5ce7]" /></button><Themetogglebutton /></div><div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8d5fe5] bg-gradient-to-br from-[#d7c3ff] to-[#8d5fe5] text-sm font-bold text-[#1b1027]">A</div></div>
          </header>

          <section className={`mb-6 rounded-[22px] border p-5 shadow-[0_20px_45px_rgba(67,47,92,0.12)] sm:p-7 ${panel}`}><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className={`mb-2 text-sm font-medium ${isDark ? "text-[#b8a4ee]" : "text-[#7655a9]"}`}>Good morning, Support Team</p><h2 className={`text-2xl font-semibold tracking-[-0.05em] sm:text-3xl ${heading}`}>A clear view of your operation.</h2><p className={`mt-2 max-w-xl text-sm ${muted}`}>Here&apos;s what&apos;s happening across your support operation today.</p></div><button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#9b5ce7] to-[#7f46d9] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(127,70,217,0.3)] transition-transform hover:scale-[1.01]">View All Tickets <ChevronRight size={16} /></button></div></section>

          <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{stats.map(({ label, value, trend, icon: Icon, tone }) => <div key={label} className={`group rounded-[18px] border p-5 shadow-[0_14px_30px_rgba(67,47,92,0.08)] transition-transform hover:-translate-y-1 ${panel}`}><div className="mb-5 flex items-center justify-between"><div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone === "green" ? "bg-[#53c7871a] text-[#4ecb91]" : tone === "amber" ? "bg-[#f3ae451a] text-[#e7ad55]" : tone === "blue" ? "bg-[#5d9dfc1a] text-[#74a9ff]" : "bg-[#8d5fe51a] text-[#a995ff]"}`}><Icon size={17} /></div><span className={`text-xs font-semibold ${trend.startsWith("-") ? "text-[#e7ad55]" : "text-[#4ecb91]"}`}>{trend}</span></div><div className={`text-4xl font-semibold tracking-[-0.06em] ${heading}`}>{value}</div><div className={`mt-1 text-xs font-medium uppercase tracking-[0.12em] ${muted}`}>{label}</div></div>)}</section>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <section className={`rounded-[20px] border p-5 ${panel}`}><div className="mb-6 flex items-start justify-between"><div><h2 className={`text-lg font-semibold ${heading}`}>Ticket Status Overview</h2><p className={`mt-1 text-xs ${muted}`}>Current ticket lifecycle</p></div><Activity size={19} className={muted} /></div><div className="mb-6 flex h-4 overflow-hidden rounded-full bg-[#ffffff0d]"><div className="w-[13%] bg-[#6f8cff]" /><div className="w-[17%] bg-[#a995ff]" /><div className="w-[27%] bg-[#e7ad55]" /><div className="w-[43%] bg-[#4ecb91]" /></div><div className="grid gap-4 sm:grid-cols-4">{[["New", "32", "bg-[#6f8cff]"], ["Assigned", "41", "bg-[#a995ff]"], ["In Progress", "68", "bg-[#e7ad55]"], ["Resolved", "107", "bg-[#4ecb91]"]].map(([label, value, color]) => <div key={label}><div className="mb-2 flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${color}`} /><span className={`text-xs ${muted}`}>{label}</span></div><div className={`text-2xl font-semibold ${heading}`}>{value}</div><div className={`mt-1 text-[11px] ${muted}`}>tickets</div></div>)}</div></section>
            <section className={`rounded-[20px] border p-5 ${panel}`}><div className="mb-5 flex items-start justify-between"><div><h2 className={`text-lg font-semibold ${heading}`}>Priority Distribution</h2><p className={`mt-1 text-xs ${muted}`}>Where attention is needed</p></div><ListFilter size={18} className={muted} /></div><div className="space-y-4">{[["High", 24, "w-[18%] bg-[#ff7777]"], ["Medium", 91, "w-[68%] bg-[#e7ad55]"], ["Low", 133, "w-full bg-[#4ecb91]"]].map(([label, value, color]) => <div key={label}><div className="mb-2 flex justify-between text-xs"><span className={muted}>{label}</span><span className={`font-semibold ${heading}`}>{value}</span></div><div className={`h-2 rounded-full ${isDark ? "bg-[#222b3b]" : "bg-[#e9e1f2]"}`}><div className={`h-full rounded-full ${color}`} /></div></div>)}</div><div className={`mt-6 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs ${isDark ? "border-[#493449] bg-[#281e2d] text-[#e9b1bd]" : "border-[#f0dbe5] bg-[#fff4f7] text-[#9c586e]"}`}><AlertCircle size={15} />24 high-priority tickets require attention.</div></section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <section className={`rounded-[20px] border p-5 ${panel}`}><div className="mb-5 flex items-start justify-between"><div><h2 className={`text-lg font-semibold ${heading}`}>Tickets by Category</h2><p className={`mt-1 text-xs ${muted}`}>248 total tickets</p></div><BarChart3 size={18} className={muted} /></div><div className="space-y-4">{categories.map(({ label, value, color }) => <div key={label}><div className="mb-1.5 flex justify-between text-xs"><span className={muted}>{label}</span><span className={`font-semibold ${heading}`}>{value}</span></div><div className={`h-2 rounded-full ${isDark ? "bg-[#222b3b]" : "bg-[#e9e1f2]"}`}><div className={`h-full rounded-full ${color}`} style={{ width: `${(value / 72) * 100}%` }} /></div></div>)}</div></section>
            <section className={`rounded-[20px] border p-5 ${panel}`}><div className="mb-4 flex items-center justify-between"><div><h2 className={`text-lg font-semibold ${heading}`}>Agent Workload</h2><p className={`mt-1 text-xs ${muted}`}>Active support team</p></div><button className={`text-xs font-semibold ${isDark ? "text-[#b8a4ee]" : "text-[#7655a9]"}`}>View agents</button></div><div className="overflow-x-auto"><table className="min-w-full text-left"><thead><tr className={`border-b text-[10px] uppercase tracking-[0.14em] ${isDark ? "border-[#293449] text-[#7e8aa9]" : "border-[#e8def4] text-[#81788f]"}`}><th className="pb-3">Agent</th><th className="pb-3">Assigned</th><th className="pb-3">In progress</th><th className="pb-3">Resolved</th></tr></thead><tbody>{agents.map((agent) => <tr key={agent.name} className={`border-b last:border-0 ${isDark ? "border-[#202b3d]" : "border-[#eee6f5]"}`}><td className="py-3"><div className="flex items-center gap-2.5"><span className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white ${agent.tone === "green" ? "bg-[#4ecb91]" : agent.tone === "blue" ? "bg-[#6f8cff]" : "bg-[#9b5ce7]"}`}>{agent.initials}</span><div><div className={`text-xs font-semibold ${heading}`}>{agent.name}</div><div className="mt-1 flex items-center gap-1 text-[10px] text-[#4ecb91]"><span className="h-1.5 w-1.5 rounded-full bg-[#4ecb91]" />Active</div></div></div></td><td className={`py-3 text-xs ${muted}`}>{agent.assigned}</td><td className={`py-3 text-xs ${muted}`}>{agent.progress}</td><td className={`py-3 text-xs ${muted}`}>{agent.resolved}</td></tr>)}</tbody></table></div></section>
          </div>

          <section className={`mt-6 rounded-[20px] border ${panel}`}><div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className={`text-lg font-semibold ${heading}`}>Recent Tickets</h2><p className={`mt-1 text-xs ${muted}`}>Latest activity across your support operation</p></div><div className="relative w-full sm:w-64"><Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${muted}`} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tickets..." className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-xs outline-none ${isDark ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff] focus:border-[#8d5fe5]" : "border-[#e9ddf9] bg-[#f9f5ff] text-[#171827] focus:border-[#a36ae8]"}`} /></div></div><div className="overflow-x-auto"><table className="min-w-[850px] w-full text-left"><thead className={isDark ? "bg-[#171f2f] text-[#8792ae]" : "bg-[#f0ebf9] text-[#6f687d]"}><tr>{["Ticket", "Customer", "Subject", "Category", "Priority", "Agent", "Status", "Updated"].map((head) => <th key={head} className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em]">{head}</th>)}</tr></thead><tbody>{filteredTickets.map((ticket) => <tr key={ticket.id} className={`border-t transition-colors hover:bg-[#ffffff05] ${isDark ? "border-[#212d3e]" : "border-[#e8def6]"}`}><td className={`px-5 py-4 text-xs font-semibold ${isDark ? "text-[#bca7f1]" : "text-[#7655a9]"}`}>{ticket.id}</td><td className={`px-5 py-4 text-xs ${heading}`}>{ticket.customer}</td><td className={`max-w-[230px] truncate px-5 py-4 text-xs ${muted}`}>{ticket.subject}</td><td className={`px-5 py-4 text-xs ${muted}`}>{ticket.category}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${priorityStyles[ticket.priority]}`}>{ticket.priority}</span></td><td className={`px-5 py-4 text-xs ${muted}`}>{ticket.agent}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[ticket.status]}`}>{ticket.status}</span></td><td className={`px-5 py-4 text-xs ${muted}`}>{ticket.updated}</td></tr>)}</tbody></table>{filteredTickets.length === 0 && <div className={`p-10 text-center text-sm ${muted}`}>No tickets found.</div>}</div></section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr_0.8fr]">
            <section className={`rounded-[20px] border p-5 ${panel}`}><div className="mb-4 flex items-center justify-between"><h2 className={`text-lg font-semibold ${heading}`}>Recent Activity</h2><Clock3 size={18} className={muted} /></div><div className="space-y-4">{[["Ticket TKT-4928 assigned to Sarah Khan", "2 min ago"], ["Ticket TKT-4927 moved to In Progress", "8 min ago"], ["Ticket TKT-4926 created", "12 min ago"], ["Ticket TKT-4925 resolved by Alex Johnson", "18 min ago"]].map(([text, time]) => <div key={text} className="flex gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#9b5ce7] shadow-[0_0_0_4px_#9b5ce71a]" /><div><p className={`text-xs ${heading}`}>{text}</p><p className={`mt-1 text-[10px] ${muted}`}>{time}</p></div></div>)}</div></section>
            <section className={`rounded-[20px] border p-5 ${panel}`}><div className="mb-4 flex items-center gap-2"><Sparkles size={18} className="text-[#a995ff]" /><h2 className={`text-lg font-semibold ${heading}`}>AI Triage Activity</h2></div><div className="grid grid-cols-3 gap-2">{[["Analyzed", "184"], ["Reviewed", "176"], ["Manual", "8"]].map(([label, value]) => <div key={label} className={`rounded-xl p-3 text-center ${isDark ? "bg-[#1b2434]" : "bg-[#f0e8fb]"}`}><div className={`text-xl font-semibold ${heading}`}>{value}</div><div className={`mt-1 text-[10px] ${muted}`}>{label}</div></div>)}</div><p className={`mt-5 text-xs leading-5 ${muted}`}>AI assists agents with categorization, priority, and summaries. <span className={heading}>Humans make the final decision.</span></p></section>
            <section className={`rounded-[20px] border p-5 ${panel}`}><div className="mb-4 flex items-center gap-2"><AlertCircle size={18} className="text-[#ff7777]" /><h2 className={`text-lg font-semibold ${heading}`}>Requires Attention</h2></div><div className="space-y-3">{tickets.filter((ticket) => ticket.priority === "High").slice(0, 2).map((ticket) => <div key={ticket.id} className={`rounded-xl border p-3 ${isDark ? "border-[#493449] bg-[#281e2d]" : "border-[#f0dbe5] bg-[#fff4f7]"}`}><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#ff7777]">High</span><span className={`text-[10px] ${muted}`}>{ticket.id}</span></div><p className={`mt-2 text-xs font-semibold ${heading}`}>{ticket.subject}</p><p className={`mt-1 text-[10px] ${muted}`}>{ticket.agent} · {ticket.status}</p></div>)}</div></section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
