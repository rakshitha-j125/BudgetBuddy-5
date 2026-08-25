import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

import api from "../api/axios";

import AuthButton from "../components/auth/AuthButton";
import AuthInput from "../components/auth/AuthInput";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setSuccess(
        "OTP has been sent to your email."
      );

      navigate("/reset-password", {
        state: {
          email: email.trim(),
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mb-5 flex items-center gap-2 text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>

        <h1 className="text-3xl font-bold text-slate-800">
          Forgot Password
        </h1>

        <p className="mt-3 text-slate-500">
          Enter your registered email address.
          We'll send you an OTP to reset your password.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8"
        >
          <AuthInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter email"
            icon={Mail}
          />

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-green-600">
              {success}
            </div>
          )}

          <AuthButton loading={loading}>
            Send OTP
          </AuthButton>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;