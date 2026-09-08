import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Budget from "./pages/Budget";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SavingsGoals from "./pages/SavingsGoals";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import BankAccounts from "./pages/BankAccounts";

// Admin Pages
import AdminPremiumRequests from "./pages/AdminPremiumRequests";
import AdminSystemAnalytics from "./pages/AdminSystemAnalytics";
import AdminUsers from "./pages/AdminUsers";
import AdminSystemLogs from "./pages/AdminSystemLogs";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* =========================
            USER ROUTES
        ========================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/expenses"
          element={<Expenses />}
        />

        <Route
          path="/income"
          element={<Income />}
        />

        <Route
          path="/budget"
          element={<Budget />}
        />

        <Route
          path="/budgets"
          element={<Budget />}
        />

        <Route
          path="/savings-goals"
          element={<SavingsGoals />}
        />

        <Route
          path="/bank-accounts"
          element={<BankAccounts />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        {/* =========================
            ADMIN ROUTES
        ========================= */}

        <Route
          path="/admin/premium-requests"
          element={<AdminPremiumRequests />}
        />

        <Route
          path="/admin/system-analytics"
          element={<AdminSystemAnalytics />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        <Route
          path="/admin/system-logs"
          element={<AdminSystemLogs />}
        />

        {/* =========================
            FALLBACK
        ========================= */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;