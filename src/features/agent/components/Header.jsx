import { Menu } from "lucide-react";
import Themetogglebutton from '../../../components/Themetogglebutton.jsx'
import { useAuth } from "../../auth/context/authContext.jsx";
import NotificationBell from "../../../components/NotificationBell.jsx";

const Header = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const displayName = user?.username || "User";
  const specialistLabels = {
    technical: "Technical Support Specialist",
    billing: "Billing Support Specialist",
    account: "Account Support Specialist",
    general: "General Support Specialist",
  };
  const specialistLabel = specialistLabels[user?.category] || "Support Specialist";

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#8d5fe5] bg-[#1b2434] text-[#f3edff] lg:hidden"
          >
            <Menu size={19} />
          </button>

            <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
              
              <Themetogglebutton />
              <NotificationBell />
              <div className="flex min-w-0 items-center gap-2 rounded-full border border-[#8d5fe5] bg-[#1b2434] px-2 py-1 pr-2 sm:gap-3 sm:pr-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[#d7c3ff] to-[#8d5fe5] text-sm font-bold text-[#1b1027]">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold text-[#f3edff] sm:text-sm">{displayName}</div>
                  <div className="truncate text-[9px] text-[#b8bdd8] sm:text-[10px]">{specialistLabel}</div>
                </div>
              </div>
            </div>
          </header>
  )
}

export default Header
