import React from "react";
import { LoaderCircle, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

const Loading = ({ text = "Loading your workspace..." }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`flex min-h-screen items-center justify-center overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#0b0f18] text-[#edf5ff]" : "bg-[#f4f0fb] text-[#171827]"
      }`}
    >
      <div className="relative flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div
          className={`absolute inset-0 -z-10 blur-3xl ${
            isDark ? "bg-[#7b5af7]/20" : "bg-[#9f88ff]/25"
          }`}
        />

        <div
          className={`relative flex h-24 w-24 items-center justify-center rounded-full border shadow-[0_0_40px_rgba(124,92,255,0.18)] ${
            isDark
              ? "border-[#2a3550] bg-[#101827]/80 shadow-[0_0_35px_rgba(124,92,255,0.25)]"
              : "border-[#e8def5] bg-[rgba(255,255,255,0.7)] shadow-[0_0_35px_rgba(124,92,255,0.18)]"
          }`}
        >
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#7aa8ff]/20 via-[#9b5ce7]/15 to-transparent" />
          <LoaderCircle className="h-10 w-10 animate-spin text-[#7aa8ff]" />
          <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-[#9b5ce7]" />
        </div>

        <div className="space-y-3">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${
              isDark
                ? "border-[#2a3550] bg-[#121b2e]/80 text-[#b8c4f0]"
                : "border-[#e8def5] bg-[#f8f2ff]/80 text-[#59566e]"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#7aa8ff] to-[#9b5ce7] shadow-[0_0_12px_rgba(125,112,255,0.9)]" />
            SupportFlow AI
          </div>

          <p className={`text-xl font-semibold ${isDark ? "text-[#edf5ff]" : "text-[#171827]"}`}>
            {text}
          </p>

          <div className="flex items-center justify-center gap-2 pt-1">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className={`h-2.5 w-2.5 rounded-full animate-pulse ${
                  isDark ? "bg-[#7aa8ff]" : "bg-[#7c5cff]"
                }`}
                style={{ animationDelay: `${dot * 180}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
