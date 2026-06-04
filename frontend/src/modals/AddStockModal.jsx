import { useState, useEffect } from "react";

import useModalStore from "../store/useModalStore";

import { auth } from "../services/firebase";

import { addHolding, findHoldingByCode, updateHolding } from "../services/firestoreService";

import useStockStore from "../store/useStockStore";

import api from "../api/axios";

export default function AddStockModal() {
  const { isAddModalOpen, closeAddModal } = useModalStore();

  const [stockName, setStockName] = useState("");

  const [stockCode, setStockCode] = useState("");

  const [averagePrice, setAveragePrice] = useState("");

  const [quantity, setQuantity] = useState("");

  const [isLoadingPrice, setIsLoadingPrice] = useState(false);

  const addHoldingToStore = useStockStore((state) => state.addHolding);

  const updateHoldingInStore = useStockStore((state) => state.updateHolding);

  // Fetch current price when stock is selected
  useEffect(() => {
    const fetchCurrentPrice = async () => {
      if (!stockCode || !stockName) {
        setAveragePrice("");
        return;
      }

      setIsLoadingPrice(true);

      try {
        const response = await api.get(`/api/stock/${stockCode}`);

        if (response.data.success && response.data.data.price) {
          setAveragePrice(response.data.data.price.toString());
        }
      } catch (error) {
        console.error("Failed to fetch stock price:", error);
      } finally {
        setIsLoadingPrice(false);
      }
    };

    fetchCurrentPrice();
  }, [stockCode, stockName]);

  if (!isAddModalOpen) return null;

  const handleSave = async () => {
    try {
      const uid = auth.currentUser?.uid;

      if (!uid) return;

      if (!stockCode || !stockName || !averagePrice || !quantity) {
        alert("모든 필드를 입력해주세요.");
        return;
      }

      const parsedAveragePrice = parseFloat(averagePrice);
      const parsedQuantity = parseInt(quantity);

      if (isNaN(parsedAveragePrice) || isNaN(parsedQuantity)) {
        alert("평균 구매가와 수량은 숫자여야 합니다.");
        return;
      }

      // Check if holding already exists
      const existingHolding = await findHoldingByCode(uid, stockCode);

      if (existingHolding) {
        // Update existing holding with new average price
        const existingAvgPrice = parseFloat(existingHolding.averagePrice);
        const existingQty = parseInt(existingHolding.quantity);

        const newAveragePrice =
          (existingAvgPrice * existingQty + parsedAveragePrice * parsedQuantity) /
          (existingQty + parsedQuantity);

        const newQuantity = existingQty + parsedQuantity;

        await updateHolding(uid, existingHolding.id, {
          averagePrice: newAveragePrice,
          quantity: newQuantity,
        });

        updateHoldingInStore(existingHolding.id, {
          averagePrice: newAveragePrice,
          quantity: newQuantity,
        });
      } else {
        // Add new holding
        const docRef = await addHolding(uid, {
          stockCode,
          stockName,
          averagePrice: parsedAveragePrice,
          quantity: parsedQuantity,
        });

        addHoldingToStore({
          id: docRef.id,
          stockCode,
          stockName,
          averagePrice: parsedAveragePrice,
          quantity: parsedQuantity,
        });
      }

      // Reset form
      setStockName("");
      setStockCode("");
      setAveragePrice("");
      setQuantity("");

      closeAddModal();
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleStockNameChange = (e) => {
    const value = e.target.value;
    setStockName(value);

    // Extract stock code from stock name if format is "종목명 (코드)"
    // Example: "삼성전자 (005930)"
    const match = value.match(/\((\d{6})\)/);
    if (match) {
      setStockCode(match[1]);
    } else {
      setStockCode("");
    }
  };

  const getAveragePricePlaceholder = () => {
    if (!stockName) {
      return "종목명을 먼저 입력해주세요";
    }
    if (isLoadingPrice) {
      return "현재가 조회 중...";
    }
    return "평균 구매가";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full  max-w-md bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6">
          새 종목을 추가합니다
        </h2>

        <div className="space-y-4">
          <input
            className="w-full h-12 px-4 rounded-xl bg-zinc-800 text-white"
            value={stockName}
            onChange={handleStockNameChange}
            placeholder="종목명 (예: 삼성전자 (005930))"
          />

          <input
            className="w-full h-12 px-4 rounded-xl bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            type="number"
            value={averagePrice}
            onChange={(e) => setAveragePrice(e.target.value)}
            placeholder={getAveragePricePlaceholder()}
            disabled={!stockName || isLoadingPrice}
          />

          <input
            className="w-full h-12 px-4 rounded-xl bg-zinc-800 text-white"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="보유 수량"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 h-12 rounded-xl bg-zinc-700 text-white"
            onClick={closeAddModal}
          >
            취소
          </button>

          <button
            className="flex-1 h-12 rounded-xl bg-emerald-500 text-white font-semibold"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
