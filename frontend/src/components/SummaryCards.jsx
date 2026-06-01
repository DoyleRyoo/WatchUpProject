import { motion } from "framer-motion";

const cards = [
  {
    title: "TOTAL BUY",
    value: "₩12,000,000",
  },
  {
    title: "TOTAL ASSET",
    value: "₩13,850,000",
  },
  {
    title: "TOTAL RETURN",
    value: "+15.42%",
  },
  {
    title: "TOTAL PROFIT",
    value: "₩1,850,000",
  },
];

export default function SummaryCards() {
  return (
    <div
      className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-4
      gap-5
      "
    >
      {cards.map((card) => (
        <motion.div
          whileHover={{
            y: -4,
          }}
          key={card.title}
          className="
          bg-slate-900
          border
          border-slate-800
          rounded-3xl
          p-6
          shadow-lg
          "
        >
          <p className="text-slate-400 text-sm">
            {card.title}
          </p>

          <h3 className="mt-3 text-2xl font-bold text-white">
            {card.value}
          </h3>
        </motion.div>
      ))}
    </div>
  );
}