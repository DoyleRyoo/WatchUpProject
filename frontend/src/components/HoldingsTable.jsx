import { useState, useEffect } from "react";

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

    document.addEventListener(
      "click",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, []);

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
    <table className="w-full text-white text-center">
      <thead>
        <tr>
          <th>NAME</th>
          <th>AVG</th>
          <th>AMOUNT</th>
          <th>CURRENT</th>
          <th>RETURN</th>
          <th> </th>
        </tr>
      </thead>

      <tbody>
        {holdings.map((stock) => {
          const currentPrice = prices[stock.stockCode]?.price || 0;

          const returnRate = currentPrice
            ? (
              ((currentPrice - stock.averagePrice) / stock.averagePrice) * 100
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

              <td className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    setOpenMenuId(
                      openMenuId === stock.id
                        ? null
                        : stock.id
                    );
                  }}
                  className="
                  w-8
                  h-8

                  rounded-lg

                  hover:bg-zinc-700

                  transition
                  "
                >
                  ⋮
                </button>

                <HoldingOptionMenu
                  stock={stock}
                  open={openMenuId === stock.id}
                  onClose={() =>
                    setOpenMenuId(null)
                  }
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
