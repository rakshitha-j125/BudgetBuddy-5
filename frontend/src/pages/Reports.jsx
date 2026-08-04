import DashboardLayout from "../layouts/DashboardLayout";

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Reports</h1>

        <p className="mt-3 text-slate-500">
          Download and view financial reports.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Reports;