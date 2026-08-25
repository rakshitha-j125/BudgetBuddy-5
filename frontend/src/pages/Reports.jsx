import { useEffect, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";

import {
  getReports,
  exportReportsCSV,
} from "../api/client";

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

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

  const handleExport = async () => {
    try {
      setExporting(true);
      setError("");

      const response =
        await exportReportsCSV();

      const blob = new Blob(
        [response.data],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "budgetbuddy_reports.csv";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(
        "Failed to export reports:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to export report."
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Reports
          </h1>

          <p className="mt-2 text-slate-500">
            Download and view your financial reports.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Financial Report
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Export your income, expenses and budgets.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exporting
                ? "Exporting..."
                : "Export CSV"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
            Loading reports...
          </div>
        ) : data ? (
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-800">
                Income
              </h3>

              <p className="mt-3 text-3xl font-bold text-green-600">
                {data.income?.length || 0}
              </p>

              <p className="text-sm text-slate-500">
                Income records
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-800">
                Expenses
              </h3>

              <p className="mt-3 text-3xl font-bold text-red-600">
                {data.expenses?.length || 0}
              </p>

              <p className="text-sm text-slate-500">
                Expense records
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-800">
                Budgets
              </h3>

              <p className="mt-3 text-3xl font-bold text-indigo-600">
                {data.budgets?.length || 0}
              </p>

              <p className="text-sm text-slate-500">
                Budget records
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
            No report data available.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;