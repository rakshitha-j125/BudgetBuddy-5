import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/axios";

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [income, setIncome] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [savings, setSavings] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          summaryResponse,
          expensesResponse,
          incomeResponse,
          categoriesResponse,
          monthlyResponse,
          savingsResponse,
        ] = await Promise.all([
          api.get("/analytics/summary"),
          api.get("/analytics/expenses"),
          api.get("/analytics/income"),
          api.get("/analytics/categories"),
          api.get("/analytics/monthly-trends"),
          api.get("/analytics/savings"),
        ]);

        setSummary(summaryResponse.data);
        setExpenses(expensesResponse.data);
        setIncome(incomeResponse.data);
        setCategories(categoriesResponse.data);
        setMonthlyTrends(monthlyResponse.data);
        setSavings(savingsResponse.data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.detail ||
            "Unable to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <p className="text-slate-500">
            Loading analytics...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Analytics
          </h1>

          <p className="mt-2 text-slate-500">
            View your financial insights and spending patterns.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total Income
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  ₹{(summary?.total_income || 0).toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="rounded-xl bg-green-100 p-3">
                <TrendingUp
                  className="text-green-600"
                  size={24}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total Expenses
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  ₹{(summary?.total_expenses || 0).toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="rounded-xl bg-red-100 p-3">
                <TrendingDown
                  className="text-red-600"
                  size={24}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Balance
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  ₹{(summary?.balance || 0).toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-100 p-3">
                <Wallet
                  className="text-blue-600"
                  size={24}
                />
              </div>
            </div>
          </div>

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <BarChart3
                className="text-blue-600"
                size={24}
              />

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Spending by Category
                </h2>

                <p className="text-sm text-slate-500">
                  Understand where your money goes.
                </p>
              </div>
            </div>

            {categories.length === 0 ? (
              <div className="flex h-72 items-center justify-center text-slate-500">
                No expense data available.
              </div>
            ) : (
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories}
                      dataKey="total"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {categories.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value) =>
                        `₹${Number(value).toLocaleString("en-IN")}`
                      }
                    />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Monthly Income vs Expenses
              </h2>

              <p className="text-sm text-slate-500">
                Compare your monthly financial activity.
              </p>
            </div>

            {monthlyTrends.length === 0 ? (
              <div className="flex h-72 items-center justify-center text-slate-500">
                No monthly data available.
              </div>
            ) : (
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip
                      formatter={(value) =>
                        `₹${Number(value).toLocaleString("en-IN")}`
                      }
                    />

                    <Legend />

                    <Bar
                      dataKey="income"
                      name="Income"
                    />

                    <Bar
                      dataKey="expenses"
                      name="Expenses"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Expense Statistics
            </h2>

            <div className="mt-6 grid grid-cols-3 gap-4">

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Total
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  ₹{(expenses?.total_expenses || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Count
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {expenses?.expense_count || 0}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Average
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  ₹{Math.round(
                    expenses?.average_expense || 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>

            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Income Statistics
            </h2>

            <div className="mt-6 grid grid-cols-3 gap-4">

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Total
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  ₹{(income?.total_income || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Count
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {income?.income_count || 0}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Average
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  ₹{Math.round(
                    income?.average_income || 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>

            </div>
          </div>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Target
              className="text-purple-600"
              size={24}
            />

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Savings Goals
              </h2>

              <p className="text-sm text-slate-500">
                Your current savings targets.
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-8">
            <div>
              <p className="text-sm text-slate-500">
                Goals
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {savings?.goal_count || 0}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Target
              </p>

              <p className="text-2xl font-bold text-slate-900">
                ₹{(savings?.total_target || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {savings?.goals?.length > 0 && (
            <div className="mt-6 space-y-3">
              {savings.goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {goal.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      Target: ₹
                      {Number(
                        goal.target_amount
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <p className="text-sm text-slate-500">
                    {new Date(
                      goal.deadline
                    ).toLocaleDateString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Analytics;