import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Wallet } from "lucide-react";

import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const result = await login(
      formData.email,
      formData.password
    );

    if (!result.success) {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-xl p-8 shadow-2xl">

      {/* Logo */}

      <div className="mb-8 flex flex-col items-center">

        <div className="mb-4 rounded-full bg-indigo-600 p-4 text-white">

          <Wallet size={34} />

        </div>

        <h1 className="text-3xl font-bold text-slate-800">
          BudgetBuddy
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome back! Sign in to continue.
        </p>

      </div>

      {/* Error */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <AuthInput
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
        />

        <AuthInput
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          icon={Lock}
        />

        {/* Remember Me */}

        <div className="mb-6 flex items-center justify-between">

          <label className="flex items-center gap-2 text-sm text-slate-600">

            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() =>
                setRememberMe(!rememberMe)
              }
              className="rounded"
            />

            Remember Me

          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Forgot Password?
          </Link>

        </div>

        <AuthButton loading={loading}>
          Login
        </AuthButton>

      </form>

      {/* Footer */}

      <div className="mt-8 text-center text-sm text-slate-600">

        Don't have an account?{" "}

        <Link
          to="/signup"
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Create Account
        </Link>

      </div>

    </div>
  );
};

export default LoginForm;