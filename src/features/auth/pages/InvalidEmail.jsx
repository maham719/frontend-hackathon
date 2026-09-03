import { Link, useNavigate } from "react-router-dom";
import Themetogglebutton from "../../../components/Themetogglebutton";
import { useTheme } from "../../../context/ThemeContext.jsx";

const InvalidEmail = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        isDark ? "bg-[#1a1320] text-[#f2edf7]" : "bg-[#eee5f7] text-[#171827]"
      }`}
    >
      <div className="relative flex min-h-screen items-center justify-center px-4 py-9">
        <div className="absolute right-6 top-6">
          <Themetogglebutton />
        </div>

        <main
          className={`w-full max-w-[440px] rounded-[28px] border px-10 py-7 shadow-[0_20px_45px_rgba(67,47,92,0.14)] backdrop-blur-sm ${
            isDark
              ? "border-[#3c2d47] bg-[#2a1f37] shadow-xl shadow-[#905ae6]/30"
              : "border-[#e9def7] bg-[#f3eef8]"
          }`}
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg ${
                isDark ? "bg-[#8d5fe5]" : "bg-[#905ae6]"
              }`}
            >
              ✦
            </div>
            <span
              className={`text-3xl font-semibold tracking-[-0.04em] ${
                isDark ? "text-[#f3ebff]" : "text-[#1d1e2d]"
              }`}
            >
              Nebula
            </span>
          </div>

          <div
            className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${
              isDark ? "bg-[#3a294f] text-[#dcbfff]" : "bg-[#efe4ff] text-[#7c4ad8]"
            }`}
            aria-hidden="true"
          >
            !
          </div>

          <div className="text-center">
            <h1
              className={`text-[2rem] font-semibold tracking-[-0.05em] ${
                isDark ? "text-[#f3ecfe]" : "text-[#1f1f2e]"
              }`}
            >
              Invalid email address
            </h1>
            <p
              className={`mt-3 text-base ${
                isDark ? "text-[#d8cfe7]" : "text-[#535166]"
              }`}
            >
              Please enter a valid email address to continue with verification.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#9b5ce7] to-[#7f46d9] px-4 py-3 text-lg font-semibold text-white shadow-[0_12px_25px_rgba(127,70,217,0.35)] transition-transform hover:scale-[1.01]"
          >
            Try again
          </button>

          <p
            className={`mt-5 text-center text-base ${
              isDark ? "text-[#dfd1ee]" : "text-[#403d4f]"
            }`}
          >
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-[#7c4ad8]">
              Login
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
};

export default InvalidEmail;
