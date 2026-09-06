import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  Crown,
  ShieldCheck,
  UserCheck,
  UserX,
  IndianRupee,
  Receipt,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import api from "../api/axios";

const AdminSystemAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await api.get(
          "/admin/system-analytics"
        );

        setData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load system analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const cards = data
    ? [
        {
          title: "Total Users",
          value: data.total_users,
          icon: Users,
        },
        {
          title: "Students",
          value: data.student_users,
          icon: GraduationCap,
        },
        {
          title: "Premium Users",
          value: data.premium_users,
          icon: Crown,
        },
        {
          title: "Admins",
          value: data.admin_users,
          icon: ShieldCheck,
        },
        {
          title: "Active Users",
          value: data.active_users,
          icon: UserCheck,
        },
        {
          title: "Inactive Users",
          value: data.inactive_users,
          icon: UserX,
        },
        {
          title: "Total Income",
          value: `₹${data.total_income.toFixed(2)}`,
          icon: IndianRupee,
        },
        {
          title: "Total Expenses",
          value: `₹${data.total_expenses.toFixed(2)}`,
          icon: Receipt,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <Topbar />

        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              System Analytics
            </h1>

            <p className="mt-2 text-slate-500">
              Overview of BudgetBuddy system-wide statistics.
            </p>
          </div>

          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <p className="text-slate-500">
                Loading system analytics...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {data && !loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {card.title}
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {card.value}
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Icon size={24} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminSystemAnalytics;