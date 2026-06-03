import { useState } from "react";

import useModalStore from "../store/useModalStore";

import { auth } from "../services/firebase";

import { addHolding } from "../services/firestoreService";

import useStockStore from "../store/useStockStore";

export default function AddStockModal() {
  const { isAddModalOpen, closeAddModal, } = useModalStore();

  const [stockName, setStockName] = useState("");

  const [averagePrice, setAveragePrice] = useState("");

  const [quantity, setQuantity] = useState("");

  const addHoldingToStore = useStockStore((state) => state.addHolding);

  if (!isAddModalOpen) return null;

  const handleSave = async () => {
    try {
      const uid = auth.currentUser?.uid;

      if (!uid) return;

      const holding = await addHolding(uid, {
        stockCode: "005603",
        stockName,
        averagePrice,
        quantity,
      });

      addHoldingToStore(holding);

      closeAddModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="
      fixed
      inset-0
      z-50

      flex
      items-center
      justify-center

      bg-black/50
      backdrop-blur-sm
      "
    >
      <div
        className="
        w-full
        max-w-md

        bg-zinc-900

        rounded-2xl

        p-6

        border
        border-zinc-800

        shadow-2xl
        "
      >
        <h2
          className="
          text-xl
          font-bold
          text-white
          mb-6
          "
        >
          새 종목을 추가합니다
        </h2>

        <div className="space-y-4">
          <input
            value={stockName}
            onChange={(e) =>
              setStockName(e.target.value)
            }
            placeholder="종목명"
            className="
            w-full
            h-12

            px-4

            rounded-xl

            bg-zinc-800
            text-white
            "
          />

          <input
            type="number"
            value={averagePrice}
            onChange={(e) =>
              setAveragePrice(
                e.target.value
              )
            }
            placeholder="평균 구매가"
            className="
            w-full
            h-12

            px-4

            rounded-xl

            bg-zinc-800
            text-white
            "
          />

          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            placeholder="보유 수량"
            className="
            w-full
            h-12

            px-4

            rounded-xl

            bg-zinc-800
            text-white
            "
          />
        </div>

        <div
          className="
          flex
          gap-3
          mt-6
          "
        >
          <button
            onClick={closeAddModal}
            className="
            flex-1
            h-12

            rounded-xl

            bg-zinc-700
            text-white
            "
          >
            취소
          </button>

          <button
            onClick={handleSave}
            className="
            flex-1
            h-12

            rounded-xl

            bg-emerald-500
            text-white
            font-semibold
            "
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}