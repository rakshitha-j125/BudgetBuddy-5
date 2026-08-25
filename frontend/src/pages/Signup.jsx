import SignupForm from "../components/auth/SignupForm";

export default function Signup() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-[#080d2b] lg:flex">
          <div className="flex w-full flex-col justify-between p-12 xl:p-16">
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
                Build better
                <br />
                money habits.
              </h1>

              <p className="mt-7 max-w-lg text-lg leading-8 text-slate-400">
                Start managing your income, expenses and budgets
                with a simple financial workspace designed for you.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                    📊
                  </div>

                  <div>
                    <p className="font-semibold text-white">
                      Understand your spending
                    </p>

                    <p className="text-sm text-slate-400">
                      See where your money goes every month.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                    🎯
                  </div>

                  <div>
                    <p className="font-semibold text-white">
                      Plan with confidence
                    </p>

                    <p className="text-sm text-slate-400">
                      Create budgets and stay on track.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                    🔒
                  </div>

                  <div>
                    <p className="font-semibold text-white">
                      Secure by design
                    </p>

                    <p className="text-sm text-slate-400">
                      Your financial information stays protected.
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

        <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-xl">
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 md:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">
                  Create your account
                </h2>

                <p className="mt-2 text-base text-slate-500">
                  Start managing your finances today.
                </p>
              </div>

              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}