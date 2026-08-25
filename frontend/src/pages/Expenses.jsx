import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import {
  getExpenses,
  createExpense,
  deleteExpense,
  getBankAccounts,
} from "../api/client";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [bankAccountId, setBankAccountId] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [loadingBankAccounts, setLoadingBankAccounts] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadExpenses = async () => {
    try {
      setLoadingExpenses(true);
      setError("");

      const response = await getExpenses();

      setExpenses(response?.data || []);
    } catch (err) {
      console.error("Failed to load expenses:", err);

      setError(
        err?.response?.data?.detail ||
          "Unable to load your expenses."
      );
    } finally {
      setLoadingExpenses(false);
    }
  };

  const loadBankAccounts = async () => {
    try {
      setLoadingBankAccounts(true);

      const response = await getBankAccounts();

      setBankAccounts(response?.data || []);
    } catch (err) {
      console.error("Failed to load bank accounts:", err);

      setError(
        err?.response?.data?.detail ||
          "Unable to load your bank accounts."
      );
    } finally {
      setLoadingBankAccounts(false);
    }
  };

  useEffect(() => {
    loadExpenses();
    loadBankAccounts();
  }, []);

  const handleAdd = async (event) => {
    event.preventDefault();

    if (!bankAccountId) {
      setError("Please select a bank account.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createExpense({
        amount: parseFloat(amount),
        category: category.trim(),
        description: description.trim(),
        bank_account_id: parseInt(bankAccountId, 10),
      });

      setAmount("");
      setCategory("");
      setDescription("");
      setBankAccountId("");

      setSuccess("Expense added successfully.");

      await loadExpenses();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Failed to create expense:", err);

      setError(
        err?.response?.data?.detail ||
          "Unable to add expense."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteExpense(id);

      setSuccess("Expense deleted successfully.");

      await loadExpenses();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Failed to delete expense:", err);

      setError(
        err?.response?.data?.detail ||
          "Unable to delete expense."
      );
    }
  };

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

  const formatAmount = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getBankAccountName = (bankAccountId) => {
    const account = bankAccounts.find(
      (item) => Number(item.id) === Number(bankAccountId)
    );

    if (!account) {
      return "—";
    }

    return account.account_name
      ? `${account.bank_name || "Bank"} - ${account.account_name}`
      : account.bank_name || "Bank Account";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64">
        <Topbar />

        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Expenses
            </h1>

            <p className="mt-2 text-slate-500">
              Track and manage your daily expenses.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-medium text-slate-500">
                Total Expenses
              </p>

              <p className="mt-3 text-3xl font-bold text-red-500">
                {formatAmount(totalExpenses)}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Across all recorded expenses
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-medium text-slate-500">
                Number of Expenses
              </p>

              <p className="mt-3 text-3xl font-bold text-blue-600">
                {expenses.length}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Recorded transactions
              </p>
            </div>
          </div>

          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Add Expense
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Record a new expense to keep your finances up to date.
              </p>
            </div>

            {bankAccounts.length === 0 && !loadingBankAccounts && (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
                Please add a bank account before adding an expense.
              </div>
            )}

            <form
              onSubmit={handleAdd}
              className="grid gap-5 md:grid-cols-2 lg:grid-cols-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Amount
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(event) =>
                      setAmount(event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <input
                  type="text"
                  placeholder="Food, Travel, Shopping..."
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Bank Account
                </label>

                <select
                  value={bankAccountId}
                  onChange={(event) =>
                    setBankAccountId(event.target.value)
                  }
                  required
                  disabled={
                    loadingBankAccounts ||
                    bankAccounts.length === 0
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {loadingBankAccounts
                      ? "Loading accounts..."
                      : "Select bank account"}
                  </option>

                  {bankAccounts.map((account) => (
                    <option
                      key={account.id}
                      value={account.id}
                    >
                      {account.bank_name
                        ? `${account.bank_name} - ${
                            account.account_name || "Account"
                          }`
                        : account.account_name || "Bank Account"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <input
                  type="text"
                  placeholder="Optional"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={
                    loading ||
                    loadingBankAccounts ||
                    bankAccounts.length === 0
                  }
                  className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Adding..." : "+ Add Expense"}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-xl font-semibold text-slate-900">
                Expense History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View and manage your recorded expenses.
              </p>
            </div>

            {loadingExpenses ? (
              <div className="flex min-h-[250px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                  <p className="mt-4 text-sm text-slate-500">
                    Loading expenses...
                  </p>
                </div>
              </div>
            ) : expenses.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                    💳
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-800">
                    No expenses yet
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Add your first expense using the form above.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-left">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Bank Account
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Description
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Amount
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {expenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                              ↓
                            </div>

                            <span className="font-medium text-slate-800">
                              {expense.category}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {getBankAccountName(
                            expense.bank_account_id
                          )}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {expense.description || "—"}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {expense.date
                            ? new Date(
                                expense.date
                              ).toLocaleDateString("en-IN")
                            : "—"}
                        </td>

                        <td className="px-6 py-4 text-right font-semibold text-red-500">
                          -{formatAmount(expense.amount)}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(expense.id)
                            }
                            className="rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
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

export default Expenses;