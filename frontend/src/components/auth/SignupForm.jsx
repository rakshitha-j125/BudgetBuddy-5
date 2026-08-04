import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Wallet } from "lucide-react";

import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import PasswordStrength from "./PasswordStrength";

import { useAuth } from "../../context/AuthContext";

const SignupForm = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e) => {
    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    setLoading(true);

    const result = await signup({
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Later this will navigate to OTP verification
    navigate("/verify-otp", {
      state: {
        email: formData.email,
      },
    });
  };

  return (
    <div className="w-full max-w-lg rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur-xl">

      <div className="mb-8 flex flex-col items-center">

        <div className="mb-4 rounded-full bg-indigo-600 p-4 text-white">
          <Wallet size={34} />
        </div>

        <h1 className="text-3xl font-bold text-slate-800">
          Create Account
        </h1>

        <p className="mt-2 text-slate-500">
          Start managing your finances today.
        </p>

      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <AuthInput
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Enter your name"
          icon={User}
        />

        <AuthInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          icon={Mail}
        />

        <AuthInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create password"
          icon={Lock}
        />

        <PasswordStrength
          password={formData.password}
        />

        <div className="mt-5">
          <AuthInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            icon={Lock}
          />
        </div>

        <div className="mb-6 mt-2 flex items-start gap-2">

          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={() =>
              setAcceptTerms(!acceptTerms)
            }
            className="mt-1"
          />

          <span className="text-sm text-slate-600">
            I agree to the Terms &
            Conditions and Privacy Policy.
          </span>

        </div>

        <AuthButton loading={loading}>
          Create Account
        </AuthButton>

      </form>

      <div className="mt-8 text-center text-sm text-slate-600">

        Already have an account?{" "}

        <Link
          to="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Login
        </Link>

      </div>

    </div>
  );
};

export default SignupForm;