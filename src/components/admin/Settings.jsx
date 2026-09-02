import { useEffect, useState } from "react";
import { AlertCircle, Check, Clock3, Settings as SettingsIcon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../features/auth/services/authContext.jsx";
import { getSettingsService, updateSettingsService } from "../../features/auth/services/auth.api.js";

const defaults = {
	supportDeskName: "SupportFlow",
	defaultTicketPriority: "medium",
	defaultTicketStatus: "open",
	aiTriageEnabled: true,
	ticketNotificationsEnabled: true,
};

const Toggle = ({ checked, onChange, label }) => <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-[#8d5fe5]" : "bg-[#596277]"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "left-6" : "left-1"}`} /></button>;

const Settings = () => {
	const { theme } = useTheme();
	const { user, restoringSession } = useAuth();
	const isDark = theme === "dark";
	const [form, setForm] = useState(defaults);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [saved, setSaved] = useState(false);
	const panel = isDark ? "border-[#293449] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]";
	const heading = isDark ? "text-[#f8f0ff]" : "text-[#201d2c]";
	const muted = isDark ? "text-[#9fa9c5]" : "text-[#6c687d]";
	const control = isDark ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff]" : "border-[#e9ddf9] bg-[#f9f5ff] text-[#171827]";

	useEffect(() => {
		if (restoringSession || user?.role !== "admin") return;
		const loadSettings = async () => {
			try { setLoading(true); setError(""); setForm({ ...defaults, ...(await getSettingsService()) }); }
			catch (fetchError) { setError(fetchError.response?.data?.message || "Unable to load settings right now."); }
			finally { setLoading(false); }
		};
		loadSettings();
	}, [restoringSession, user?.role]);

	const updateField = (field, value) => { setSaved(false); setForm((current) => ({ ...current, [field]: value })); };
	const saveSettings = async (event) => {
		event.preventDefault();
		try { setSaving(true); setError(""); setForm({ ...defaults, ...(await updateSettingsService(form)) }); setSaved(true); }
		catch (saveError) { setError(saveError.response?.data?.message || "Unable to save settings right now."); }
		finally { setSaving(false); }
	};

	if (user && user.role !== "admin") return <section className={`rounded-[22px] border p-8 ${panel}`}><p className="text-[#ff7777]">Admin access required.</p></section>;
	if (loading) return <section className={`flex items-center justify-center gap-3 rounded-[22px] border p-16 text-sm ${panel} ${muted}`}><Clock3 size={18} /> Loading settings...</section>;
	if (error && !form.supportDeskName) return <section className={`flex items-center gap-3 rounded-[22px] border p-16 text-sm text-[#ff7777] ${panel}`}><AlertCircle size={18} /> {error}</section>;

	return <form onSubmit={saveSettings} className="space-y-6"><div className="flex items-end justify-between gap-4"><div><p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${muted}`}>Workspace configuration</p><h1 className={`text-3xl font-semibold tracking-[-0.05em] ${heading}`}>Settings</h1></div><button disabled={saving} type="submit" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#9b5ce7] to-[#7f46d9] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(127,70,217,0.3)] disabled:opacity-60">{saved ? <Check size={16} /> : <SettingsIcon size={16} />}{saving ? "Saving..." : saved ? "Saved" : "Save changes"}</button></div>
		{error && <p className="text-sm text-[#ff7777]">{error}</p>}
		<section className={`rounded-[20px] border p-5 ${panel}`}><h2 className={`text-lg font-semibold ${heading}`}>General</h2><p className={`mt-1 text-sm ${muted}`}>Basic support desk information.</p><label className={`mt-5 block text-sm font-medium ${heading}`}>Support desk name<input required value={form.supportDeskName} onChange={(event) => updateField("supportDeskName", event.target.value)} className={`mt-1.5 w-full max-w-xl rounded-xl border px-3 py-2.5 outline-none focus:border-[#8d5fe5] ${control}`} /></label></section>
		<section className={`rounded-[20px] border p-5 ${panel}`}><h2 className={`text-lg font-semibold ${heading}`}>Ticket Settings</h2><p className={`mt-1 text-sm ${muted}`}>Choose the defaults for new tickets.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className={`text-sm font-medium ${heading}`}>Default ticket priority<select value={form.defaultTicketPriority} onChange={(event) => updateField("defaultTicketPriority", event.target.value)} className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 outline-none focus:border-[#8d5fe5] ${control}`}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></label><label className={`text-sm font-medium ${heading}`}>Default ticket status<select value={form.defaultTicketStatus} onChange={(event) => updateField("defaultTicketStatus", event.target.value)} className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 outline-none focus:border-[#8d5fe5] ${control}`}><option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select></label></div></section>
		<section className={`rounded-[20px] border p-5 ${panel}`}><h2 className={`text-lg font-semibold ${heading}`}>AI Settings</h2><p className={`mt-1 text-sm ${muted}`}>Control automatic ticket triage.</p><div className="mt-5 flex items-center justify-between gap-4"><div><p className={`text-sm font-medium ${heading}`}>Enable AI ticket triage</p><p className={`mt-1 text-xs ${muted}`}>Use AI to categorize and prioritize incoming tickets.</p></div><Toggle checked={form.aiTriageEnabled} onChange={(value) => updateField("aiTriageEnabled", value)} label="Enable AI ticket triage" /></div></section>
		<section className={`rounded-[20px] border p-5 ${panel}`}><h2 className={`text-lg font-semibold ${heading}`}>Notifications</h2><p className={`mt-1 text-sm ${muted}`}>Control ticket notification delivery.</p><div className="mt-5 flex items-center justify-between gap-4"><div><p className={`text-sm font-medium ${heading}`}>Enable ticket notifications</p><p className={`mt-1 text-xs ${muted}`}>Notify the support team when tickets need attention.</p></div><Toggle checked={form.ticketNotificationsEnabled} onChange={(value) => updateField("ticketNotificationsEnabled", value)} label="Enable ticket notifications" /></div></section>
	</form>;
};

export default Settings;
