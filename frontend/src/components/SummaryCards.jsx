export default function SummaryCards() {
  const cards = [
    "TOTAL BUY",
    "TOTAL ASSET",
    "TOTAL RETURN",
    "TOTAL PROFIT",
  ];

  return (
    <div
      className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-4
      gap-4
      "
    >
      {cards.map((card) => (
        <div
          key={card}
          className="
          p-5
          rounded-2xl
          bg-white/5
          border
          border-white/10
          hover:scale-105
          transition
          cursor-pointer
          "
        >
          <p
            className="
            text-sm
            text-zinc-400
            "
          >
            {card}
          </p>

          <h3
            className="
            text-2xl
            font-bold
            text-white
            mt-3
            "
          >
            ₩0
          </h3>
        </div>
      ))}
    </div>
  );
}