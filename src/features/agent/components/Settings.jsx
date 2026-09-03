import { useState } from "react";
import { Bell, Check, Moon, Palette, Save, Sun, Volume2 } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext.jsx";

const Toggle = ({ checked, onChange, label, isDark }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-[#8d5fe5]" : isDark ? "bg-[#4a556d]" : "bg-[#b9b1c9]"}`}
  >
    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "left-6" : "left-1"}`} />
  </button>
);

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [notifications, setNotifications] = useState(() => localStorage.getItem("agent-notifications") !== "false");
  const [sound, setSound] = useState(() => localStorage.getItem("agent-sound") === "true");
  const [saved, setSaved] = useState(false);

  const panel = isDark ? "border-[#293449] bg-[#121c2d]" : "border-[#e8def4] bg-[#f8f3ff]";
  const inner = isDark ? "border-[#2b3548] bg-[#171f2d]" : "border-[#e7dff3] bg-[#efe8f8]";
  const heading = isDark ? "text-[#f8f0ff]" : "text-[#201d2c]";
  const muted = isDark ? "text-[#9fa9c5]" : "text-[#6c687d]";
  const control = isDark ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff]" : "border-[#e9ddf9] bg-[#f9f5ff] text-[#171827]";

  const savePreferences = () => {
    localStorage.setItem("agent-notifications", String(notifications));
    localStorage.setItem("agent-sound", String(sound));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <section className={`rounded-[22px] border p-5 shadow-[0_20px_45px_rgba(67,47,92,0.12)] sm:p-7 ${panel}`}>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${muted}`}>Workspace preferences</p>
          <h1 className={`text-3xl font-semibold tracking-tighter ${heading}`}>Settings</h1>
          <p className={`mt-1 text-sm ${muted}`}>Tune your workspace for a focused support shift.</p>
        </div>
        <button type="button" onClick={savePreferences} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8d5fe5] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(141,95,229,0.25)]">
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? "Saved" : "Save preferences"}
        </button>
      </div>

      <div className="space-y-5">
      

        <section className={`rounded-[20px] border p-5 ${inner}`}>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8d5fe51a] text-[#8d5fe5]"><Bell size={18} /></div>
            <div><h2 className={`text-lg font-semibold ${heading}`}>Notifications</h2><p className={`mt-1 text-sm ${muted}`}>Decide how new ticket activity reaches you.</p></div>
          </div>
          <div className="mt-5 space-y-4">
            {[["Ticket notifications", "Get notified when a ticket is assigned or updated.", notifications, setNotifications, Bell], ["Notification sounds", "Play a sound for urgent ticket activity.", sound, setSound, Volume2]].map(([label, description, checked, setter, Icon]) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3"><Icon size={17} className={`mt-0.5 ${muted}`} /><div><p className={`text-sm font-medium ${heading}`}>{label}</p><p className={`mt-1 text-xs ${muted}`}>{description}</p></div></div>
                <Toggle checked={checked} onChange={(value) => { setter(value); setSaved(false); }} label={label} isDark={isDark} />
              </div>
            ))}
          </div>
        </section>

        <section className={`rounded-[20px] border p-5 ${inner}`}>
          <h2 className={`text-lg font-semibold ${heading}`}>Work preferences</h2>
          <p className={`mt-1 text-sm ${muted}`}>Your current agent workspace configuration.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div><p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${muted}`}>Queue view</p><p className={`mt-2 text-sm font-semibold ${heading}`}>Assigned tickets</p></div>
            <div><p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${muted}`}>Default sort</p><p className={`mt-2 text-sm font-semibold ${heading}`}>Most recently updated</p></div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Settings
