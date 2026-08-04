import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MailCheck, ArrowLeft } from "lucide-react";

import OTPInput from "../components/auth/OTPInput";
import AuthButton from "../components/auth/AuthButton";
import api from "../api/axios";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Backend endpoint (implement later)
      await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Invalid OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-6">

      <div className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-2xl">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex flex-col items-center">

          <div className="rounded-full bg-indigo-100 p-5">

            <MailCheck
              size={42}
              className="text-indigo-600"
            />

          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-800">
            Verify Email
          </h1>

          <p className="mt-3 text-center text-slate-500">

            We sent a verification code to

            <br />

            <span className="font-semibold text-indigo-600">
              {email || "your email"}
            </span>

          </p>

        </div>

        <div className="mt-8">

          <OTPInput
            onComplete={(code) => setOtp(code)}
          />

        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-3 text-center text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8">

          <AuthButton
            loading={loading}
            onClick={verifyOTP}
          >
            Verify Email
          </AuthButton>

        </div>

      </div>

    </div>
  );
};

export default VerifyOTP;