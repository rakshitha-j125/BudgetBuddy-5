import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  PieChart,
  FileText,
  User,
  Settings,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Income",
    icon: ArrowDownCircle,
    path: "/income",
  },
  {
    title: "Expenses",
    icon: ArrowUpCircle,
    path: "/expenses",
  },
  {
    title: "Budget",
    icon: Wallet,
    path: "/budget",
  },
  {
    title: "Analytics",
    icon: PieChart,
    path: "/analytics",
  },
  {
    title: "Reports",
    icon: FileText,
    path: "/reports",
  },
  {
    title: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex lg:flex-col w-72 bg-slate-900 text-white">

      {/* Logo */}
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-3xl font-bold">
          BudgetBuddy
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Personal Finance
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">

        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `mb-2 flex items-center gap-3 rounded-xl p-4 transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={22} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}

      </nav>

    </aside>
  );
};

export default Sidebar;