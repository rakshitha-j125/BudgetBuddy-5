import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Food", value: 32 },
  { name: "Travel", value: 18 },
  { name: "Shopping", value: 24 },
  { name: "Bills", value: 16 },
  { name: "Others", value: 10 },
];

const COLORS = [
  "#7C3AED",
  "#06B6D4",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
];

export default function ExpensePieChart() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-6 text-xl font-bold text-slate-800">
        Expense Distribution
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}