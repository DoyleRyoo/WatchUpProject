import { useState, useEffect, useMemo } from "react";

import useStockStore from "../store/useStockStore";

import HoldingOptionMenu from "./HoldingOptionMenu";

export default function HoldingsTable() {
  const {
    holdings,
    selectedStock,
    setSelectedStock,
    clearSelectedStock,
  } = useStockStore();

  const prices = useStockStore((state) => state.prices);

  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Calculate enriched holdings data with real-time prices
  const enrichedHoldings = useMemo(() => {
    if (!holdings || holdings.length === 0) return [];

    return holdings.map((stock) => {
      const currentPrice = prices[stock.stockCode]?.price || stock.averagePrice;
      const evaluationAmount = currentPrice * stock.quantity;
      const profit = (currentPrice - stock.averagePrice) * stock.quantity;
      const returnRate = stock.averagePrice > 0
        ? ((currentPrice - stock.averagePrice) / stock.averagePrice) * 100
        : 0;

      return {
        ...stock,
        currentPrice,
        evaluationAmount,
        profit,
        returnRate,
      };
    });
  }, [holdings, prices]);

  if (!holdings?.length) {
    return (
      <div className="text-center text-zinc-400 py-20">
        아직 보유한 주식이 없어요!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-white text-center">
        <thead>
          <tr className="border-b border-white/10">
            <th className="pb-3 text-sm font-medium text-zinc-400">NAME</th>
            <th className="pb-3 text-sm font-medium text-zinc-400">AVG</th>
            <th className="pb-3 text-sm font-medium text-zinc-400">QTY</th>
            <th className="pb-3 text-sm font-medium text-zinc-400">CURRENT</th>
            <th className="pb-3 text-sm font-medium text-zinc-400">EVAL</th>
            <th className="pb-3 text-sm font-medium text-zinc-400">RETURN</th>
            <th className="pb-3 text-sm font-medium text-zinc-400"> </th>
          </tr>
        </thead>

        <tbody>
          {enrichedHoldings.map((stock) => {
            const isPositive = stock.returnRate >= 0;

            return (
              <tr
                key={stock.id}
                onClick={() => {
                  if (selectedStock?.id === stock.id) {
                    clearSelectedStock();
                  } else {
                    setSelectedStock(stock);
                  }
                }}
                className={`cursor-pointer hover:bg-white/5 transition-all duration-200 border-b border-white/5
                  ${selectedStock?.id === stock.id ? "bg-white/10" : ""}
                `}
              >
                <td className="py-4 font-medium">{stock.stockName}</td>
                <td className="py-4 text-zinc-300">
                  ₩{stock.averagePrice.toLocaleString()}
                </td>
                <td className="py-4 text-zinc-300">{stock.quantity}</td>
                <td className="py-4 font-semibold transition-all duration-500">
                  {stock.currentPrice
                    ? `₩${stock.currentPrice.toLocaleString()}`
                    : "-"}
                </td>
                <td className="py-4 font-medium text-zinc-200 transition-all duration-500">
                  ₩{stock.evaluationAmount.toLocaleString()}
                </td>
                <td
                  className={`py-4 font-bold transition-all duration-500
                    ${isPositive ? "text-red-500" : "text-blue-500"}
                  `}
                >
                  {isPositive ? "+" : ""}
                  {stock.returnRate.toFixed(2)}%
                </td>

                <td
                  className="py-4 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-8 h-8 rounded-lg hover:bg-zinc-700 transition"
                    onClick={(e) => {
                      e.stopPropagation();

                      setOpenMenuId(
                        openMenuId === stock.id ? null : stock.id
                      );
                    }}
                  >
                    ⋮
                  </button>

                  <HoldingOptionMenu
                    stock={stock}
                    open={openMenuId === stock.id}
                    onClose={() => setOpenMenuId(null)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Made with Bob
