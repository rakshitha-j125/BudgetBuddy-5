const BudgetProgress = ({ data }) => {
  const budget = data?.total_budget || 0;
  const spent = data?.total_expense || 0;

  const percentage = Math.min(
    Math.max(data?.budget_used_percent || 0, 0),
    100
  );

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="text-xl font-bold">
        Budget Progress
      </h2>

      <div className="mt-8">
        <div className="mb-2 flex justify-between">
          <span>Monthly Budget</span>

          <span>
            ₹{budget.toLocaleString()}
          </span>
        </div>

        <div className="h-4 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${
              percentage >= 90
                ? "bg-red-500"
                : percentage >= 70
                ? "bg-yellow-500"
                : "bg-indigo-600"
            }`}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <div className="mt-3 flex justify-between text-sm text-slate-500">
          <span>
            Spent ₹{spent.toLocaleString()}
          </span>

          <span>{percentage.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetProgress;