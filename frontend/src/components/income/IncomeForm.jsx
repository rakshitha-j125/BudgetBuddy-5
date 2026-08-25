import {
  useState
} from "react";

import {
  createIncome
} from "../../api/transactions";


export default function IncomeForm({
  onCreated
}) {

  const [
    source,
    setSource
  ] = useState("");

  const [
    amount,
    setAmount
  ] = useState("");

  const [
    notes,
    setNotes
  ] = useState("");

  const [
    date,
    setDate
  ] = useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );

  const [
    error,
    setError
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(false);


  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");

      if (
        Number(amount) <= 0
      ) {

        setError(
          "Amount must be greater than zero."
        );

        return;
      }


      setLoading(true);


      try {

        await createIncome({
          source,
          amount: Number(amount),
          notes:
            notes || null,
          date:
            new Date(
              `${date}T00:00:00`
            ).toISOString()
        });


        setSource("");
        setAmount("");
        setNotes("");

        if (onCreated) {
          await onCreated();
        }

      } catch (err) {

        setError(
          err.response?.data?.detail ||
          "Unable to create income."
        );

      } finally {

        setLoading(false);

      }
    };


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">
          {error}
        </div>
      )}


      <div>

        <label className="label">
          Source
        </label>

        <input
          type="text"
          required
          value={source}
          onChange={(event) =>
            setSource(
              event.target.value
            )
          }
          placeholder="Salary, Freelance, etc."
          className="input"
        />

      </div>


      <div>

        <label className="label">
          Amount
        </label>

        <input
          type="number"
          min="0.01"
          step="0.01"
          required
          value={amount}
          onChange={(event) =>
            setAmount(
              event.target.value
            )
          }
          placeholder="0.00"
          className="input"
        />

      </div>


      <div>

        <label className="label">
          Notes
        </label>

        <input
          type="text"
          value={notes}
          onChange={(event) =>
            setNotes(
              event.target.value
            )
          }
          placeholder="Optional notes"
          className="input"
        />

      </div>


      <div>

        <label className="label">
          Date
        </label>

        <input
          type="date"
          required
          value={date}
          onChange={(event) =>
            setDate(
              event.target.value
            )
          }
          className="input"
        />

      </div>


      <button
        type="submit"
        disabled={loading}
        className="w-full button-primary"
      >
        {loading
          ? "Adding..."
          : "Add Income"
        }
      </button>

    </form>
  );
}