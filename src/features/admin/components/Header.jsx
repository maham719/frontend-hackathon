
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
  Plus,
  Search,
  Settings,
  Sparkles,
  Ticket,
  Users,
  X,
} from "lucide-react";
import Themetogglebutton from "../../../components/Themetogglebutton.jsx";
import { useTheme } from "../../../context/ThemeContext.jsx";
import {useAuth} from "../../auth/context/authContext.jsx"
const Header = ({ onOpenMenu }) => {
    const {user}=useAuth()
    const { theme } = useTheme();
      const isDark = theme === "dark";
      const panel = isDark
        ? "border-[#293449] bg-[#121c2d]"
        : "border-[#e8def4] bg-[#f8f3ff]";
      const muted = isDark ? "text-[#9fa9c5]" : "text-[#6c687d]";
      const heading = isDark ? "text-[#f8f0ff]" : "text-[#201d2c]";
  return (
      <header className="mb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                aria-label="Open navigation"
                onClick={onOpenMenu}
                className={`rounded-xl p-2 lg:hidden ${isDark ? "bg-[#1b2434]" : "bg-[#f8f3ff]"}`}
              >
                <Menu size={20} />
              </button>
              <div>
                <div
                  className={`text-xs font-semibold uppercase tracking-[0.16em] ${muted}`}
                >
                  Sunday, August 30, 2026
                </div>
                <h1
                  className={`mt-1 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl ${heading}`}
                >
                  Support Overview
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
             
              <div className="hidden items-center gap-2 sm:flex">
                
                <Themetogglebutton />
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8d5fe5] bg-gradient-to-br from-[#d7c3ff] to-[#8d5fe5] text-sm font-bold text-[#1b1027]">
                {" "}
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </header>
  )
}

export default Header
