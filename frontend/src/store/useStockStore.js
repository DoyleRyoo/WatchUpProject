import { create } from "zustand";

const useStockStore = create((set) => ({
  prices: {},

  updatePrice: (stock) =>
    set((state) => ({
      prices: {
        ...state.prices,
        [stock.symbol]: stock,
      },
    })),
}));

export default useStockStore;