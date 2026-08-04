const BudgetProgress = () => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="text-xl font-bold">
        Budget Progress
      </h2>

      <div className="mt-8">

        <div className="mb-2 flex justify-between">

          <span>Monthly Budget</span>

          <span>₹80,000</span>

        </div>

        <div className="h-4 rounded-full bg-slate-200">

          <div className="h-4 w-3/4 rounded-full bg-indigo-600"></div>

        </div>

        <div className="mt-3 flex justify-between text-sm text-slate-500">

          <span>Spent ₹60,000</span>

          <span>75%</span>

        </div>

      </div>

    </div>
  );
};

export default BudgetProgress;