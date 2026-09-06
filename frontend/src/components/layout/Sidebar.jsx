import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Building2,
  PiggyBank,
  Target,
  BarChart3,
  FileText,
  UserCircle,
  Settings,
  LogOut,
  Crown,
  Users,
  ScrollText,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Expenses",
    path: "/expenses",
    icon: Receipt,
  },
  {
    name: "Income",
    path: "/income",
    icon: Wallet,
  },
  {
    name: "Bank Accounts",
    path: "/bank-accounts",
    icon: Building2,
  },
  {
    name: "Budgets",
    path: "/budgets",
    icon: PiggyBank,
  },
  {
    name: "Savings Goals",
    path: "/savings-goals",
    icon: Target,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: FileText,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: UserCircle,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const adminNavigation = [
  {
    name: "Premium Requests",
    path: "/admin/premium-requests",
    icon: Crown,
  },
  {
    name: "System Analytics",
    path: "/admin/system-analytics",
    icon: BarChart3,
  },
  {
    name: "User Management",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "System Logs",
    path: "/admin/system-logs",
    icon: ScrollText,
  },
];

export default function Sidebar() {
  const { logout, user } = useAuth();

  const isAdmin = user?.role === "admin";

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

      {/* LOGO */}

      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Budget<span className="text-blue-600">Buddy</span>
          </h1>

          <p className="text-xs text-slate-500">
            Personal Finance Manager
          </p>
        </div>
      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">

        {/* NORMAL NAVIGATION */}

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Icon size={19} />
              {item.name}
            </NavLink>
          );
        })}

        {/* ADMIN SECTION */}

        {isAdmin && (
          <div className="mt-6 pt-5 border-t border-slate-200">

            <p className="px-4 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Admin
            </p>

            <div className="space-y-2">

              {adminNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`
                    }
                  >
                    <Icon size={19} />
                    {item.name}
                  </NavLink>
                );
              })}

            </div>
          </div>
        )}

      </nav>

      {/* LOGOUT */}

      <div className="border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>

    </aside>
  );
}