import {
  useEffect,
  useState
} from "react";

import {
  Pencil,
  Trash2
} from "lucide-react";

import {
  deleteExpense,
  getExpenses,
  updateExpense
} from "../../api/transactions";


export default function ExpenseList({
  refreshKey,
  onChanged
}) {

  const [
    expenses,
    setExpenses
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  const [
    editingId,
    setEditingId
  ] = useState(null);

  const [
    editAmount,
    setEditAmount
  ] = useState("");

  const [
    editCategory,
    setEditCategory
  ] = useState("Food");


  const loadExpenses =
    async () => {

      try {

        setLoading(true);

        const data =
          await getExpenses();

        setExpenses(data);

      } catch {

        setError(
          "Unable to load expenses."
        );

      } finally {

        setLoading(false);

      }
    };


  useEffect(() => {

    loadExpenses();

  }, [refreshKey]);


  const handleDelete =
    async (id) => {

      const confirmed =
        window.confirm(
          "Delete this expense?"
        );

      if (!confirmed) {
        return;
      }

      try {

        await deleteExpense(id);

        await loadExpenses();

        if (onChanged) {
          onChanged();
        }

      } catch {

        setError(
          "Unable to delete expense."
        );

      }
    };


  const startEdit =
    (expense) => {

      setEditingId(
        expense.id
      );

      setEditAmount(
        expense.amount
      );

      setEditCategory(
        expense.category
      );
    };


  const saveEdit =
    async (id) => {

      try {

        await updateExpense(
          id,
          {
            amount:
              Number(editAmount),
            category:
              editCategory
          }
        );

        setEditingId(null);

        await loadExpenses();

        if (onChanged) {
          onChanged();
        }

      } catch {

        setError(
          "Unable to update expense."
        );

      }
    };


  if (loading) {

    return (
      <div className="py-12 text-center text-slate-500">
        Loading expenses...
      </div>
    );
  }


  return (
    <div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl">
          {error}
        </div>
      )}


      {expenses.length === 0 ? (

        <div className="py-12 text-center">

          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Trash2 size={22} />
          </div>

          <p className="font-semibold text-slate-800 mt-4">
            No expenses yet
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Add your first expense to start tracking.
          </p>

        </div>

      ) : (

        <div className="space-y-3">

          {expenses.map(
            (expense) => (

              <div
                key={expense.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition"
              >

                <div>

                  {editingId === expense.id ? (

                    <div className="flex gap-2">

                      <input
                        value={editCategory}
                        onChange={(event) =>
                          setEditCategory(
                            event.target.value
                          )
                        }
                        className="border rounded-lg px-2 py-1 text-sm"
                      />

                      <input
                        type="number"
                        value={editAmount}
                        onChange={(event) =>
                          setEditAmount(
                            event.target.value
                          )
                        }
                        className="border rounded-lg px-2 py-1 text-sm w-24"
                      />

                    </div>

                  ) : (

                    <>

                      <p className="font-semibold text-slate-800">
                        {expense.description ||
                          expense.category}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {expense.category}
                        {" • "}
                        {new Date(
                          expense.date
                        ).toLocaleDateString()}
                      </p>

                    </>

                  )}

                </div>


                <div className="flex items-center gap-3">

                  {editingId === expense.id ? (

                    <button
                      onClick={() =>
                        saveEdit(
                          expense.id
                        )
                      }
                      className="text-sm font-semibold text-blue-600"
                    >
                      Save
                    </button>

                  ) : (

                    <p className="font-bold text-red-600">
                      -₹
                      {Number(
                        expense.amount
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  )}


                  {editingId !== expense.id && (

                    <button
                      onClick={() =>
                        startEdit(expense)
                      }
                      className="text-slate-400 hover:text-blue-600"
                    >
                      <Pencil size={17} />
                    </button>

                  )}


                  <button
                    onClick={() =>
                      handleDelete(
                        expense.id
                      )
                    }
                    className="text-slate-400 hover:text-red-600"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}