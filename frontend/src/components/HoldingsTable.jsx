import useStockStore from "../store/useStockStore";

export default function HoldingsTable() {
  const {
    holdings,
    selectedStock,
    setSelectedStock,
    clearSelectedStock,
  } = useStockStore();

  const prices = useStockStore(
    (state) => state.prices
  );

  if (!holdings?.length) {
    return (
      <div
        className="
        text-center
        text-zinc-400
        py-20
        "
      >
        아직 보유한 주식이 없어요!
      </div>
    );
  }

  return (
    <table
      className="
      w-full
      text-white
      "
    >
      <thead>
        <tr>
          <th>NAME</th>
          <th>AVG</th>
          <th>AMOUNT</th>
          <th>CURRENT</th>
          <th>RETURN</th>
        </tr>
      </thead>

      <tbody>
        {holdings.map((stock) => {
          const currentPrice = prices[item.stockCode]?.price || 0;

          const returnRate = currentPrice
            ? (
              ((currentPrice - item.averagePrice) / item.averagePrice) * 100
            ).toFixed(2) 
            : 0;

          return (
            <tr
              key={stock.id}
              onClick={() => {
                if (
                  selectedStock?.id === stock.id
                ) {
                  clearSelectedStock();
                } else {
                  setSelectedStock(stock);
                }
              }}
              className="
              cursor-pointer
              hover:bg-white/5
              "
            >
              <td>{stock.stockName}</td>
              <td>{stock.averagePrice}</td>
              <td>{stock.quantity}</td>
              <td>
                {currentPrice
                  ? currentPrice.toLocaleString()
                  : "-"}
              </td>
              <td
                className={
                  Number(returnRate) >= 0
                    ? "text-red-500"
                    : "text-blue-500"
                }
              >
                {returnRate}%
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  );
}