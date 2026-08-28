import { useEffect, useState } from "react";

import {
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  CalendarDays,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";

import {
  getReports,
  exportReportsCSV,
} from "../api/client";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const Reports = () => {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [exportingCSV, setExportingCSV] =
    useState(false);

  const [exportingPDF, setExportingPDF] =
    useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD REPORTS
  // =====================================================

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getReports();

        setData(response.data);
      } catch (err) {
        console.error(
          "Failed to load reports:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Unable to load reports."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value) => {
    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // DOWNLOAD BLOB
  // =====================================================

  const downloadBlob = (
    blob,
    filename
  ) => {
    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  };

  // =====================================================
  // EXPORT CSV
  // =====================================================

  const handleExportCSV = async () => {
    try {
      setExportingCSV(true);
      setError("");

      const response =
        await exportReportsCSV();

      const blob = new Blob(
        [response.data],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

      downloadBlob(
        blob,
        "budgetbuddy_reports.csv"
      );
    } catch (err) {
      console.error(
        "Failed to export CSV:",
        err
      );

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Unable to export CSV report."
      );
    } finally {
      setExportingCSV(false);
    }
  };

  // =====================================================
  // EXPORT PDF
  // =====================================================

  const handleExportPDF = async () => {
    try {
      setExportingPDF(true);
      setError("");

      /*
       * IMPORTANT:
       * The application stores the JWT as "token".
       * Do NOT use "access_token".
       */

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/reports/export/pdf`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let message =
          "Unable to export PDF report.";

        try {
          const errorData =
            await response.json();

          message =
            errorData?.detail ||
            errorData?.message ||
            message;
        } catch {
          // Response was not JSON.
        }

        const error =
          new Error(message);

        error.response = {
          status: response.status,
        };

        throw error;
      }

      const blob =
        await response.blob();

      downloadBlob(
        blob,
        "budgetbuddy_report.pdf"
      );
    } catch (err) {
      console.error(
        "Failed to export PDF:",
        err
      );

      setError(
        err.response?.data?.detail ||
          err.message ||
          "Unable to export PDF report."
      );
    } finally {
      setExportingPDF(false);
    }
  };

  // =====================================================
  // SUMMARY
  // =====================================================

  const summary =
    data?.summary || {};

  // =====================================================
  // UI
  // =====================================================

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Reports
          </h1>

          <p className="mt-2 text-slate-500">
            View your financial summary and
            download detailed reports.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">
              Loading reports...
            </p>
          </div>
        ) : data ? (
          <>
            {/* EXPORT SECTION */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-indigo-100 p-3">
                      <FileText
                        size={24}
                        className="text-indigo-600"
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Financial Report
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Export your complete
                        financial data.
                      </p>
                    </div>

                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">

                  {/* CSV */}

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    disabled={exportingCSV}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Download size={18} />

                    {exportingCSV
                      ? "Exporting..."
                      : "Export CSV"}
                  </button>

                  {/* PDF */}

                  <button
                    type="button"
                    onClick={handleExportPDF}
                    disabled={exportingPDF}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FileText size={18} />

                    {exportingPDF
                      ? "Generating..."
                      : "Export PDF"}
                  </button>

                </div>

              </div>
            </div>

            {/* FINANCIAL SUMMARY */}

            <div>

              <div className="mb-4 flex items-center gap-2">

                <CalendarDays
                  size={20}
                  className="text-indigo-600"
                />

                <h2 className="text-xl font-bold text-slate-900">
                  Financial Summary
                </h2>

              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                {/* INCOME */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-slate-500">
                        Total Income
                      </p>

                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {formatCurrency(
                          summary.total_income
                        )}
                      </p>

                    </div>

                    <div className="rounded-xl bg-green-100 p-3">

                      <TrendingUp
                        size={22}
                        className="text-green-600"
                      />

                    </div>

                  </div>

                </div>

                {/* EXPENSES */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-slate-500">
                        Total Expenses
                      </p>

                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {formatCurrency(
                          summary.total_expenses
                        )}
                      </p>

                    </div>

                    <div className="rounded-xl bg-red-100 p-3">

                      <TrendingDown
                        size={22}
                        className="text-red-600"
                      />

                    </div>

                  </div>

                </div>

                {/* BALANCE */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-slate-500">
                        Balance
                      </p>

                      <p
                        className={`mt-2 text-2xl font-bold ${
                          Number(
                            summary.balance || 0
                          ) >= 0
                            ? "text-slate-900"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(
                          summary.balance
                        )}
                      </p>

                    </div>

                    <div className="rounded-xl bg-blue-100 p-3">

                      <Wallet
                        size={22}
                        className="text-blue-600"
                      />

                    </div>

                  </div>

                </div>

                {/* SAVINGS */}

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-slate-500">
                        Total Saved
                      </p>

                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {formatCurrency(
                          summary.total_saved
                        )}
                      </p>

                    </div>

                    <div className="rounded-xl bg-purple-100 p-3">

                      <PiggyBank
                        size={22}
                        className="text-purple-600"
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* RECORD COUNTS */}

            <div className="grid gap-5 md:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <p className="text-sm text-slate-500">
                  Income Records
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {data.income?.length || 0}
                </p>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <p className="text-sm text-slate-500">
                  Expense Records
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {data.expenses?.length || 0}
                </p>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <p className="text-sm text-slate-500">
                  Active Budgets
                </p>

                <p className="mt-2 text-3xl font-bold text-indigo-600">
                  {data.budgets?.length || 0}
                </p>

              </div>

            </div>

            {/* EXPENSE DETAILS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5">

                <h2 className="text-xl font-bold text-slate-900">
                  Recent Expenses
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest recorded expenses.
                </p>

              </div>

              {data.expenses?.length > 0 ? (

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[600px] text-left">

                    <thead>

                      <tr className="border-b border-slate-200 text-sm text-slate-500">

                        <th className="px-3 py-3 font-medium">
                          Date
                        </th>

                        <th className="px-3 py-3 font-medium">
                          Category
                        </th>

                        <th className="px-3 py-3 font-medium">
                          Description
                        </th>

                        <th className="px-3 py-3 text-right font-medium">
                          Amount
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {data.expenses
                        .slice(0, 10)
                        .map((expense) => (

                          <tr
                            key={expense.id}
                            className="border-b border-slate-100 last:border-0"
                          >

                            <td className="px-3 py-4 text-sm text-slate-600">
                              {formatDate(
                                expense.date
                              )}
                            </td>

                            <td className="px-3 py-4">

                              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                                {expense.category ||
                                  "Other"}
                              </span>

                            </td>

                            <td className="px-3 py-4 text-sm text-slate-600">
                              {expense.description ||
                                "-"}
                            </td>

                            <td className="px-3 py-4 text-right font-semibold text-slate-900">
                              {formatCurrency(
                                expense.amount
                              )}
                            </td>

                          </tr>

                        ))}

                    </tbody>

                  </table>

                </div>

              ) : (

                <div className="py-8 text-center text-sm text-slate-500">
                  No expenses recorded yet.
                </div>

              )}

            </div>

            {/* INCOME DETAILS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5">

                <h2 className="text-xl font-bold text-slate-900">
                  Recent Income
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest recorded income.
                </p>

              </div>

              {data.income?.length > 0 ? (

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[500px] text-left">

                    <thead>

                      <tr className="border-b border-slate-200 text-sm text-slate-500">

                        <th className="px-3 py-3 font-medium">
                          Date
                        </th>

                        <th className="px-3 py-3 font-medium">
                          Source
                        </th>

                        <th className="px-3 py-3 text-right font-medium">
                          Amount
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {data.income
                        .slice(0, 10)
                        .map((income) => (

                          <tr
                            key={income.id}
                            className="border-b border-slate-100 last:border-0"
                          >

                            <td className="px-3 py-4 text-sm text-slate-600">
                              {formatDate(
                                income.date
                              )}
                            </td>

                            <td className="px-3 py-4">

                              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                                {income.source ||
                                  "Income"}
                              </span>

                            </td>

                            <td className="px-3 py-4 text-right font-semibold text-slate-900">
                              {formatCurrency(
                                income.amount
                              )}
                            </td>

                          </tr>

                        ))}

                    </tbody>

                  </table>

                </div>

              ) : (

                <div className="py-8 text-center text-sm text-slate-500">
                  No income records yet.
                </div>

              )}

            </div>

            {/* BUDGETS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5">

                <h2 className="text-xl font-bold text-slate-900">
                  Budgets
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your configured monthly budgets.
                </p>

              </div>

              {data.budgets?.length > 0 ? (

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  {data.budgets.map(
                    (budget) => (

                      <div
                        key={budget.id}
                        className="rounded-xl bg-slate-50 p-5"
                      >

                        <p className="font-semibold text-slate-900">
                          {budget.category ||
                            "Other"}
                        </p>

                        <p className="mt-2 text-2xl font-bold text-indigo-600">
                          {formatCurrency(
                            budget.monthly_limit
                          )}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Monthly limit
                        </p>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="py-8 text-center text-sm text-slate-500">
                  No budgets configured yet.
                </div>

              )}

            </div>

            {/* SAVINGS GOALS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5">

                <h2 className="text-xl font-bold text-slate-900">
                  Savings Goals
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track your current savings progress.
                </p>

              </div>

              {data.savings_goals?.length > 0 ? (

                <div className="space-y-4">

                  {data.savings_goals.map(
                    (goal) => (

                      <div
                        key={goal.id}
                        className="rounded-xl bg-slate-50 p-5"
                      >

                        <div className="flex items-center justify-between">

                          <div>

                            <p className="font-semibold text-slate-900">
                              {goal.name}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">

                              {formatCurrency(
                                goal.current_amount
                              )}

                              {" "}
                              of{" "}

                              {formatCurrency(
                                goal.target_amount
                              )}

                            </p>

                          </div>

                          <span className="font-semibold text-purple-600">

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
                                  goal.progress || 0
                                ),
                                100
                              )}%`,
                            }}
                          />

                        </div>

                        {goal.deadline && (

                          <p className="mt-2 text-xs text-slate-400">

                            Deadline:{" "}

                            {formatDate(
                              goal.deadline
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

          </>
        ) : (

          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            No report data available.
          </div>

        )}

      </div>
    </DashboardLayout>
  );
};

export default Reports;