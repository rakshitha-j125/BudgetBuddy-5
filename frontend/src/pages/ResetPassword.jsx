import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

import api from "../api/axios";

import AuthButton from "../components/auth/AuthButton";
import AuthInput from "../components/auth/AuthInput";
import OTPInput from "../components/auth/OTPInput";
import PasswordStrength from "../components/auth/PasswordStrength";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/reset-password", {
        email: email.trim(),
        otp,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Reset failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="text-center text-3xl font-bold">
          Reset Password
        </h1>

        <p className="mt-2 text-center text-slate-500">
          {email}
        </p>

        <div className="mt-6">
          <OTPInput
            onComplete={(code) => setOtp(code)}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >
          <AuthInput
            label="New Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            icon={Lock}
          />

          <PasswordStrength
            password={password}
          />

          <AuthInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            icon={Lock}
          />

          {error && (
            <div className="my-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-600">
              {error}
            </div>
          )}

          <AuthButton loading={loading}>
            Reset Password
          </AuthButton>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;