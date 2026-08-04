import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Lock } from "lucide-react";

import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import PasswordStrength from "../components/auth/PasswordStrength";
import OTPInput from "../components/auth/OTPInput";
import api from "../api/axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        email,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">

      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

        <h1 className="text-3xl font-bold text-center">
          Reset Password
        </h1>

        <p className="text-center mt-2 text-slate-500">
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
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            icon={Lock}
          />

          {error && (
            <div className="my-4 rounded-xl bg-red-50 p-3 text-red-600">
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