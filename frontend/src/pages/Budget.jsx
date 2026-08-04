import DashboardLayout from "../layouts/DashboardLayout";

const Budget = () => {
  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Budget</h1>

        <p className="mt-3 text-slate-500">
          Create and manage monthly budgets.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Budget;