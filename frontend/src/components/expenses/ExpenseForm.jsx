import {
  useState
} from "react";

import {
  createExpense
} from "../../api/transactions";


const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Education",
  "Entertainment",
  "Miscellaneous"
];


export default function ExpenseForm({
  onCreated
}) {

  const [
    category,
    setCategory
  ] = useState("Food");

  const [
    amount,
    setAmount
  ] = useState("");

  const [
    description,
    setDescription
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

        await createExpense({
          category,
          amount: Number(amount),
          description:
            description || null,
          date:
            new Date(
              `${date}T00:00:00`
            ).toISOString()
        });


        setAmount("");
        setDescription("");

        if (onCreated) {
          await onCreated();
        }

      } catch (err) {

        setError(
          err.response?.data?.detail ||
          "Unable to create expense."
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
          Description
        </label>

        <input
          type="text"
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
          placeholder="What did you spend on?"
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
          : "Add Expense"
        }
      </button>

    </form>
  );
}