import DashboardLayout from "../layouts/DashboardLayout";

import SummaryCards from "../components/dashboard/SummaryCards";
import IncomeChart from "../components/dashboard/IncomeChart";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import BudgetProgress from "../components/dashboard/BudgetProgress";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="text-slate-500">
            Welcome back 👋
          </p>
        </div>

        <SummaryCards />

        <div className="grid gap-6 lg:grid-cols-2">

          <IncomeChart />

          <ExpenseChart />

        </div>

        <BudgetProgress />

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;