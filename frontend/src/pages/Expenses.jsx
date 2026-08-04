import DashboardLayout from "../layouts/DashboardLayout";

const Expenses = () => {
  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Expenses</h1>

        <p className="mt-3 text-slate-500">
          Track your daily expenses.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Expenses;