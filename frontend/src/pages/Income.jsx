import DashboardLayout from "../layouts/DashboardLayout";

const Income = () => {
  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Income</h1>

        <p className="mt-3 text-slate-500">
          Manage all your income sources here.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Income;