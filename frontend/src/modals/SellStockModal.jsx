import { useState } from "react";

import { auth } from "../services/firebase";

import useModalStore from "../store/useModalStore";

import useStockStore from "../store/useStockStore";

import {
  updateHolding,
  createTransaction,
} from "../services/firestoreService";

export default function SellStockModal() {
  const {
    sellHolding: sellModalHolding,
    closeSellModal,
  } = useModalStore();

  const updateHoldingInStore = useStockStore((state) => state.updateHolding);

  const removeHolding = useStockStore((state) => state.removeHolding);

  const [sellQuantity, setSellQuantity] = useState("");

  if (!sellModalHolding) return null;

  const handleSell = async () => {
    try {
      const uid = auth.currentUser?.uid;

      if (!uid) return;

      const quantity = Number(sellModalHolding.quantity);

      const sellQty = Number(sellQuantity);

      if (sellQty <= 0 || sellQty > quantity) {
        return;
      }

      const remain = quantity - sellQty;

      const currentPrice = sellModalHolding.currentPrice || 0;

      const profit = (currentPrice - sellModalHolding.averagePrice) * sellQty;

      await createTransaction(uid, {
        holdingId: sellModalHolding.id,
        type: "SELL",
        price: currentPrice,
        quantity: sellQty,
        profit,
      });

      if (remain === 0) {
        await updateHolding(
          uid,
          sellModalHolding.id,
          {
            quantity: 0,
          }
        );

        removeHolding(sellModalHolding.id);
      } else {
        await updateHolding(
          uid,
          sellModalHolding.id,
          {
            quantity: remain,
          }
        );

        updateHoldingInStore(sellModalHolding.id,
          {
            quantity: remain,
          }
        );
      }

      closeSellModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={closeSellModal}
    >
      <div
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-xl font-bold text-white mb-4"
        >
          {sellModalHolding.stockName}
          를 판매합니다
        </h2>

        <p className=" text-sm text-zinc-400 mb-4">
          현재
          {" "}
          {sellModalHolding.quantity}
          주 보유 중
        </p>

        <input
          type="number"
          value={sellQuantity}
          onChange={(e) =>
            setSellQuantity(
              e.target.value
            )
          }
          placeholder="판매 수량"
          className="w-full h-12 px-4 rounded-xl bg-zinc-800 text-white"
        />

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 h-12 rounded-xl bg-zinc-700 text-white"
            onClick={closeSellModal}
          >
            취소
          </button>

          <button
            className="flex-1 h-12 rounded-xl bg-red-500 text-white font-semibold"
            onClick={handleSell}
          >
            판매
          </button>
        </div>
      </div>
    </div>
  );
}
