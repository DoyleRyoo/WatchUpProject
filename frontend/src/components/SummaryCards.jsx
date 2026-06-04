import { useMemo } from "react";
import useStockStore from "../store/useStockStore";

export default function SummaryCards() {
  const holdings = useStockStore((state) => state.holdings);
  const prices = useStockStore((state) => state.prices);
  const lastUpdate = useStockStore((state) => state.lastUpdate);
  const isConnected = useStockStore((state) => state.isConnected);

  const summary = useMemo(() => {
    if (!holdings || holdings.length === 0) {
      return {
        totalBuy: 0,
        totalAsset: 0,
        totalReturn: 0,
        totalProfit: 0,
      };
    }

    let totalBuy = 0;
    let totalAsset = 0;

    holdings.forEach((holding) => {
      const buyValue = holding.averagePrice * holding.quantity;
      totalBuy += buyValue;

      const currentPrice = prices[holding.stockCode]?.price || holding.averagePrice;
      const currentValue = currentPrice * holding.quantity;
      totalAsset += currentValue;
    });

    const totalProfit = totalAsset - totalBuy;
    const totalReturn = totalBuy > 0 ? (totalProfit / totalBuy) * 100 : 0;

    return {
      totalBuy,
      totalAsset,
      totalReturn,
      totalProfit,
    };
  }, [holdings, prices]);

  // Format last update time
  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return "Never";

    const date = new Date(timestamp);
    
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const cards = [
    {
      label: "TOTAL BUY",
      value: `₩${summary.totalBuy.toLocaleString()}`,
      color: "text-white",
    },
    {
      label: "TOTAL ASSET",
      value: `₩${summary.totalAsset.toLocaleString()}`,
      color: "text-white",
    },
    {
      label: "TOTAL RETURN",
      value: `${summary.totalReturn >= 0 ? "+" : ""}${summary.totalReturn.toFixed(2)}%`,
      color: summary.totalReturn >= 0 ? "text-red-500" : "text-blue-500",
    },
    {
      label: "TOTAL PROFIT",
      value: `${summary.totalProfit >= 0 ? "+" : ""}₩${Math.abs(summary.totalProfit).toLocaleString()}`,
      color: summary.totalProfit >= 0 ? "text-red-500" : "text-blue-500",
    },
  ];

  return (
    <div>
      {/* Live Status Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500 animate-pulse" : "bg-gray-500"
              }`}
            />
            <span className="text-sm text-zinc-400">
              {isConnected ? "Live" : "Disconnected"}
            </span>
          </div>
          {lastUpdate && (
            <span className="text-xs text-zinc-500">
              Last update: {formatLastUpdate(lastUpdate)}
            </span>
          )}
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <p className="text-sm text-zinc-400">{card.label}</p>

            <h3
              className={`text-2xl font-bold mt-3 transition-all duration-500 ${card.color}`}
            >
              {card.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

// Made with Bob
