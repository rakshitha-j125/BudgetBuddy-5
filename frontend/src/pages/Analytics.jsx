import DashboardLayout from "../layouts/DashboardLayout";

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Analytics</h1>

        <p className="mt-3 text-slate-500">
          View financial insights and reports.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;