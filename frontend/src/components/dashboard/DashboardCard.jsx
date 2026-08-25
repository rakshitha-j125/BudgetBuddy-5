import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

export default function DashboardCard({
  title,
  amount,
  icon: Icon,
  color = "bg-indigo-600",
  change = "",
  positive = true,
}) {
  return (
    <div className="rounded-2xl bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            {amount}
          </h2>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${color}`}
        >
          <Icon
            className="text-white"
            size={28}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        {positive ? (
          <ArrowUpRight
            className="text-green-400"
            size={18}
          />
        ) : (
          <ArrowDownRight
            className="text-red-400"
            size={18}
          />
        )}

        <span
          className={`font-medium ${
            positive
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}