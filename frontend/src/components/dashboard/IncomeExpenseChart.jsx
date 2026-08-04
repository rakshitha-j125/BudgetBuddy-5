import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", income: 42000, expense: 28000 },
  { month: "Feb", income: 45000, expense: 30000 },
  { month: "Mar", income: 47000, expense: 33000 },
  { month: "Apr", income: 52000, expense: 36000 },
  { month: "May", income: 55000, expense: 39000 },
  { month: "Jun", income: 60000, expense: 42000 },
];

export default function IncomeExpenseChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
          </linearGradient>

          <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

        <XAxis dataKey="month" stroke="#CBD5E1" />

        <YAxis stroke="#CBD5E1" />

        <Tooltip />

        <Area
          type="monotone"
          dataKey="income"
          stroke="#22C55E"
          fillOpacity={1}
          fill="url(#income)"
        />

        <Area
          type="monotone"
          dataKey="expense"
          stroke="#EF4444"
          fillOpacity={1}
          fill="url(#expense)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}