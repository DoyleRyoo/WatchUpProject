const stocks = [
  {
    id: 1,
    name: "삼성전자",
    avg: "70,000",
    qty: 10,
    current: "75,000",
    profit: "+7.14%",
    asset: "750,000",
  },
  {
    id: 2,
    name: "SK하이닉스",
    avg: "180,000",
    qty: 3,
    current: "200,000",
    profit: "+11.11%",
    asset: "600,000",
  },
];

export default function StockTable({
  onSelectStock,
  isChartOpen,
}) {
  return (
    <div
      className="
      bg-slate-900
      border
      border-slate-800
      rounded-3xl
      overflow-hidden
      "
    >
      <table className="w-full">
        <thead className="bg-slate-950">
          <tr>
            <th className="p-4 text-left">NAME</th>
            <th className="p-4">AVG</th>
            <th className="p-4">QTY</th>
            <th className="p-4">CURRENT</th>
            <th className="p-4">RETURN</th>
            <th className="p-4">ASSET</th>
          </tr>
        </thead>

        <tbody>
          {stocks.map((stock) => (
            <tr
              key={stock.id}
              onClick={() => onSelectStock(stock)}
              className="
              border-t
              border-slate-800
              cursor-pointer
              hover:bg-slate-800
              transition
              "
            >
              <td className="p-4">{stock.name}</td>
              <td className="p-4 text-center">
                {stock.avg}
              </td>
              <td className="p-4 text-center">
                {stock.qty}
              </td>
              <td className="p-4 text-center text-red-400">
                {stock.current}
              </td>
              <td className="p-4 text-center text-red-400">
                {stock.profit}
              </td>
              <td className="p-4 text-center">
                {stock.asset}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}