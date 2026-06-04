import { useEffect } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import SummaryCards from "../components/SummaryCards";
import HoldingsTable from "../components/HoldingsTable";
import StockChartPanel from "../components/StockChartPanel";

import useStockStore from "../store/useStockStore";

import { auth } from "../services/firebase";

import { getHoldings } from "../services/firestoreService";

import { setupSocketListeners, trackSymbols } from "../services/socket";

import AddStockButton from "../components/AddStockButton";
import AddStockModal from "../modals/AddStockModal";

import SellStockModal from "../modals/SellStockModal";
import DeleteStockModal from "../modals/DeleteStockModal";

export default function DashboardPage() {
  const {
    selectedStock,
    setHoldings,
    handleBatchUpdate,
    setConnected,
    getHoldingSymbols,
    holdings,
  } = useStockStore();

  // Setup socket listeners for real-time updates
  useEffect(() => {
    const cleanup = setupSocketListeners(
      // On batch update
      (data) => {
        handleBatchUpdate(data);
      },
      // On connect
      () => {
        setConnected(true);
        // Re-register symbols when reconnected
        const symbols = getHoldingSymbols();
        if (symbols.length > 0) {
          trackSymbols(symbols);
        }
      },
      // On disconnect
      () => {
        setConnected(false);
      }
    );

    return cleanup;
  }, [handleBatchUpdate, setConnected, getHoldingSymbols]);

  // Load holdings from Firestore
  useEffect(() => {
    const load = async () => {
      const uid = auth.currentUser?.uid;

      if (!uid) return;

      const data = await getHoldings(uid);

      setHoldings(data);
    };

    load();
  }, [setHoldings]);

  // Track symbols when holdings change
  useEffect(() => {
    if (holdings && holdings.length > 0) {
      const symbols = getHoldingSymbols();
      if (symbols.length > 0) {
        trackSymbols(symbols);
      }
    }
  }, [holdings, getHoldingSymbols]);

  return (
    <DashboardLayout nickname={auth.currentUser?.displayName || "User"}>
      <SummaryCards />

      <div className="h-6" />

      <AddStockButton />

      <div className="h-6" />

      <div className="flex gap-6 transition-all duration-500">
        <div className={selectedStock ? "w-[45%]" : "w-full"}>
          <HoldingsTable />
        </div>

        {selectedStock && (
          <div className="w-[55%]">
            <StockChartPanel stock={selectedStock} />
          </div>
        )}
      </div>

      <AddStockModal />
      <SellStockModal />
      <DeleteStockModal />
    </DashboardLayout>
  );
}

// Made with Bob
