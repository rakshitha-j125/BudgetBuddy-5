import DashboardLayout from "../layouts/DashboardLayout";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-8 shadow">

        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="mt-3 text-slate-500">
          Application settings will appear here.
        </p>

      </div>
    </DashboardLayout>
  );
};

export default Settings;