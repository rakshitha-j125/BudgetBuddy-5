import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAuth } from "../context/useAuth";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Dashboard() {
  const { token, user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setError("");

        const response = await fetch(
          `${API_URL}/expenses/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to load dashboard"
          );
        }

        setDashboard(data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(
          err.message || "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64">
        <Topbar />

        <main className="p-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back
              {user?.full_name
                ? `, ${user.full_name}`
                : ""}{" "}
              👋
            </h1>

            <p className="mt-2 text-slate-500">
              Here's an overview of your finances
              this month.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading your dashboard...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {/* Total Balance */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Total Balance
                      </p>

                      <p className="mt-3 text-3xl font-bold text-slate-900">
                        {formatAmount(
                          dashboard?.balance
                        )}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      💰
                    </div>
                  </div>
                </div>

                {/* Total Income */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Total Income
                      </p>

                      <p className="mt-3 text-3xl font-bold text-emerald-600">
                        {formatAmount(
                          dashboard?.total_income
                        )}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                      ↗
                    </div>
                  </div>
                </div>

                {/* Total Expenses */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Total Expenses
                      </p>

                      <p className="mt-3 text-3xl font-bold text-red-500">
                        {formatAmount(
                          dashboard?.total_expenses
                        )}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
                      ↘
                    </div>
                  </div>
                </div>

                {/* Budget Remaining */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Budget Remaining
                      </p>

                      <p className="mt-3 text-3xl font-bold text-blue-600">
                        {formatAmount(
                          dashboard?.budget_remaining
                        )}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      🎯
                    </div>
                  </div>
                </div>

              </div>

              {/* Main Content */}
              <div className="mt-8 grid gap-6 lg:grid-cols-2">

                {/* Recent Transactions */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Recent Transactions
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Your latest financial activity
                      </p>
                    </div>
                  </div>

                  {dashboard?.recent_transactions?.length >
                  0 ? (
                    <div className="mt-6 space-y-4">

                      {dashboard.recent_transactions.map(
                        (transaction, index) => (
                          <div
                            key={`${transaction.id}-${index}`}
                            className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
                          >
                            <div className="flex items-center gap-4">

                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                  transaction.type ===
                                  "income"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-red-50 text-red-500"
                                }`}
                              >
                                {transaction.type ===
                                "income"
                                  ? "↗"
                                  : "↘"}
                              </div>

                              <div>
                                <p className="font-medium text-slate-900">
                                  {transaction.title ||
                                    transaction.category}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {transaction.category}
                                </p>
                              </div>

                            </div>

                            <p
                              className={`font-semibold ${
                                transaction.type ===
                                "income"
                                  ? "text-emerald-600"
                                  : "text-red-500"
                              }`}
                            >
                              {transaction.type ===
                              "income"
                                ? "+"
                                : "-"}
                              {formatAmount(
                                transaction.amount
                              )}
                            </p>
                          </div>
                        )
                      )}

                    </div>
                  ) : (
                    <div className="flex min-h-[220px] items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl">
                          💳
                        </div>

                        <p className="mt-4 font-medium text-slate-700">
                          No transactions yet
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Add income or expenses to see
                          them here.
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                {/* Spending Overview */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Spending Overview
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Your top spending categories this
                      month
                    </p>
                  </div>

                  {dashboard?.top_categories?.length >
                  0 ? (
                    <div className="mt-8 space-y-6">

                      {dashboard.top_categories.map(
                        (item, index) => {
                          const totalExpenses =
                            Number(
                              dashboard.total_expenses ||
                                0
                            );

                          const percentage =
                            totalExpenses > 0
                              ? Math.min(
                                  100,
                                  (Number(item.total) /
                                    totalExpenses) *
                                    100
                                )
                              : 0;

                          return (
                            <div
                              key={`${item.category}-${index}`}
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700">
                                  {item.category}
                                </span>

                                <span className="text-sm font-semibold text-slate-900">
                                  {formatAmount(
                                    item.total
                                  )}
                                </span>
                              </div>

                              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-blue-600 transition-all"
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        }
                      )}

                    </div>
                  ) : (
                    <div className="flex min-h-[220px] items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl">
                          📊
                        </div>

                        <p className="mt-4 font-medium text-slate-700">
                          No spending data yet
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Add expenses to see your
                          spending overview.
                        </p>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}