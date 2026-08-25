import {
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  Wallet,
} from "lucide-react";

const cards = [
  {
    title: "Balance",
    amount: "₹45,800",
    icon: Wallet,
    color: "bg-indigo-600",
  },
  {
    title: "Income",
    amount: "₹80,000",
    icon: ArrowDownCircle,
    color: "bg-green-600",
  },
  {
    title: "Expenses",
    amount: "₹34,200",
    icon: ArrowUpCircle,
    color: "bg-red-600",
  },
  {
    title: "Savings",
    amount: "₹45,800",
    icon: PiggyBank,
    color: "bg-blue-600",
  },
];

const SummaryCards = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-800">
                  {card.amount}
                </h2>
              </div>

              <div
                className={`${card.color} rounded-xl p-3 text-white`}
              >
                <Icon size={28} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;