import { useState, useEffect } from "react";

import useModalStore from "../store/useModalStore";

import { auth } from "../services/firebase";

import { addHolding, findHoldingByCode, updateHolding } from "../services/firestoreService";

import useStockStore from "../store/useStockStore";

import api from "../api/axios";

const formatStockLabel = (stock) => {
  if (!stock) return "";
  return `${stock.name} (${stock.symbol}) - ${stock.market}`;
};

export default function AddStockModal() {
  const { isAddModalOpen, closeAddModal } = useModalStore();

  const [stockSearchInput, setStockSearchInput] = useState("");

  const [selectedStock, setSelectedStock] = useState(null);

  const [stockName, setStockName] = useState("");

  const [stockCode, setStockCode] = useState("");

  const [averagePrice, setAveragePrice] = useState("");

  const [quantity, setQuantity] = useState("");

  const [isLoadingPrice, setIsLoadingPrice] = useState(false);

  const [searchResults, setSearchResults] = useState([]);

  const [isSearchingStocks, setIsSearchingStocks] = useState(false);

  const [hasSearchedStocks, setHasSearchedStocks] = useState(false);

  const addHoldingToStore = useStockStore((state) => state.addHolding);

  const updateHoldingInStore = useStockStore((state) => state.updateHolding);

  useEffect(() => {
    const query = stockSearchInput.trim();

    if (!query) {
      setSearchResults([]);
      setHasSearchedStocks(false);
      setIsSearchingStocks(false);
      return;
    }

    if (selectedStock && stockSearchInput === formatStockLabel(selectedStock)) {
      setSearchResults([]);
      setHasSearchedStocks(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearchingStocks(true);

      try {
        const response = await api.get("/api/stocks/search", {
          params: {
            q: query,
          },
        });

        setSearchResults(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to search stocks:", error);
        setSearchResults([]);
      } finally {
        setHasSearchedStocks(true);
        setIsSearchingStocks(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [stockSearchInput, selectedStock]);

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

      if (!selectedStock || !averagePrice || !quantity) {
        alert("종목을 선택하고 모든 필드를 입력해주세요.");
        return;
      }

      const selectedStockCode = selectedStock.symbol;
      const selectedStockName = selectedStock.name;

      const parsedAveragePrice = parseFloat(averagePrice);
      const parsedQuantity = parseInt(quantity, 10);

      if (isNaN(parsedAveragePrice) || isNaN(parsedQuantity)) {
        alert("평균 구매가와 수량은 숫자여야 합니다.");
        return;
      }

      // Check if holding already exists
      const existingHolding = await findHoldingByCode(uid, selectedStockCode);

      if (existingHolding) {
        // Update existing holding with new average price
        const existingAvgPrice = parseFloat(existingHolding.averagePrice);
        const existingQty = parseInt(existingHolding.quantity, 10);

        const newAveragePrice =
          (existingAvgPrice * existingQty + parsedAveragePrice * parsedQuantity) /
          (existingQty + parsedQuantity);

        const newQuantity = existingQty + parsedQuantity;

        await updateHolding(uid, existingHolding.id, {
          stockCode: selectedStockCode,
          stockName: selectedStockName,
          averagePrice: newAveragePrice,
          quantity: newQuantity,
        });

        updateHoldingInStore(existingHolding.id, {
          stockCode: selectedStockCode,
          stockName: selectedStockName,
          averagePrice: newAveragePrice,
          quantity: newQuantity,
        });
      } else {
        // Add new holding
        const docRef = await addHolding(uid, {
          stockCode: selectedStockCode,
          stockName: selectedStockName,
          averagePrice: parsedAveragePrice,
          quantity: parsedQuantity,
        });

        addHoldingToStore({
          id: docRef.id,
          stockCode: selectedStockCode,
          stockName: selectedStockName,
          averagePrice: parsedAveragePrice,
          quantity: parsedQuantity,
        });
      }

      // Reset form
      setStockSearchInput("");
      setSelectedStock(null);
      setStockName("");
      setStockCode("");
      setAveragePrice("");
      setQuantity("");
      setSearchResults([]);
      setHasSearchedStocks(false);

      closeAddModal();
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleStockSearchChange = (e) => {
    const value = e.target.value;

    setStockSearchInput(value);
    setSelectedStock(null);
    setStockName("");
    setStockCode("");
    setAveragePrice("");
  };

  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
    setStockSearchInput(formatStockLabel(stock));
    setStockName(stock.name);
    setStockCode(stock.symbol);
    setSearchResults([]);
    setHasSearchedStocks(false);
  };

  const getAveragePricePlaceholder = () => {
    if (!selectedStock) {
      return "종목을 먼저 선택해주세요";
    }
    if (isLoadingPrice) {
      return "현재가 조회 중...";
    }
    return "평균 구매가";
  };

  const shouldShowDropdown = stockSearchInput.trim() && !selectedStock;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full  max-w-md bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6">
          새 종목을 추가합니다
        </h2>

        <div className="space-y-4">
          <div className="relative">
            <input
              className="w-full h-12 px-4 rounded-xl bg-zinc-800 text-white"
              value={stockSearchInput}
              onChange={handleStockSearchChange}
              placeholder="종목명 또는 종목코드 검색"
            />

            {shouldShowDropdown && (
              <div className="absolute left-0 right-0 top-14 z-50 max-h-60 overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl">
                {isSearchingStocks && (
                  <div className="px-4 py-3 text-sm text-zinc-400">
                    검색 중...
                  </div>
                )}

                {!isSearchingStocks &&
                  searchResults.map((stock) => (
                    <button
                      key={`${stock.market}-${stock.symbol}`}
                      type="button"
                      className="w-full px-4 py-3 text-left text-white hover:bg-zinc-800"
                      onClick={() => handleSelectStock(stock)}
                    >
                      <span className="block text-sm font-medium">
                        {stock.name} ({stock.symbol}) - {stock.market}
                      </span>
                    </button>
                  ))}

                {!isSearchingStocks &&
                  hasSearchedStocks &&
                  searchResults.length === 0 && (
                    <div className="px-4 py-3 text-sm text-zinc-400">
                      No results found
                    </div>
                  )}
              </div>
            )}
          </div>

          <input
            className="w-full h-12 px-4 rounded-xl bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            type="number"
            value={averagePrice}
            onChange={(e) => setAveragePrice(e.target.value)}
            placeholder={getAveragePricePlaceholder()}
            disabled={!selectedStock || isLoadingPrice}
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
