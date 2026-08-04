import { Link } from "react-router-dom";
import { Wallet, ShieldCheck, TrendingUp } from "lucide-react";

import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10">

        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">

          {/* Left Section */}

          <div className="hidden flex-col justify-between bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600 p-12 text-white lg:flex">

            <div>

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-white/20 p-3">

                  <Wallet size={34} />

                </div>

                <div>

                  <h1 className="text-3xl font-bold">
                    BudgetBuddy
                  </h1>

                  <p className="text-blue-100">
                    Smart Personal Finance
                  </p>

                </div>

              </div>

              <h2 className="mt-12 text-5xl font-bold leading-tight">

                Manage your

                <br />

                money with

                <br />

                confidence.

              </h2>

              <p className="mt-6 text-lg text-blue-100">

                Track income, monitor expenses,

                build budgets and gain insights

                into your financial future.

              </p>

            </div>

            <div className="space-y-5">

              <Feature
                icon={ShieldCheck}
                title="Secure Authentication"
                desc="Protected with JWT authentication."
              />

              <Feature
                icon={TrendingUp}
                title="Financial Analytics"
                desc="Visualize your spending habits."
              />

            </div>

          </div>

          {/* Right Section */}

          <div className="flex items-center justify-center bg-slate-50 p-8 lg:p-14">

            <LoginForm />

          </div>

        </div>

      </div>

    </div>
  );
};

const Feature = ({ icon: Icon, title, desc }) => {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-white/10 p-4">

      <div className="rounded-lg bg-white/20 p-3">

        <Icon size={24} />

      </div>

      <div>

        <h3 className="font-semibold">

          {title}

        </h3>

        <p className="text-sm text-blue-100">

          {desc}

        </p>

      </div>

    </div>
  );
};

export default Login;