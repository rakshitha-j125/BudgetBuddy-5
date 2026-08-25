import { useEffect, useState } from "react";
import { Target, Trash2, Plus } from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import api from "../api/axios";

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const [contributionGoalId, setContributionGoalId] =
    useState(null);
  const [contributionAmount, setContributionAmount] =
    useState("");
  const [selectedBankAccount, setSelectedBankAccount] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contributing, setContributing] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadGoals = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/savings-goals/"
      );

      setGoals(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to load savings goals."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadBankAccounts = async () => {
    try {
      const response = await api.get(
        "/bank-accounts/"
      );

      setBankAccounts(response.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to load bank accounts."
      );
    }
  };

  useEffect(() => {
    loadGoals();
    loadBankAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      !name.trim() ||
      !targetAmount ||
      !deadline
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setSaving(true);

      await api.post("/savings-goals/", {
        name: name.trim(),
        target_amount: Number(targetAmount),
        deadline: new Date(
          deadline
        ).toISOString(),
      });

      setName("");
      setTargetAmount("");
      setDeadline("");

      setMessage(
        "Savings goal created successfully."
      );

      await loadGoals();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to create savings goal."
      );
    } finally {
      setSaving(false);
    }
  };

  const openContribution = (goal) => {
    setContributionGoalId(goal.id);
    setContributionAmount("");
    setSelectedBankAccount("");

    setError("");
    setMessage("");
  };

  const closeContribution = () => {
    setContributionGoalId(null);
    setContributionAmount("");
    setSelectedBankAccount("");
  };

  const handleContribution = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      !contributionAmount ||
      Number(contributionAmount) <= 0
    ) {
      setError(
        "Contribution amount must be greater than zero."
      );
      return;
    }

    if (!selectedBankAccount) {
      setError(
        "Please select a bank account."
      );
      return;
    }

    const goal = goals.find(
      (item) => item.id === contributionGoalId
    );

    if (!goal) {
      setError("Savings goal not found.");
      return;
    }

    const remaining =
      Number(goal.target_amount) -
      Number(goal.current_amount);

    if (
      Number(contributionAmount) > remaining
    ) {
      setError(
        `Maximum contribution allowed is ₹${remaining.toLocaleString(
          "en-IN"
        )}.`
      );
      return;
    }

    try {
      setContributing(true);

      await api.post(
        `/savings-goals/${contributionGoalId}/contribute`,
        {
          amount: Number(contributionAmount),
          bank_account_id: Number(
            selectedBankAccount
          ),
        }
      );

      setMessage(
        "Contribution added successfully."
      );

      closeContribution();

      await loadGoals();
      await loadBankAccounts();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to add contribution."
      );
    } finally {
      setContributing(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      setMessage("");

      await api.delete(
        `/savings-goals/${id}`
      );

      setGoals((current) =>
        current.filter(
          (goal) => goal.id !== id
        )
      );

      setMessage(
        "Savings goal deleted successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to delete savings goal."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <Topbar />

        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Savings Goals
            </h1>

            <p className="mt-2 text-slate-500">
              Set and track your financial savings goals.
            </p>
          </div>

          {message && (
            <div className="mb-6 max-w-5xl rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 max-w-5xl rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Create Goal */}
          <div className="max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3">
                <Target
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Create Savings Goal
                </h2>

                <p className="text-sm text-slate-500">
                  Define a target and deadline.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-4 md:grid-cols-3"
            >
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Goal Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="New Laptop"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Target Amount
                </label>

                <input
                  type="number"
                  min="1"
                  value={targetAmount}
                  onChange={(e) =>
                    setTargetAmount(e.target.value)
                  }
                  placeholder="50000"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">
                  Deadline
                </label>

                <input
                  type="date"
                  value={deadline}
                  onChange={(e) =>
                    setDeadline(e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving
                    ? "Creating..."
                    : "+ Create Goal"}
                </button>
              </div>
            </form>
          </div>

          {/* Goals */}
          <div className="mt-6 max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              My Savings Goals
            </h2>

            {loading ? (
              <p className="py-10 text-center text-slate-500">
                Loading goals...
              </p>
            ) : goals.length === 0 ? (
              <p className="py-10 text-center text-slate-500">
                No savings goals yet.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {goals.map((goal) => {
                  const target =
                    Number(goal.target_amount);

                  const current =
                    Number(goal.current_amount);

                  const progress =
                    target > 0
                      ? Math.min(
                          (current / target) * 100,
                          100
                        )
                      : 0;

                  const remaining = Math.max(
                    target - current,
                    0
                  );

                  const completed =
                    current >= target;

                  return (
                    <div
                      key={goal.id}
                      className="rounded-xl bg-slate-50 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-slate-900">
                            {goal.name}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Target: ₹
                            {target.toLocaleString(
                              "en-IN"
                            )}
                          </p>

                          <p className="text-sm text-slate-500">
                            Saved: ₹
                            {current.toLocaleString(
                              "en-IN"
                            )}
                          </p>

                          <p className="text-sm text-slate-500">
                            Remaining: ₹
                            {remaining.toLocaleString(
                              "en-IN"
                            )}
                          </p>

                          <p className="text-sm text-slate-500">
                            Deadline:{" "}
                            {goal.deadline
                              ? new Date(
                                  goal.deadline
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "No deadline"}
                          </p>

                          {/* Progress */}
                          <div className="mt-4">
                            <div className="mb-1 flex justify-between text-xs font-medium text-slate-500">
                              <span>
                                Progress
                              </span>

                              <span>
                                {progress.toFixed(0)}%
                              </span>
                            </div>

                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-blue-600 transition-all"
                                style={{
                                  width: `${progress}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          {!completed && (
                            <button
                              type="button"
                              onClick={() =>
                                openContribution(goal)
                              }
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              <Plus size={16} />
                              Contribute
                            </button>
                          )}

                          {completed && (
                            <span className="rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-700">
                              Goal Completed
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(goal.id)
                            }
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                            title="Delete goal"
                          >
                            <Trash2 size={19} />
                          </button>
                        </div>
                      </div>

                      {/* Contribution Form */}
                      {contributionGoalId ===
                        goal.id && (
                        <form
                          onSubmit={
                            handleContribution
                          }
                          className="mt-5 rounded-xl border border-blue-100 bg-white p-5"
                        >
                          <div className="mb-4">
                            <h4 className="font-semibold text-slate-900">
                              Add Contribution
                            </h4>

                            <p className="mt-1 text-xs text-slate-500">
                              Add money to this goal from
                              one of your bank accounts.
                            </p>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="text-sm font-medium text-slate-600">
                                Contribution Amount
                              </label>

                              <input
                                type="number"
                                min="1"
                                max={remaining}
                                step="0.01"
                                value={
                                  contributionAmount
                                }
                                onChange={(e) =>
                                  setContributionAmount(
                                    e.target.value
                                  )
                                }
                                placeholder={String(
                                  remaining
                                )}
                                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                              />

                              <p className="mt-1 text-xs text-slate-400">
                                Maximum: ₹
                                {remaining.toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-slate-600">
                                From Bank Account
                              </label>

                              <select
                                value={
                                  selectedBankAccount
                                }
                                onChange={(e) =>
                                  setSelectedBankAccount(
                                    e.target.value
                                  )
                                }
                                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                              >
                                <option value="">
                                  Select bank account
                                </option>

                                {bankAccounts
                                  .filter(
                                    (account) =>
                                      account.is_active
                                  )
                                  .map((account) => (
                                    <option
                                      key={account.id}
                                      value={account.id}
                                    >
                                      {account.bank_name} -{" "}
                                      {account.account_name}{" "}
                                      (₹
                                      {Number(
                                        account.balance
                                      ).toLocaleString(
                                        "en-IN"
                                      )}
                                      )
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-3">
                            <button
                              type="submit"
                              disabled={
                                contributing
                              }
                              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                              {contributing
                                ? "Adding..."
                                : "Add Contribution"}
                            </button>

                            <button
                              type="button"
                              onClick={
                                closeContribution
                              }
                              disabled={
                                contributing
                              }
                              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SavingsGoals;