import {
  useEffect,
  useState
} from "react";

import {
  Trash2
} from "lucide-react";

import {
  deleteIncome,
  getIncomes
} from "../../api/transactions";


export default function IncomeList({
  refreshKey,
  onChanged
}) {

  const [
    incomes,
    setIncomes
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");


  const loadIncomes =
    async () => {

      try {

        setLoading(true);

        const data =
          await getIncomes();

        setIncomes(data);

      } catch {

        setError(
          "Unable to load income."
        );

      } finally {

        setLoading(false);

      }
    };


  useEffect(() => {

    loadIncomes();

  }, [refreshKey]);


  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Delete this income?"
        )
      ) {
        return;
      }

      try {

        await deleteIncome(id);

        await loadIncomes();

        if (onChanged) {
          onChanged();
        }

      } catch {

        setError(
          "Unable to delete income."
        );

      }
    };


  if (loading) {

    return (
      <div className="py-12 text-center text-slate-500">
        Loading income...
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


      {incomes.length === 0 ? (

        <div className="py-12 text-center">

          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <WalletIcon />
          </div>

          <p className="font-semibold text-slate-800 mt-4">
            No income recorded
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Add your first income source.
          </p>

        </div>

      ) : (

        <div className="space-y-3">

          {incomes.map(
            (income) => (

              <div
                key={income.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100"
              >

                <div>

                  <p className="font-semibold text-slate-800">
                    {income.source}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(
                      income.date
                    ).toLocaleDateString()}
                  </p>

                </div>


                <div className="flex items-center gap-4">

                  <p className="font-bold text-emerald-600">
                    +₹
                    {Number(
                      income.amount
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <button
                    onClick={() =>
                      handleDelete(
                        income.id
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


function WalletIcon() {

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 7V6a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v8a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V7" />
      <path d="M16 13h2" />
    </svg>
  );
}