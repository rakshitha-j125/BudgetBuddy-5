import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function DashboardCard({
  title,
  amount,
  icon: Icon,
  color,
  change,
  positive,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {amount}
          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center`}
        >
          <Icon className="text-white" size={28} />
        </div>

      </div>

      <div className="flex items-center gap-2 mt-6">

        {positive ? (
          <ArrowUpRight className="text-green-400" size={18} />
        ) : (
          <ArrowDownRight className="text-red-400" size={18} />
        )}

        <span
          className={`font-medium ${
            positive ? "text-green-400" : "text-red-400"
          }`}
        >
          {change}
        </span>

      </div>

    </div>
  );
}