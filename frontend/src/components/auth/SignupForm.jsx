import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requirements = useMemo(
    () => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password]
  );

  const strengthScore = Object.values(requirements).filter(Boolean).length;

  const strength =
    strengthScore <= 1
      ? {
          label: "Weak",
          width: "25%",
        }
      : strengthScore === 2
        ? {
            label: "Medium",
            width: "50%",
          }
        : strengthScore === 3
          ? {
              label: "Good",
              width: "75%",
            }
          : {
              label: "Strong",
              width: "100%",
            };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await signup(
        email.trim(),
        password,
        fullName.trim()
      );

      // Signup successful → go to login
      navigate("/login", {
        state: {
          message: "Account created successfully. Please sign in.",
        },
      });
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const Requirement = ({ valid, children }) => (
    <div className="flex items-center gap-2">
      {valid ? (
        <Check size={17} className="text-emerald-500" />
      ) : (
        <X size={17} className="text-slate-300" />
      )}

      <span
        className={
          valid
            ? "text-sm text-emerald-600"
            : "text-sm text-slate-500"
        }
      >
        {children}
      </span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* FULL NAME */}
      <div>
        <label
          htmlFor="fullName"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Full Name
        </label>

        <div className="relative">
          <User
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>

      {/* EMAIL */}
      <div>
        <label
          htmlFor="signupEmail"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Email
        </label>

        <div className="relative">
          <Mail
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="signupEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>

      {/* PASSWORD */}
      <div>
        <label
          htmlFor="signupPassword"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Password
        </label>

        <div className="relative">
          <Lock
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="signupPassword"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            {showPassword ? (
              <EyeOff size={19} />
            ) : (
              <Eye size={19} />
            )}
          </button>
        </div>
      </div>

      {/* PASSWORD STRENGTH */}
      {password.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-800">
              Password Strength
            </h3>

            <span className="text-sm font-bold text-blue-600">
              {strength.label}
            </span>
          </div>

          <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: strength.width }}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Requirement valid={requirements.length}>
              Minimum 8 characters
            </Requirement>

            <Requirement valid={requirements.uppercase}>
              One uppercase letter
            </Requirement>

            <Requirement valid={requirements.number}>
              One number
            </Requirement>

            <Requirement valid={requirements.special}>
              One special character
            </Requirement>
          </div>

        </div>
      )}

      {/* CONFIRM PASSWORD */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Confirm Password
        </label>

        <div className="relative">
          <Lock
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword((value) => !value)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            {showConfirmPassword ? (
              <EyeOff size={19} />
            ) : (
              <Eye size={19} />
            )}
          </button>
        </div>
      </div>

      {/* TERMS */}
      <div className="flex items-start gap-3">
        <input
          id="terms"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />

        <label
          htmlFor="terms"
          className="text-sm leading-6 text-slate-500"
        >
          I agree to the{" "}
          <span className="font-medium text-blue-600">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="font-medium text-blue-600">
            Privacy Policy
          </span>
          .
        </label>
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>

      {/* LOGIN */}
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Sign in
        </Link>
      </p>

    </form>
  );
}