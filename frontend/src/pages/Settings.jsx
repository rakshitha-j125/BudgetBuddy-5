import { useEffect, useState } from "react";
import {
  UserCircle,
  Palette,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [currency, setCurrency] = useState("INR");
  const [theme, setTheme] = useState(
    localStorage.getItem("budgetbuddy_theme") || "light"
  );

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/profile/me");

        setCurrency(response.data.currency || "INR");
      } catch (error) {
        console.error("Unable to load settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleThemeChange = (value) => {
    setTheme(value);

    localStorage.setItem(
      "budgetbuddy_theme",
      value
    );

    setMessage("Theme preference saved.");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <Topbar />

        <main className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Settings
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your application preferences and account settings.
            </p>
          </div>

          {message && (
            <div className="mb-6 max-w-4xl rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              {message}
            </div>
          )}

          <div className="max-w-4xl space-y-6">
            {/* ACCOUNT */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <UserCircle className="text-blue-600" size={24} />

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Account Settings
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage your BudgetBuddy account.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-4 text-left transition hover:bg-blue-50"
                >
                  <div className="flex items-center gap-4">
                    <UserCircle
                      size={22}
                      className="text-slate-500"
                    />

                    <div>
                      <p className="font-semibold text-slate-800">
                        Profile
                      </p>

                      <p className="text-sm text-slate-500">
                        View and edit your personal information
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    size={20}
                    className="text-slate-400"
                  />
                </button>
              </div>
            </div>

            {/* APPLICATION PREFERENCES */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Palette
                  className="text-purple-600"
                  size={24}
                />

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Application Preferences
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Customize how BudgetBuddy works for you.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {/* Currency */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div>
                    <p className="font-semibold text-slate-800">
                      Currency
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Default currency used throughout the application
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                    {loading
                      ? "Loading..."
                      : currency === "INR"
                      ? "₹ INR"
                      : currency}
                  </div>
                </div>

                {/* Theme */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">
                      Theme
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Choose your application appearance
                    </p>
                  </div>

                  <select
                    value={theme}
                    onChange={(e) =>
                      handleThemeChange(e.target.value)
                    }
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="light">
                      Light
                    </option>

                    <option value="dark">
                      Dark
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECURITY */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  className="text-green-600"
                  size={24}
                />

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Security
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Keep your BudgetBuddy account secure.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-green-50 p-4">
                <p className="font-semibold text-green-800">
                  Authentication
                </p>

                <p className="mt-1 text-sm text-green-700">
                  Your account is protected using secure authentication.
                </p>
              </div>
            </div>

            {/* LOGOUT */}
            <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Account Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sign out from your BudgetBuddy account.
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-6 flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;