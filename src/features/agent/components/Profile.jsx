import { BriefcaseBusiness, CalendarDays, CheckCircle2, Mail, ShieldCheck, UserCircle2 } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext.jsx";
import { useAuth } from "../../auth/context/authContext.jsx";

const formatDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const Profile = () => {
  const { theme } = useTheme();
  const { user, restoringSession } = useAuth();
  const isDark = theme === "dark";

  const panel = isDark ? "border-[#293449] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]";
  const inner = isDark ? "border-[#2b3548] bg-[#171f2d]" : "border-[#e7dff3] bg-[#efe8f8]";
  const heading = isDark ? "text-[#f8f0ff]" : "text-[#201d2c]";
  const muted = isDark ? "text-[#9fa9c5]" : "text-[#6c687d]";
  const value = isDark ? "text-[#e7ebff]" : "text-[#363247]";
  const name = user?.username || "Agent";
  const initials = name.slice(0, 2).toUpperCase();

  if (restoringSession) {
    return <section className={`flex min-h-90 items-center justify-center rounded-[22px] border text-sm ${panel} ${muted}`}>Loading profile...</section>;
  }

  return (
    <section className={`rounded-[22px] border p-5 shadow-[0_20px_45px_rgba(67,47,92,0.12)] sm:p-7 ${panel}`}>
      <div className="mb-7">
        <p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${muted}`}>Agent account</p>
        <h1 className={`text-3xl font-semibold tracking-tighter ${heading}`}>Profile</h1>
        <p className={`mt-1 text-sm ${muted}`}>Your support identity and account information.</p>
      </div>

      <div className={`mb-6 flex flex-col gap-5 rounded-[18px] border p-5 sm:flex-row sm:items-center sm:justify-between ${inner}`}>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#d7c3ff] to-[#8d5fe5] text-lg font-bold text-[#241332] shadow-[0_12px_24px_rgba(141,95,229,0.25)]">
            {initials || <UserCircle2 size={30} />}
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${heading}`}>{name}</h2>
            <p className={`mt-1 text-sm ${muted}`}>{user?.email || "Email not available"}</p>
          </div>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#53c7871a] px-3 py-1.5 text-xs font-semibold text-[#4ecb91]">
          <CheckCircle2 size={14} /> Active
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Email address", user?.email || "Not available", Mail],
          ["Role", user?.role || "Agent", ShieldCheck],
          ["Department", user?.department || "Support Operations", BriefcaseBusiness],
          ["Member since", formatDate(user?.createdAt), CalendarDays],
        ].map(([label, text, Icon]) => (
          <div key={label} className={`rounded-[18px] border p-4 ${inner}`}>
            <div className={`mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] ${muted}`}>
              <Icon size={15} className="text-[#8d5fe5]" />
              {label}
            </div>
            <p className={`text-sm font-semibold capitalize ${value}`}>{text}</p>
          </div>
        ))}
      </div>

      <div className={`mt-6 flex items-start gap-3 rounded-[18px] border p-4 ${inner}`}>
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#8d5fe5]" />
        <div>
          <p className={`text-sm font-semibold ${heading}`}>Support access</p>
          <p className={`mt-1 text-sm leading-6 ${muted}`}>Your account is managed by the SupportFlow administrator. Contact an administrator when your account details need to change.</p>
        </div>
      </div>
    </section>
  );
};

export default Profile
