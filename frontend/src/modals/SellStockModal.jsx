import { useState } from "react";

import { auth } from "../services/firebase";

import useModalStore from "../store/useModalStore";

import useStockStore from "../store/useStockStore";

import {
  updateHolding,
  deleteHolding,
  createTransaction,
} from "../services/firestoreService";

export default function SellStockModal() {
  const {
    sellHolding: sellModalHolding,
    closeSellModal,
  } = useModalStore();

  const updateHoldingInStore = useStockStore((state) => state.updateHolding);

  const removeHolding = useStockStore((state) => state.removeHolding);

  const prices = useStockStore((state) => state.prices);

  const [sellQuantity, setSellQuantity] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!sellModalHolding) return null;

  const handleSell = async () => {
    try {
      setError("");
      
      const uid = auth.currentUser?.uid;

      if (!uid) {
        setError("로그인이 필요합니다.");

        return;
      }

      const quantity = Number(sellModalHolding.quantity);

      const sellQty = Number(sellQuantity);

      // Validation
      if (!sellQuantity || sellQuantity.trim() === "") {
        setError("판매 수량을 입력해주세요.");

        return;
      }

      if (isNaN(sellQty) || sellQty <= 0) {
        setError("올바른 수량을 입력해주세요.");

        return;
      }

      if (!Number.isInteger(sellQty)) {
        setError("정수만 입력 가능합니다.");

        return;
      }

      if (sellQty > quantity) {
        setError(`보유 수량(${quantity}주)을 초과할 수 없습니다.`);

        return;
      }

      setIsProcessing(true);

      const remain = quantity - sellQty;

      // Get current price from real-time prices store
      const currentPrice = prices[sellModalHolding.stockCode]?.price || sellModalHolding.averagePrice;

      const profit = (currentPrice - sellModalHolding.averagePrice) * sellQty;

      // Create transaction record
      await createTransaction(uid, {
        holdingId: sellModalHolding.id,
        stockCode: sellModalHolding.stockCode,
        stockName: sellModalHolding.stockName,
        type: "SELL",
        price: currentPrice,
        quantity: sellQty,
        profit,
      });

      if (remain === 0) {
        // Full sell - delete from Firestore and remove from Zustand
        await deleteHolding(uid, sellModalHolding.id);

        removeHolding(sellModalHolding.id);
      } else {
        // Partial sell - update quantity in Firestore and Zustand
        await updateHolding(
          uid,
          sellModalHolding.id,
          {
            quantity: remain,
          }
        );

        updateHoldingInStore(sellModalHolding.id, {
          quantity: remain,
        });
      }

      // Reset and close
      setSellQuantity("");
      setError("");
      closeSellModal();
    } catch (error) {
      console.error("Sell error:", error);
      setError("판매 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setSellQuantity("");
    setError("");
    closeSellModal();
  };

  const currentPrice = prices[sellModalHolding.stockCode]?.price || sellModalHolding.averagePrice;
  const estimatedProfit = sellQuantity && !isNaN(Number(sellQuantity))
    ? (currentPrice - sellModalHolding.averagePrice) * Number(sellQuantity)
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-4">
          {sellModalHolding.stockName} 판매
        </h2>

        <div className="space-y-2 mb-4">
          <p className="text-sm text-zinc-400">
            보유 수량: <span className="text-white font-semibold">{sellModalHolding.quantity}주</span>
          </p>
          <p className="text-sm text-zinc-400">
            평균 매입가: <span className="text-white font-semibold">₩{sellModalHolding.averagePrice.toLocaleString()}</span>
          </p>
          <p className="text-sm text-zinc-400">
            현재가: <span className="text-white font-semibold">₩{currentPrice.toLocaleString()}</span>
          </p>
        </div>

        <input
          className="w-full h-12 px-4 rounded-xl bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          type="number"
          value={sellQuantity}
          onChange={(e) => {
            setError("");
            setSellQuantity(e.target.value);
          }}
          placeholder="판매 수량 입력"
          min="1"
          max={sellModalHolding.quantity}
          step="1"
          disabled={isProcessing}
        />

        {sellQuantity && !error && (
          <div className="mt-3 p-3 rounded-lg bg-zinc-800">
            <p className="text-sm text-zinc-400">
              예상 손익: <span className={`font-semibold ${estimatedProfit >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                {estimatedProfit >= 0 ? '+' : ''}₩{estimatedProfit.toLocaleString()}
              </span>
            </p>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 h-12 rounded-xl bg-zinc-700 text-white hover:bg-zinc-600 transition disabled:opacity-50"
            onClick={handleClose}
            disabled={isProcessing}
          >
            취소
          </button>

          <button
            className="flex-1 h-12 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSell}
            disabled={isProcessing || !sellQuantity}
          >
            {isProcessing ? "처리 중..." : "판매"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
