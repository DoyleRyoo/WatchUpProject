import { useState } from "react";

import Header from "../components/Header";
import SummaryCards from "../components/SummaryCards";
import StockTable from "../components/StockTable";
import ChartPanel from "../components/ChartPanel";

export default function DashboardPage() {
  const [selectedStock, setSelectedStock] =
    useState(null);

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <Header />

      <main
        className="
        max-w-7xl
        mx-auto
        p-6
        space-y-6
        "
      >
        <SummaryCards />

        <div
          className="
          flex
          gap-6
          transition-all
          duration-500
          "
        >
          <div
            className={
              selectedStock
                ? "w-[45%]"
                : "w-full"
            }
          >
            <StockTable
              isChartOpen={!!selectedStock}
              onSelectStock={setSelectedStock}
            />
          </div>

          {selectedStock && (
            <div className="w-[55%]">
              <ChartPanel
                selectedStock={selectedStock}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}