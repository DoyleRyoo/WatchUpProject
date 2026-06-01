export default function ChartPanel({
  selectedStock,
}) {
  if (!selectedStock) return null;

  return (
    <div
      className="
      h-full
      bg-slate-900
      border
      border-slate-800
      rounded-3xl
      p-6
      "
    >
      <h2 className="text-2xl font-bold text-white">
        {selectedStock.name}
      </h2>

      <p className="mt-3 text-red-400">
        +7.14%
      </p>

      <div
        className="
        mt-8
        h-[500px]
        rounded-2xl
        border
        border-dashed
        border-slate-700
        flex
        items-center
        justify-center
        text-slate-500
        "
      >
        Chart Area
      </div>
    </div>
  );
}