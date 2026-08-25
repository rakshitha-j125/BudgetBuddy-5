import { useEffect, useState } from "react";
import { Building2, Plus, Trash2, Edit2 } from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import api from "../api/axios";

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("Savings");
  const [accountNumberLast4, setAccountNumberLast4] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("INR");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bank-accounts/");
      setAccounts(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load bank accounts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const resetForm = () => {
    setBankName("");
    setAccountName("");
    setAccountType("Savings");
    setAccountNumberLast4("");
    setBalance("");
    setCurrency("INR");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      bank_name: bankName.trim(),
      account_name: accountName.trim(),
      account_type: accountType,
      account_number_last4: accountNumberLast4.trim(),
      balance:
        balance === ""
          ? 0
          : Number(balance),
      currency,
      is_active: true,
    };

    try {
      if (editingId) {
        await api.put(
          `/bank-accounts/${editingId}`,
          payload
        );

        setMessage(
          "Bank account updated successfully."
        );
      } else {
        await api.post(
          "/bank-accounts/",
          payload
        );

        setMessage(
          "Bank account added successfully."
        );
      }

      resetForm();
      await loadAccounts();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to save bank account."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (account) => {
    setEditingId(account.id);
    setBankName(account.bank_name || "");
    setAccountName(account.account_name || "");
    setAccountType(
      account.account_type || "Savings"
    );
    setAccountNumberLast4(
      account.account_number_last4 || ""
    );
    setBalance(account.balance ?? "");
    setCurrency(account.currency || "INR");
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bank account?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.delete(
        `/bank-accounts/${id}`
      );

      setMessage(
        "Bank account deleted successfully."
      );

      await loadAccounts();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to delete bank account."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <Topbar />

        <main className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Bank Accounts
              </h1>

              <p className="mt-2 text-slate-500">
                Manage the bank accounts used for your
                income and expenses.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              <Plus size={18} />
              Add Bank Account
            </button>
          </div>

          {message && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {showForm && (
            <div className="mb-8 max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingId
                  ? "Edit Bank Account"
                  : "Add Bank Account"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Bank Name
                    </label>

                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) =>
                        setBankName(e.target.value)
                      }
                      required
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                      placeholder="Example: HDFC Bank"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Account Name
                    </label>

                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) =>
                        setAccountName(e.target.value)
                      }
                      required
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                      placeholder="Example: Primary Savings"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Account Type
                    </label>

                    <select
                      value={accountType}
                      onChange={(e) =>
                        setAccountType(e.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                    >
                      <option value="Savings">
                        Savings
                      </option>
                      <option value="Current">
                        Current
                      </option>
                      <option value="Salary">
                        Salary
                      </option>
                      <option value="Credit Card">
                        Credit Card
                      </option>
                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Last 4 Digits
                    </label>

                    <input
                      type="text"
                      value={accountNumberLast4}
                      onChange={(e) =>
                        setAccountNumberLast4(
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4)
                        )
                      }
                      required
                      maxLength={4}
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                      placeholder="1234"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Current Balance
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={balance}
                      onChange={(e) =>
                        setBalance(e.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                      placeholder="Enter balance"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Currency
                    </label>

                    <select
                      value={currency}
                      onChange={(e) =>
                        setCurrency(e.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                    >
                      <option value="INR">
                        INR - Indian Rupee
                      </option>
                      <option value="USD">
                        USD - US Dollar
                      </option>
                      <option value="EUR">
                        EUR - Euro
                      </option>
                      <option value="GBP">
                        GBP - British Pound
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 border-t border-slate-100 pt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update Account"
                      : "Add Account"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-slate-500">
                Loading bank accounts...
              </p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Building2
                size={42}
                className="mx-auto text-slate-400"
              />

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                No bank accounts yet
              </h2>

              <p className="mt-2 text-slate-500">
                Add a bank account before creating
                income or expense transactions.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <Building2 size={22} />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          {account.account_name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {account.bank_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(account)
                        }
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                      >
                        <Edit2 size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(account.id)
                        }
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        Type
                      </span>

                      <span className="font-medium text-slate-900">
                        {account.account_type}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        Account
                      </span>

                      <span className="font-medium text-slate-900">
                        ****
                        {account.account_number_last4}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        Balance
                      </span>

                      <span className="font-bold text-slate-900">
                        {account.currency}{" "}
                        {Number(
                          account.balance || 0
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BankAccounts;