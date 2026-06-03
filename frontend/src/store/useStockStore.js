import { create } from "zustand";

const useStockStore = create((set) => ({
  holdings: [],
  selectedStock: null,
  prices: {},

  addHolding: (holding) =>
    set((state) => ({
      holdings: [
        ...state.holdings,
        holding,
      ],
    })),

  setHoldings: (holdings) =>
    set({
      holdings,
    }),

  setSelectedStock: (selectedStock) =>
    set({
      selectedStock,
    }),

  clearSelectedStock: () =>
    set({
      selectedStock: null,
    }),

  updatePrice: (stock) =>
    set((state) => ({
      prices: {
        ...state.prices,
        [stock.symbol]: stock,
      },
    })),
}));

export default useStockStore;
