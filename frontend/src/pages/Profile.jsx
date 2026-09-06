import { useEffect, useState } from "react";
import {
  Save,
  UserCircle,
  Crown,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Profile = () => {
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState(null);

  const [fullName, setFullName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [financialGoal, setFinancialGoal] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Premium request state
  const [premiumRequest, setPremiumRequest] = useState(null);
  const [premiumLoading, setPremiumLoading] = useState(true);
  const [requestingPremium, setRequestingPremium] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/profile/me");

        const data = response.data;

        setProfile(data);
        setFullName(data.full_name || "");
        setMonthlyIncome(data.monthly_income ?? "");
        setCurrency(data.currency || "INR");
        setFinancialGoal(data.financial_goal || "");
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Load Premium request status
  useEffect(() => {
    const loadPremiumRequest = async () => {
      try {
        const response = await api.get("/premium-requests/my");
        setPremiumRequest(response.data);
      } catch (err) {
        console.error("Unable to load premium request:", err);
      } finally {
        setPremiumLoading(false);
      }
    };

    if (user) {
      loadPremiumRequest();
    }
  }, [user]);

  const handlePremiumRequest = async () => {
    setRequestingPremium(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post("/premium-requests/");

      setPremiumRequest(response.data);
      setMessage("Premium request submitted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to submit Premium request."
      );
    } finally {
      setRequestingPremium(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await api.put("/profile/update", {
        full_name: fullName.trim(),
        monthly_income:
          monthlyIncome === ""
            ? 0
            : Number(monthlyIncome),
        currency,
        financial_goal:
          financialGoal.trim() || null,
      });

      const data = response.data;

      setProfile(data);
      setFullName(data.full_name || "");
      setMonthlyIncome(data.monthly_income ?? "");
      setCurrency(data.currency || "INR");
      setFinancialGoal(data.financial_goal || "");

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const avatarName =
    fullName ||
    user?.email ||
    "User";

  const isStudent = user?.role === "student";
  const isPremium =
    user?.role === "premium" ||
    user?.role === "admin";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <Topbar />

        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              My Profile
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your BudgetBuddy profile and financial preferences.
            </p>
          </div>

          {loading ? (
            <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-slate-500">
                Loading profile...
              </p>
            </div>
          ) : (
            <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-5 border-b border-slate-100 pb-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
                  {avatarName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {fullName || "BudgetBuddy User"}
                  </h2>

                  <p className="mt-1 text-slate-500">
                    {user?.email || "Email not available"}
                  </p>

                  <p className="mt-2 text-sm font-semibold capitalize text-indigo-600">
                    {user?.role || "student"} account
                  </p>
                </div>
              </div>

              {/* PREMIUM SECTION */}
              {!premiumLoading && (
                <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                      <Crown size={24} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900">
                        Premium Access
                      </h3>

                      {isPremium ? (
                        <div className="mt-3 flex items-center gap-2 text-green-700">
                          <CheckCircle size={20} />
                          <span className="font-semibold">
                            You have Premium access.
                          </span>
                        </div>
                      ) : isStudent &&
                        premiumRequest?.status === "pending" ? (
                        <div className="mt-3 flex items-center gap-2 text-amber-700">
                          <Clock size={20} />
                          <span className="font-semibold">
                            Premium request is pending admin approval.
                          </span>
                        </div>
                      ) : isStudent &&
                        premiumRequest?.status === "rejected" ? (
                        <>
                          <div className="mt-3 flex items-center gap-2 text-red-700">
                            <XCircle size={20} />
                            <span className="font-semibold">
                              Your Premium request was rejected.
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={handlePremiumRequest}
                            disabled={requestingPremium}
                            className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Crown size={18} />
                            {requestingPremium
                              ? "Requesting..."
                              : "Request Premium Again"}
                          </button>
                        </>
                      ) : isStudent ? (
                        <>
                          <p className="mt-2 text-sm text-slate-600">
                            Request Premium access to unlock advanced
                            analytics and other Premium features.
                          </p>

                          <button
                            type="button"
                            onClick={handlePremiumRequest}
                            disabled={requestingPremium}
                            className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Crown size={18} />

                            {requestingPremium
                              ? "Requesting..."
                              : "Request Premium"}
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}

              {message && (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
                  {message}
                </div>
              )}

              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
              >
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Email
                  </label>

                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Monthly Income
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={monthlyIncome}
                    onChange={(e) =>
                      setMonthlyIncome(e.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Enter monthly income"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Currency
                  </label>

                  <select
                    value={currency}
                    onChange={(e) =>
                      setCurrency(e.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="INR">
                      INR - Indian Rupee
                    </option>
                    <option value="USD">
                      USD - US Dollar
                    </option>
                    <option value="EUR">
                      EUR - Euro
                    </option>
                    <option value="GBP">
                      GBP - British Pound
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Financial Goal
                  </label>

                  <input
                    type="text"
                    value={financialGoal}
                    onChange={(e) =>
                      setFinancialGoal(e.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Example: Save for higher studies"
                  />
                </div>

                <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={18} />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              </form>

              {profile && (
                <div className="mt-8 flex items-center gap-2 text-sm text-slate-400">
                  <UserCircle size={16} />
                  Account ID: {profile.user_id}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;