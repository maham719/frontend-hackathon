import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Themetogglebutton from "../../../components/Themetogglebutton";
import { useTheme } from "../../../context/ThemeContext.jsx";
import { useAuth } from "../services/authContext.jsx";

const Login = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        const result = await login(
            email,
            password
        );

        if (result.success) {

            console.log("Logged in");

            // Navigate to dashboard
            navigate("/dashboard");

        } else {

            console.log(result.message);

        }
    };

const handleAdminLogin = async (e) => {
  e.preventDefault();
    const result = await login(email, password);

    if (result.success) {
        if (result.user.role === "admin") {
            navigate("/dashboard");
        } else {
            console.log("This account is not an admin");
        }
    }
};
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
              ? "border-[#3c2d47] bg-[#2a1f37]   shadow-xl shadow-[#905ae6]/30"
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
              Nebula
            </span>
          </div>

          <div className="mb-5 text-center">
            <h1
              className={`text-[2rem] font-semibold tracking-[-0.05em] ${
                isDark ? "text-[#f3ecfe]" : "text-[#1f1f2e]"
              }`}
            >
              Welcome back
            </h1>
            <p
              className={`mt-2 text-base ${
                isDark ? "text-[#d8cfe7]" : "text-[#535166]"
              }`}
            >
              Log in to continue to your dashboard.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className={`mb-2 block text-base font-medium ${
                  isDark ? "text-[#f3ecfe]" : "text-[#2a1f35]"
                }`}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                }
                className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors ${
                  isDark
                    ? "border-[#4c3a5d] bg-[#2d2039] text-[#f2ebfa] placeholder:text-[#c7bdd9] focus:border-[#8d5fe5]"
                    : "border-[#ece1f8] bg-[#f7f2fb] text-[#1f1f2e] placeholder:text-[#7f7a8c] focus:border-[#a36ae8]"
                }`}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`mb-2 block text-base font-medium ${
                  isDark ? "text-[#f3ecfe]" : "text-[#2a1f35]"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 pr-11 text-base outline-none transition-colors ${
                    isDark
                      ? "border-[#4c3a5d] bg-[#2d2039] text-[#f2ebfa] placeholder:text-[#c7bdd9] focus:border-[#8d5fe5]"
                      : "border-[#ece1f8] bg-[#f7f2fb] text-[#1f1f2e] placeholder:text-[#7f7a8c] focus:border-[#a36ae8]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className={`absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1 transition-colors ${
                    isDark ? "text-[#d8cfe7] hover:text-white" : "text-[#4d455f] hover:text-[#1d1e2d]"
                  }`}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2 2l20 20" />
                      <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
                      <path d="M9.88 5.08A10.94 10.94 0 0 1 12 5c6.5 0 10 7 10 7a16.56 16.56 0 0 1-4.06 5.22" />
                      <path d="M6.61 6.61A16.84 16.84 0 0 0 2 12s3.5 7 10 7a11.14 11.14 0 0 0 5.39-1.61" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#9b5ce7] rounded border-[#d6c6ee]"
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-[#d9cfe9]" : "text-[#474155]"
                  }`}
                >
                  Remember me
                </span>
              </label>

              <button
                type="button"
                className={`text-sm font-medium ${
                  isDark ? "text-[#d9cfe9] hover:text-white" : "text-[#524e5e] hover:text-[#1d1e2d]"
                }`}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#9b5ce7] to-[#7f46d9] px-4 py-3 text-lg font-semibold text-white shadow-[0_12px_25px_rgba(127,70,217,0.35)] transition-transform hover:scale-[1.01]"
            >
              Log in
            </button>

            <button
              type="button"
              onClick={handleAdminLogin}
              className={`mt-2 w-full rounded-xl border px-4 py-3 text-lg font-medium ${
                isDark
                  ? "border-[#4c3a5d] bg-[#2a1f36] text-[#f3ebff] hover:bg-[#342540]"
                  : "border-[#e9def6] bg-[#f4eff8] text-[#1f1f2e] hover:bg-[#efe5fa]"
              }`}
            >
              Log in as admin
            </button>
          </form>

          <p
            className={`mt-5 text-center text-base ${
              isDark ? "text-[#dfd1ee]" : "text-[#403d4f]"
            }`}
          >
            No account? {" "}
            <Link to="/register" className="font-semibold text-[#7c4ad8]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
