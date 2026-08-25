import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../api/client";

const Budget = () => {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBudgets = async () => {
    try {
      setError("");

      const response = await getBudgets();
      setItems(response.data || []);
    } catch (err) {
      console.error("Failed to load budgets:", err);
      setError(err.message || "Failed to load budgets");
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const resetForm = () => {
    setCategory("");
    setLimit("");
    setMonthYear("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.trim()) {
      setError("Category is required.");
      return;
    }

    if (!limit || Number(limit) <= 0) {
      setError("Monthly limit must be greater than 0.");
      return;
    }

    if (!monthYear) {
      setError("Please select a month.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        category: category.trim(),
        monthly_limit: Number(limit),
        month_year: monthYear,
      };

      if (editingId) {
        await updateBudget(editingId, payload);
      } else {
        await createBudget(payload);
      }

      resetForm();
      await loadBudgets();
    } catch (err) {
      console.error("Budget operation failed:", err);
      setError(err.message || "Unable to save budget.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (budget) => {
    setEditingId(budget.id);
    setCategory(budget.category || "");
    setLimit(String(budget.monthly_limit ?? ""));
    setMonthYear(budget.month_year || "");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteBudget(id);
      await loadBudgets();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error("Failed to delete budget:", err);
      setError(err.message || "Unable to delete budget.");
    }
  };

  const totalBudget = items.reduce(
    (total, item) => total + Number(item.monthly_limit || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-[258px] min-h-screen">
        <Topbar />

        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Budgets
            </h1>

            <p className="mt-2 text-slate-500">
              Create and manage your monthly spending budgets.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
              {error}
            </div>
          )}

          {/* Summary */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Monthly Budget
              </p>

              <p className="mt-3 text-3xl font-bold text-indigo-600">
                ₹{totalBudget.toFixed(2)}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Across all your budgets
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Number of Budgets
              </p>

              <p className="mt-3 text-3xl font-bold text-slate-900">
                {items.length}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Active budget categories
              </p>
            </div>
          </div>

          {/* Add / Edit Budget */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              {editingId ? "Edit Budget" : "Add Budget"}
            </h2>

            <p className="mt-2 text-slate-500">
              {editingId
                ? "Update your monthly budget details."
                : "Set a monthly spending limit for a category."}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-4"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <input
                  type="text"
                  placeholder="Food"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Monthly Limit
                </label>

                <input
                  type="number"
                  placeholder="5000"
                  min="0.01"
                  step="0.01"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Month
                </label>

                <input
                  type="month"
                  value={monthYear}
                  onChange={(e) => setMonthYear(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div className="flex items-end gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update Budget"
                    : "+ Add Budget"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Budget History */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Budget History
              </h2>

              <p className="mt-2 text-slate-500">
                View and manage your monthly budgets.
              </p>
            </div>

            {items.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-5xl">🎯</div>

                <h3 className="mt-4 text-lg font-semibold text-slate-800">
                  No budgets yet
                </h3>

                <p className="mt-2 text-slate-500">
                  Add your first monthly budget above.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-600">
                        ID
                      </th>

                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-600">
                        Category
                      </th>

                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-600">
                        Monthly Limit
                      </th>

                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-600">
                        Month
                      </th>

                      <th className="px-8 py-4 text-right text-sm font-semibold text-slate-600">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-8 py-5 text-sm text-slate-500">
                          #{item.id}
                        </td>

                        <td className="px-8 py-5">
                          <span className="font-semibold text-slate-800">
                            {item.category}
                          </span>
                        </td>

                        <td className="px-8 py-5 font-semibold text-indigo-600">
                          ₹{Number(item.monthly_limit || 0).toFixed(2)}
                        </td>

                        <td className="px-8 py-5 text-slate-600">
                          {item.month_year || "-"}
                        </td>

                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Budget;