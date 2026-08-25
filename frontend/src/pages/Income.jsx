import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import {
  getIncomes,
  createIncome,
  deleteIncome,
  getBankAccounts,
} from "../api/client";

const Income = () => {
  const [items, setItems] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [bankAccountId, setBankAccountId] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingBankAccounts, setLoadingBankAccounts] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");

      const res = await getIncomes();

      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to load income:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Unable to load income"
      );
    }
  };

  const loadBankAccounts = async () => {
    try {
      setLoadingBankAccounts(true);

      const res = await getBankAccounts();

      setBankAccounts(res.data || []);
    } catch (err) {
      console.error("Failed to load bank accounts:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Unable to load bank accounts"
      );
    } finally {
      setLoadingBankAccounts(false);
    }
  };

  useEffect(() => {
    load();
    loadBankAccounts();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!bankAccountId) {
      setError("Please select a bank account.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createIncome({
        source: source.trim(),
        amount: parseFloat(amount),
        date: date
          ? new Date(`${date}T00:00:00`).toISOString()
          : new Date().toISOString(),
        notes: notes || "",
        bank_account_id: parseInt(bankAccountId, 10),
      });

      setSource("");
      setAmount("");
      setDate("");
      setNotes("");
      setBankAccountId("");

      await load();
    } catch (err) {
      console.error("Failed to create income:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Unable to add income"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");

      await deleteIncome(id);

      await load();
    } catch (err) {
      console.error("Failed to delete income:", err);

      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Unable to delete income"
      );
    }
  };

  const totalIncome = items.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  const getBankAccountName = (bankAccountId) => {
    const account = bankAccounts.find(
      (item) => Number(item.id) === Number(bankAccountId)
    );

    if (!account) {
      return "—";
    }

    if (account.bank_name && account.account_name) {
      return `${account.bank_name} - ${account.account_name}`;
    }

    return (
      account.bank_name ||
      account.account_name ||
      "Bank Account"
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64">
        <Topbar />

        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Income
            </h1>

            <p className="mt-2 text-slate-500">
              Manage all your income sources here.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
              {error}
            </div>
          )}

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Income
              </p>

              <h2 className="mt-3 text-3xl font-bold text-emerald-600">
                ₹{totalIncome.toFixed(2)}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Across all recorded income
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Number of Income Records
              </p>

              <h2 className="mt-3 text-3xl font-bold text-indigo-600">
                {items.length}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Recorded income transactions
              </p>
            </div>
          </div>

          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Add Income
            </h2>

            <p className="mt-2 text-slate-500">
              Record a new income transaction.
            </p>

            {bankAccounts.length === 0 &&
              !loadingBankAccounts && (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
                  Please add a bank account before adding income.
                </div>
              )}

            <form
              onSubmit={handleAdd}
              className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Source
                </label>

                <input
                  type="text"
                  placeholder="Salary"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Amount
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Bank Account
                </label>

                <select
                  value={bankAccountId}
                  onChange={(e) =>
                    setBankAccountId(e.target.value)
                  }
                  required
                  disabled={
                    loadingBankAccounts ||
                    bankAccounts.length === 0
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
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
                            account.account_name ||
                            "Account"
                          }`
                        : account.account_name ||
                          "Bank Account"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Notes
                </label>

                <input
                  type="text"
                  placeholder="Optional"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="lg:col-span-5">
                <button
                  type="submit"
                  disabled={
                    loading ||
                    loadingBankAccounts ||
                    bankAccounts.length === 0
                  }
                  className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Adding..." : "+ Add Income"}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-7">
              <h2 className="text-2xl font-bold text-slate-900">
                Income History
              </h2>

              <p className="mt-2 text-slate-500">
                View and manage your recorded income.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      ID
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Source
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Bank Account
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Date
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        No income records yet.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-6 py-4 text-slate-600">
                          #{item.id}
                        </td>

                        <td className="px-6 py-4 font-medium text-slate-900">
                          {item.source}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {getBankAccountName(
                            item.bank_account_id
                          )}
                        </td>

                        <td className="px-6 py-4 font-semibold text-emerald-600">
                          ₹{Number(item.amount || 0).toFixed(2)}
                        </td>

                        <td className="px-6 py-4 text-slate-500">
                          {item.date
                            ? new Date(
                                item.date
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(item.id)
                            }
                            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Income;