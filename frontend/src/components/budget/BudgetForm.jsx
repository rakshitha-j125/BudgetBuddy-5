import {
  useEffect,
  useState
} from "react";

import {
  createBudget,
  deleteBudget,
  getBudgets
} from "../../api/transactions";


const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Education",
  "Entertainment",
  "Miscellaneous"
];


export default function BudgetForm() {

  const [
    category,
    setCategory
  ] = useState("Food");

  const [
    monthlyLimit,
    setMonthlyLimit
  ] = useState("");

  const [
    monthYear,
    setMonthYear
  ] = useState(() =>
    new Date()
      .toISOString()
      .slice(0, 7)
  );

  const [
    budgets,
    setBudgets
  ] = useState([]);

  const [
    error,
    setError
  ] = useState("");


  const loadBudgets =
    async () => {

      try {

        const data =
          await getBudgets();

        setBudgets(data);

      } catch {

        setError(
          "Unable to load budgets."
        );

      }
    };


  useEffect(() => {

    loadBudgets();

  }, []);


  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");


      try {

        await createBudget({
          category,
          monthly_limit:
            Number(monthlyLimit),
          month_year:
            monthYear
        });


        setMonthlyLimit("");

        await loadBudgets();

      } catch (err) {

        setError(
          err.response?.data?.detail ||
          "Unable to create budget."
        );

      }
    };


  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Delete this budget?"
        )
      ) {
        return;
      }

      try {

        await deleteBudget(id);

        await loadBudgets();

      } catch {

        setError(
          "Unable to delete budget."
        );

      }
    };


  return (
    <div className="space-y-6">

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">
          {error}
        </div>
      )}


      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <div>

          <label className="label">
            Category
          </label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
            className="input"
          >

            {categories.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}

          </select>

        </div>


        <div>

          <label className="label">
            Monthly limit
          </label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            required
            value={monthlyLimit}
            onChange={(event) =>
              setMonthlyLimit(
                event.target.value
              )
            }
            placeholder="5000"
            className="input"
          />

        </div>


        <div>

          <label className="label">
            Month
          </label>

          <input
            type="month"
            required
            value={monthYear}
            onChange={(event) =>
              setMonthYear(
                event.target.value
              )
            }
            className="input"
          />

        </div>


        <button
          type="submit"
          className="w-full button-primary"
        >
          Create Budget
        </button>

      </form>


      <div className="pt-5 border-t border-slate-100">

        <h3 className="font-semibold text-slate-900 mb-4">
          Your budgets
        </h3>


        <div className="space-y-3">

          {budgets.map(
            (budget) => (

              <div
                key={budget.id}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50"
              >

                <div>

                  <p className="font-semibold">
                    {budget.category}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {budget.month_year}
                  </p>

                </div>


                <div className="flex items-center gap-4">

                  <p className="font-bold text-slate-800">
                    ₹
                    {Number(
                      budget.monthly_limit
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <button
                    onClick={() =>
                      handleDelete(
                        budget.id
                      )
                    }
                    className="text-slate-400 hover:text-red-600"
                  >
                    ×
                  </button>

                </div>

              </div>

            )
          )}


          {budgets.length === 0 && (
            <p className="text-sm text-slate-500">
              No budgets created yet.
            </p>
          )}

        </div>

      </div>

    </div>
  );
}