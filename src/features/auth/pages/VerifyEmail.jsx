import { useState,useEffect } from "react";
import Themetogglebutton from "../../../components/Themetogglebutton";
import { useTheme } from "../../../context/ThemeContext.jsx";
import { useAuth } from "../context/authContext.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { verifyEmail ,resendOTP} = useAuth();
    const location = useLocation();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
const [cooldown, setCooldown] = useState(0);


    // Get email passed from Register page
    const email = location.state?.email;

    //cooldown timer for resend OTP
    useEffect(() => {

    if (cooldown <= 0) return;

    const timer = setInterval(() => {
        setCooldown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

}, [cooldown]);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    if (!email.trim() || !otp.trim()) {
      console.log("Please enter your email and OTP.");
      return;
    }

    setIsSubmitting(true);

    const result = await verifyEmail(email.trim(), otp.trim());

    setIsSubmitting(false);
   navigate("/login")
   if (!result.success) {
    if (result.message?.toLowerCase().includes("invalid email")) {
        navigate("/invalid-email");
        return;
    }

    setError(result.message);
    return;
}
  };

  const handleResendOTP = async () => {


    if (cooldown > 0) return;

    const result = await resendOTP(email);

    if (result.success) {
        setCooldown(60);
        setError("");
    } else {
        setError(result.message);
    }
}; 
  // If user opens /verify-email directly
  if (!email) {
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

          <div
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
                Supportflow AI
              </span>
            </div>

            <div
              className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${
                isDark ? "bg-[#3a294f] text-[#dcbfff]" : "bg-[#efe4ff] text-[#7c4ad8]"
              }`}
            >
              !
            </div>

            <div className="text-center">
              <h1
                className={`text-[2rem] font-semibold tracking-[-0.05em] ${
                  isDark ? "text-[#f3ecfe]" : "text-[#1f1f2e]"
                }`}
              >
                No email found
              </h1>
              <p
                className={`mt-3 text-base ${
                  isDark ? "text-[#d8cfe7]" : "text-[#535166]"
                }`}
              >
                Please register again to receive a new verification code.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#9b5ce7] to-[#7f46d9] px-4 py-3 text-lg font-semibold text-white shadow-[0_12px_25px_rgba(127,70,217,0.35)] transition-transform hover:scale-[1.01]"
            >
              Go to Register
            </button>
          </div>
        </div>
      </div>
    );
  }
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

        <div
          className={`w-full max-w-[440px] rounded-[28px] border px-10 py-5 shadow-[0_20px_45px_rgba(67,47,92,0.14)] backdrop-blur-sm ${
            isDark
              ? "border-[#3c2d47] bg-[#2a1f37] shadow-xl shadow-[#905ae6]/30"
              : "border-[#e9def7] bg-[#f3eef8]"
          }`}
        >
          <div className="mb-4 flex items-center justify-center gap-3">
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
             Supportflow AI
            </span>
          </div>

          <div className="mb-5 text-center">
            <h1
              className={`text-[2rem] font-semibold tracking-[-0.05em] ${
                isDark ? "text-[#f3ecfe]" : "text-[#1f1f2e]"
              }`}
            >
              Verify your email
            </h1>
            <p
              className={`mt-2 text-base ${
                isDark ? "text-[#d8cfe7]" : "text-[#535166]"
              }`}
            >
              Enter the 6-digit code sent to your email address.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleVerifyEmail}>
    

            <div>
              <label
                htmlFor="otp"
                className={`mb-2 block text-base font-medium ${
                  isDark ? "text-[#f3ecfe]" : "text-[#2a1f35]"
                }`}
              >
                OTP code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors placeholder:text-[#7f7a8c] ${
                  isDark
                    ? "border-[#4c3a5d] bg-[#2d2039] text-[#f2ebfa] placeholder:text-[#c7bdd9] focus:border-[#8d5fe5]"
                    : "border-[#ece1f8] bg-[#f7f2fb] text-[#1f1f2e] focus:border-[#a36ae8]"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#9b5ce7] to-[#7f46d9] px-4 py-3 text-lg font-semibold text-white shadow-[0_12px_25px_rgba(127,70,217,0.35)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Verifying..." : "Verify email"}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
            disabled={cooldown > 0}
              className={`w-full rounded-xl border px-4 py-3 text-lg font-medium ${
                isDark
                  ? "border-[#4c3a5d] bg-[#2a1f36] text-[#f3ebff] hover:bg-[#342540]"
                  : "border-[#e9def6] bg-[#f4eff8] text-[#1f1f2e] hover:bg-[#efe5fa]"
              }`}
            >
              {cooldown > 0
        ? `Resend OTP in ${cooldown}s`
        : "Resend OTP"
    }
            </button>
          </form>

          <p
            className={`mt-5 text-center text-base ${
              isDark ? "text-[#dfd1ee]" : "text-[#403d4f]"
            }`}
          >
            Back to {" "}
            <Link to="/login" className="font-semibold text-[#7c4ad8]">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
