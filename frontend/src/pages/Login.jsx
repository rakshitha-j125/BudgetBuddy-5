import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-[#080d2b] lg:flex">
          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                💳
              </div>

              <span className="text-xl font-bold text-white">
                BudgetBuddy
              </span>
            </div>

            <div className="max-w-xl">
              <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-blue-400">
                Smarter Money Management
              </p>

              <h1 className="text-5xl font-bold leading-tight text-white xl:text-6xl">
                Take control of your
                <br />
                money.
              </h1>

              <p className="mt-7 max-w-lg text-lg leading-8 text-slate-400">
                Track your income, manage expenses, plan budgets and
                understand your spending — all in one place.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
                    📊
                  </div>

                  <div>
                    <p className="font-semibold text-white">
                      Clear financial insights
                    </p>

                    <p className="text-sm text-slate-400">
                      Understand where your money goes.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
                    🛡️
                  </div>

                  <div>
                    <p className="font-semibold text-white">
                      Secure by design
                    </p>

                    <p className="text-sm text-slate-400">
                      Your financial data belongs to you.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-500">
              © 2026 BudgetBuddy
            </p>
          </div>
        </div>

        <div className="flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue to your dashboard.
              </p>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}