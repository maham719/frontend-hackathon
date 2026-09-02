import { useEffect, useState } from "react";
import { AlertCircle, Check, Clock3, UserCircle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../features/auth/services/authContext.jsx";
import { updateProfileService } from "../../features/auth/services/auth.api.js";

const Profile = () => {
	const { theme } = useTheme();
	const { user, restoringSession, updateUserProfile } = useAuth();
	const isDark = theme === "dark";
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const panel = isDark ? "border-[#293449] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]";
	const heading = isDark ? "text-[#f8f0ff]" : "text-[#201d2c]";
	const muted = isDark ? "text-[#9fa9c5]" : "text-[#6c687d]";
	const control = isDark ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff]" : "border-[#e9ddf9] bg-[#f9f5ff] text-[#171827]";

	useEffect(() => {
		if (!restoringSession) {
			setName(user?.username || "");
			setLoading(false);
		}
	}, [restoringSession, user?.username]);

	const cancelChanges = () => {
		setName(user?.username || "");
		setPassword("");
		setMessage("");
		setError("");
	};

	const saveProfile = async (event) => {
		event.preventDefault();
		try {
			setSaving(true);
			setMessage("");
			setError("");
			const updatedUser = await updateProfileService({ username: name, ...(password ? { password } : {}) });
			updateUserProfile(updatedUser);
			setPassword("");
			setMessage("Profile saved successfully.");
		} catch (saveError) {
			setError(saveError.response?.data?.message || "Unable to save profile right now.");
		} finally {
			setSaving(false);
		}
	};

	if (user && user.role !== "admin") return <section className={`rounded-[22px] border p-8 ${panel}`}><p className="text-[#ff7777]">Admin access required.</p></section>;
	if (loading) return <section className={`flex items-center justify-center gap-3 rounded-[22px] border p-16 text-sm ${panel} ${muted}`}><Clock3 size={18} /> Loading profile...</section>;

	return <form onSubmit={saveProfile} className={`rounded-[22px] border p-5 shadow-[0_20px_45px_rgba(67,47,92,0.12)] sm:p-7 ${panel}`}>
		<div className="mb-6"><p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${muted}`}>Account details</p><h1 className={`text-3xl font-semibold tracking-[-0.05em] ${heading}`}>Profile</h1></div>
		<div className={`mb-6 rounded-[18px] border p-5 ${isDark ? "border-[#2b3548] bg-[#171f2d]" : "border-[#e7dff3] bg-[#efe8f8]"}`}><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#d7c3ff] to-[#8d5fe5] text-[#241332]"><UserCircle size={30} /></div><div><p className={`text-lg font-semibold ${heading}`}>{user?.username || "Admin"}</p><p className={`text-sm ${muted}`}>{user?.email || "—"}</p></div></div><div className={`mt-5 text-sm ${muted}`}>Role: <span className={`font-semibold ${heading}`}>{user?.role || "admin"}</span></div></div>
		<div className="max-w-xl space-y-5"><label className={`block text-sm font-medium ${heading}`}>Admin name<input required value={name} onChange={(event) => { setName(event.target.value); setMessage(""); }} className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 outline-none focus:border-[#8d5fe5] ${control}`} /></label><label className={`block text-sm font-medium ${heading}`}>Email<input readOnly value={user?.email || ""} className={`mt-1.5 w-full cursor-not-allowed rounded-xl border px-3 py-2.5 opacity-70 ${control}`} /></label><label className={`block text-sm font-medium ${heading}`}>Role<input readOnly value={user?.role || "admin"} className={`mt-1.5 w-full cursor-not-allowed rounded-xl border px-3 py-2.5 capitalize opacity-70 ${control}`} /></label><label className={`block text-sm font-medium ${heading}`}>New password<span className={`ml-2 text-xs font-normal ${muted}`}>(leave blank to keep current)</span><input type="password" minLength={6} value={password} onChange={(event) => { setPassword(event.target.value); setMessage(""); }} placeholder="Enter a new password" className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 outline-none focus:border-[#8d5fe5] ${control}`} /></label></div>
		{message && <p className="mt-5 flex items-center gap-2 text-sm text-[#4ecb91]"><Check size={16} /> {message}</p>}{error && <p className="mt-5 flex items-center gap-2 text-sm text-[#ff7777]"><AlertCircle size={16} /> {error}</p>}<div className="mt-6 flex gap-3"><button type="submit" disabled={saving} className="rounded-xl bg-gradient-to-r from-[#9b5ce7] to-[#7f46d9] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(127,70,217,0.3)] disabled:opacity-60">{saving ? "Saving..." : "Save"}</button><button type="button" onClick={cancelChanges} className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${control}`}>Cancel</button></div>
	</form>;
};

export default Profile;
