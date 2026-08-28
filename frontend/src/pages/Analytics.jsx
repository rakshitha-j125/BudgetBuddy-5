import { useEffect, useState } from "react";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  Lightbulb,
  Lock,
  CalendarDays,
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/axios";

const CATEGORY_COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
];

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [income, setIncome] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [savings, setSavings] = useState(null);
  const [insights, setInsights] = useState(null);

  const [dateRange, setDateRange] = useState(null);
  const [categoryOverTime, setCategoryOverTime] = useState([]);
  const [monthComparison, setMonthComparison] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [comparisonYear, setComparisonYear] = useState(
    new Date().getFullYear()
  );

  const [comparisonMonth, setComparisonMonth] = useState(
    new Date().getMonth() + 1
  );

  const [premiumLoading, setPremiumLoading] = useState(false);
  const [premiumError, setPremiumError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * =======================================================
   * CHECK USER ROLE
   * =======================================================
   */

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    user = null;
  }

  const userRole = user?.role || "student";

  const isPremium =
    userRole === "premium" ||
    userRole === "admin";

  /*
   * =======================================================
   * LOAD BASIC ANALYTICS
   * =======================================================
   */

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
          insightsResponse,
        ] = await Promise.all([
          api.get("/analytics/summary"),
          api.get("/analytics/expenses"),
          api.get("/analytics/income"),
          api.get("/analytics/categories"),
          api.get("/analytics/monthly-trends"),
          api.get("/analytics/savings"),
          api.get("/analytics/insights"),
        ]);

        setSummary(summaryResponse.data);
        setExpenses(expensesResponse.data);
        setIncome(incomeResponse.data);
        setCategories(
          categoriesResponse.data || []
        );
        setMonthlyTrends(
          monthlyResponse.data || []
        );
        setSavings(savingsResponse.data);
        setInsights(insightsResponse.data);
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

  /*
   * =======================================================
   * FORMATTERS
   * =======================================================
   */

  const formatCurrency = (value) => {
    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const formatMonth = (month) => {
    if (!month) return "";

    const [year, monthNumber] =
      month.split("-");

    const date = new Date(
      Number(year),
      Number(monthNumber) - 1,
      1
    );

    return date.toLocaleDateString(
      "en-IN",
      {
        month: "short",
        year: "numeric",
      }
    );
  };

  /*
   * =======================================================
   * PREMIUM - CUSTOM DATE RANGE
   * =======================================================
   */

  const loadDateRangeAnalytics = async () => {
    if (!startDate || !endDate) {
      setPremiumError(
        "Please select both start and end dates."
      );
      return;
    }

    try {
      setPremiumLoading(true);
      setPremiumError("");

      const response = await api.get(
        "/analytics/date-range",
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        }
      );

      setDateRange(response.data);
    } catch (err) {
      console.error(err);

      setPremiumError(
        err.response?.data?.detail ||
          "Unable to load date range analytics."
      );
    } finally {
      setPremiumLoading(false);
    }
  };

  /*
   * =======================================================
   * PREMIUM - CATEGORY OVER TIME
   * =======================================================
   */

  const loadCategoryOverTime = async () => {
    try {
      setPremiumLoading(true);
      setPremiumError("");

      const response = await api.get(
        "/analytics/category-over-time"
      );

      const rawData =
        response.data || [];

      const transformed = rawData.map(
        (item) => ({
          month: item.month,
          ...(item.categories || {}),
        })
      );

      setCategoryOverTime(
        transformed
      );
    } catch (err) {
      console.error(err);

      setPremiumError(
        err.response?.data?.detail ||
          "Unable to load category trends."
      );
    } finally {
      setPremiumLoading(false);
    }
  };

  /*
   * =======================================================
   * PREMIUM - MONTH COMPARISON
   * =======================================================
   */

  const loadMonthComparison = async () => {
    try {
      setPremiumLoading(true);
      setPremiumError("");

      const response = await api.get(
        "/analytics/month-comparison",
        {
          params: {
            year: comparisonYear,
            month: comparisonMonth,
          },
        }
      );

      setMonthComparison(
        response.data
      );
    } catch (err) {
      console.error(err);

      setPremiumError(
        err.response?.data?.detail ||
          "Unable to load month comparison."
      );
    } finally {
      setPremiumLoading(false);
    }
  };

  /*
   * =======================================================
   * LOADING
   * =======================================================
   */

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

  /*
   * =======================================================
   * ERROR
   * =======================================================
   */

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  /*
   * =======================================================
   * PREMIUM CATEGORY KEYS
   * =======================================================
   */

  const premiumCategoryKeys = [
    ...new Set(
      categoryOverTime.flatMap(
        (item) =>
          Object.keys(item).filter(
            (key) => key !== "month"
          )
      )
    ),
  ];

  /*
   * =======================================================
   * UI
   * =======================================================
   */

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Analytics
          </h1>

          <p className="mt-2 text-slate-500">
            View your financial insights and
            spending patterns.
          </p>
        </div>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid gap-5 md:grid-cols-3">

          {/* Income */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Total Income
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(
                    summary?.total_income
                  )}
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

          {/* Expenses */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Total Expenses
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {formatCurrency(
                    summary?.total_expenses
                  )}
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

          {/* Balance */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Balance
                </p>

                <h2
                  className={`mt-2 text-2xl font-bold ${
                    Number(
                      summary?.balance || 0
                    ) >= 0
                      ? "text-slate-900"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(
                    summary?.balance
                  )}
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

        {/* =================================================
            FINANCIAL HEALTH
        ================================================= */}

        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Savings Rate
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {Number(
                summary?.savings_rate || 0
              ).toFixed(2)}
              %
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Percentage of income remaining
              after expenses.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm text-slate-500">
              Expense Ratio
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {Number(
                insights?.expense_ratio || 0
              ).toFixed(2)}
              %
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Percentage of income used for
              expenses.
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-2">

              <Lightbulb
                size={20}
                className="text-yellow-500"
              />

              <p className="text-sm font-medium text-slate-500">
                Financial Insight
              </p>

            </div>

            <p className="mt-3 font-semibold text-slate-900">
              {insights?.status ||
                "Keep monitoring your finances."}
            </p>

          </div>

        </div>

        {/* =================================================
            BASIC CHARTS
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Category Chart */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

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

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

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

                      {categories.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              CATEGORY_COLORS[
                                index %
                                  CATEGORY_COLORS.length
                              ]
                            }
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(value)
                      }
                    />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            )}

          </div>

          {/* Monthly Chart */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-slate-900">
              Monthly Income vs Expenses
            </h2>

            <p className="text-sm text-slate-500">
              Compare your monthly financial activity.
            </p>

            {monthlyTrends.length === 0 ? (

              <div className="flex h-72 items-center justify-center text-slate-500">
                No monthly data available.
              </div>

            ) : (

              <div className="mt-6 h-72">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={monthlyTrends}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="month"
                      tickFormatter={formatMonth}
                    />

                    <YAxis />

                    <Tooltip
                      labelFormatter={
                        formatMonth
                      }
                      formatter={(value) =>
                        formatCurrency(value)
                      }
                    />

                    <Legend />

                    <Bar
                      dataKey="income"
                      name="Income"
                      fill="#10B981"
                      radius={[
                        6,
                        6,
                        0,
                        0,
                      ]}
                    />

                    <Bar
                      dataKey="expenses"
                      name="Expenses"
                      fill="#EF4444"
                      radius={[
                        6,
                        6,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            )}

          </div>

        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-slate-900">
              Expense Statistics
            </h2>

            <div className="mt-6 grid grid-cols-3 gap-4">

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Total
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {formatCurrency(
                    expenses?.total_expenses
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Count
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {expenses?.expense_count ||
                    0}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Average
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {formatCurrency(
                    expenses?.average_expense
                  )}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-slate-900">
              Income Statistics
            </h2>

            <div className="mt-6 grid grid-cols-3 gap-4">

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Total
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {formatCurrency(
                    income?.total_income
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Count
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {income?.income_count ||
                    0}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Average
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {formatCurrency(
                    income?.average_income
                  )}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            SAVINGS GOALS
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-purple-100 p-3">
              <Target
                className="text-purple-600"
                size={24}
              />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Savings Goals
              </h2>

              <p className="text-sm text-slate-500">
                Track your savings progress.
              </p>

            </div>

          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Goals
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {savings?.goal_count ||
                  0}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Total Saved
              </p>

              <p className="mt-1 text-2xl font-bold text-green-600">
                {formatCurrency(
                  savings?.total_saved
                )}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Total Target
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {formatCurrency(
                  savings?.total_target
                )}
              </p>
            </div>

          </div>

          {savings?.goal_count > 0 && (

            <div className="mt-6">

              <div className="mb-2 flex justify-between text-sm">

                <span className="font-medium text-slate-700">
                  Overall Progress
                </span>

                <span className="font-semibold text-purple-600">
                  {Number(
                    savings?.overall_progress ||
                      0
                  ).toFixed(1)}
                  %
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-purple-600 transition-all"
                  style={{
                    width: `${Math.min(
                      Number(
                        savings?.overall_progress ||
                          0
                      ),
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

          )}

          {savings?.goals?.length > 0 ? (

            <div className="mt-6 space-y-4">

              {savings.goals.map(
                (goal) => (

                  <div
                    key={goal.id}
                    className="rounded-xl bg-slate-50 p-5"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="font-semibold text-slate-900">
                          {goal.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {formatCurrency(
                            goal.current_amount
                          )}{" "}
                          saved of{" "}
                          {formatCurrency(
                            goal.target_amount
                          )}
                        </p>

                      </div>

                      <span className="text-sm font-semibold text-purple-600">
                        {Number(
                          goal.progress || 0
                        ).toFixed(1)}
                        %
                      </span>

                    </div>

                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">

                      <div
                        className="h-full rounded-full bg-purple-600 transition-all"
                        style={{
                          width: `${Math.min(
                            Number(
                              goal.progress ||
                                0
                            ),
                            100
                          )}%`,
                        }}
                      />

                    </div>

                    {goal.deadline && (

                      <p className="mt-2 text-xs text-slate-400">
                        Deadline:{" "}
                        {new Date(
                          goal.deadline
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>

                    )}

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="py-8 text-center text-sm text-slate-500">
              No savings goals yet.
            </div>

          )}

        </div>

        {/* =================================================
            PREMIUM ANALYTICS
        ================================================= */}

        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-indigo-600 p-3">

                {isPremium ? (
                  <BarChart3
                    className="text-white"
                    size={24}
                  />
                ) : (
                  <Lock
                    className="text-white"
                    size={24}
                  />
                )}

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-xl font-bold text-slate-900">
                    Premium Analytics
                  </h2>

                  <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">
                    PREMIUM
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Advanced financial analysis and
                  comparisons.
                </p>

              </div>

            </div>

            {!isPremium && (

              <div className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                Upgrade to unlock
              </div>

            )}

          </div>

          {!isPremium ? (

            <div className="mt-6 rounded-xl border border-indigo-100 bg-white p-8 text-center">

              <Lock
                className="mx-auto text-indigo-500"
                size={36}
              />

              <h3 className="mt-3 text-lg font-bold text-slate-900">
                Premium features are locked
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
                Premium users can analyze custom
                date ranges, compare monthly
                performance and view category
                spending trends over time.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-6">

              {premiumError && (

                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {premiumError}
                </div>

              )}

              {/* =========================================
                  CUSTOM DATE RANGE
              ========================================= */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6">

                <div className="flex items-center gap-3">

                  <CalendarDays
                    className="text-indigo-600"
                    size={22}
                  />

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Custom Date Range
                    </h3>

                    <p className="text-sm text-slate-500">
                      Analyze your finances for
                      any period.
                    </p>

                  </div>

                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) =>
                        setStartDate(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      End Date
                    </label>

                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) =>
                        setEndDate(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                    />

                  </div>

                  <div className="flex items-end">

                    <button
                      type="button"
                      onClick={
                        loadDateRangeAnalytics
                      }
                      disabled={
                        premiumLoading
                      }
                      className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                    >
                      {premiumLoading
                        ? "Loading..."
                        : "Analyze Range"}
                    </button>

                  </div>

                </div>

                {dateRange && (

                  <div className="mt-6 grid gap-4 md:grid-cols-4">

                    <div className="rounded-xl bg-green-50 p-4">
                      <p className="text-sm text-slate-500">
                        Income
                      </p>

                      <p className="mt-1 text-xl font-bold text-green-600">
                        {formatCurrency(
                          dateRange.summary
                            ?.total_income
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-red-50 p-4">
                      <p className="text-sm text-slate-500">
                        Expenses
                      </p>

                      <p className="mt-1 text-xl font-bold text-red-600">
                        {formatCurrency(
                          dateRange.summary
                            ?.total_expenses
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-blue-50 p-4">
                      <p className="text-sm text-slate-500">
                        Balance
                      </p>

                      <p className="mt-1 text-xl font-bold text-blue-600">
                        {formatCurrency(
                          dateRange.summary
                            ?.balance
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-purple-50 p-4">
                      <p className="text-sm text-slate-500">
                        Savings Rate
                      </p>

                      <p className="mt-1 text-xl font-bold text-purple-600">
                        {Number(
                          dateRange.summary
                            ?.savings_rate ||
                            0
                        ).toFixed(2)}
                        %
                      </p>
                    </div>

                  </div>

                )}

              </div>

              {/* =========================================
                  CATEGORY OVER TIME
              ========================================= */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Category Spending Over Time
                    </h3>

                    <p className="text-sm text-slate-500">
                      See how your spending categories
                      change each month.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={
                      loadCategoryOverTime
                    }
                    disabled={
                      premiumLoading
                    }
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    {premiumLoading
                      ? "Loading..."
                      : "Load Trend"}
                  </button>

                </div>

                {categoryOverTime.length > 0 && (

                  <div className="mt-6 h-80">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <LineChart
                        data={
                          categoryOverTime
                        }
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                        />

                        <XAxis
                          dataKey="month"
                          tickFormatter={
                            formatMonth
                          }
                        />

                        <YAxis />

                        <Tooltip
                          labelFormatter={
                            formatMonth
                          }
                          formatter={(value) =>
                            formatCurrency(
                              value
                            )
                          }
                        />

                        <Legend />

                        {premiumCategoryKeys.map(
                          (
                            category,
                            index
                          ) => (

                            <Line
                              key={category}
                              type="monotone"
                              dataKey={
                                category
                              }
                              name={category}
                              stroke={
                                CATEGORY_COLORS[
                                  index %
                                    CATEGORY_COLORS.length
                                ]
                              }
                              strokeWidth={2}
                              dot={{
                                r: 3,
                              }}
                            />

                          )
                        )}

                      </LineChart>

                    </ResponsiveContainer>

                  </div>

                )}

              </div>

              {/* =========================================
                  MONTH COMPARISON
              ========================================= */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6">

                <div>

                  <h3 className="font-bold text-slate-900">
                    Month vs Last Month
                  </h3>

                  <p className="text-sm text-slate-500">
                    Compare income, expenses and
                    balance with the previous month.
                  </p>

                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Year
                    </label>

                    <input
                      type="number"
                      value={
                        comparisonYear
                      }
                      onChange={(e) =>
                        setComparisonYear(
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Month
                    </label>

                    <select
                      value={
                        comparisonMonth
                      }
                      onChange={(e) =>
                        setComparisonMonth(
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                    >

                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map(
                        (
                          monthName,
                          index
                        ) => (

                          <option
                            key={monthName}
                            value={index + 1}
                          >
                            {monthName}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                  <div className="flex items-end">

                    <button
                      type="button"
                      onClick={
                        loadMonthComparison
                      }
                      disabled={
                        premiumLoading
                      }
                      className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                    >
                      {premiumLoading
                        ? "Loading..."
                        : "Compare Months"}
                    </button>

                  </div>

                </div>

                {monthComparison && (

                  <div className="mt-6">

                    <div className="grid gap-4 md:grid-cols-3">

                      <div className="rounded-xl bg-green-50 p-5">

                        <p className="text-sm text-slate-500">
                          Income Change
                        </p>

                        <p className="mt-2 text-2xl font-bold text-green-600">
                          {Number(
                            monthComparison
                              .changes
                              ?.income_percentage ||
                              0
                          ) > 0
                            ? "+"
                            : ""}
                          {Number(
                            monthComparison
                              .changes
                              ?.income_percentage ||
                              0
                          ).toFixed(2)}
                          %
                        </p>

                      </div>

                      <div className="rounded-xl bg-red-50 p-5">

                        <p className="text-sm text-slate-500">
                          Expense Change
                        </p>

                        <p className="mt-2 text-2xl font-bold text-red-600">
                          {Number(
                            monthComparison
                              .changes
                              ?.expense_percentage ||
                              0
                          ) > 0
                            ? "+"
                            : ""}
                          {Number(
                            monthComparison
                              .changes
                              ?.expense_percentage ||
                              0
                          ).toFixed(2)}
                          %
                        </p>

                      </div>

                      <div className="rounded-xl bg-blue-50 p-5">

                        <p className="text-sm text-slate-500">
                          Balance Change
                        </p>

                        <p className="mt-2 text-2xl font-bold text-blue-600">
                          {Number(
                            monthComparison
                              .changes
                              ?.balance_percentage ||
                              0
                          ) > 0
                            ? "+"
                            : ""}
                          {Number(
                            monthComparison
                              .changes
                              ?.balance_percentage ||
                              0
                          ).toFixed(2)}
                          %
                        </p>

                      </div>

                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">

                      <div className="rounded-xl border border-slate-200 p-5">

                        <h4 className="font-bold text-slate-900">
                          Current Month
                        </h4>

                        <div className="mt-4 space-y-2 text-sm">

                          <div className="flex justify-between">
                            <span className="text-slate-500">
                              Income
                            </span>

                            <span className="font-semibold">
                              {formatCurrency(
                                monthComparison
                                  .current_month
                                  ?.income
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-slate-500">
                              Expenses
                            </span>

                            <span className="font-semibold">
                              {formatCurrency(
                                monthComparison
                                  .current_month
                                  ?.expenses
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between border-t pt-2">
                            <span className="font-medium">
                              Balance
                            </span>

                            <span className="font-bold">
                              {formatCurrency(
                                monthComparison
                                  .current_month
                                  ?.balance
                              )}
                            </span>
                          </div>

                        </div>

                      </div>

                      <div className="rounded-xl border border-slate-200 p-5">

                        <h4 className="font-bold text-slate-900">
                          Previous Month
                        </h4>

                        <div className="mt-4 space-y-2 text-sm">

                          <div className="flex justify-between">
                            <span className="text-slate-500">
                              Income
                            </span>

                            <span className="font-semibold">
                              {formatCurrency(
                                monthComparison
                                  .previous_month
                                  ?.income
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-slate-500">
                              Expenses
                            </span>

                            <span className="font-semibold">
                              {formatCurrency(
                                monthComparison
                                  .previous_month
                                  ?.expenses
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between border-t pt-2">
                            <span className="font-medium">
                              Balance
                            </span>

                            <span className="font-bold">
                              {formatCurrency(
                                monthComparison
                                  .previous_month
                                  ?.balance
                              )}
                            </span>
                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                )}

              </div>

            </div>

          )}

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Analytics;