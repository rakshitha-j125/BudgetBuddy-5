import {
  PieChart,
  Pie,
  Cell,
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
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={120}
          innerRadius={70}
          paddingAngle={4}
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index]}
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}