import { create } from "zustand";

/**
 * Stock Store - Manages holdings, selected stock, and real-time prices
 * Uses Zustand v5 for state management
 */
const useStockStore = create((set, get) => ({
  // State
  holdings: [],
  selectedStock: null,
  prices: {},
  isLoading: false,
  error: null,
  lastUpdate: null,
  isConnected: false,

  // Actions
  /**
   * Set all holdings
   * @param {Array} holdings - Array of holding objects
   */
  setHoldings: (holdings) =>
    set({
      holdings,
      error: null,
    }),

  /**
   * Add a new holding to the store
   * @param {Object} holding - Holding object with id
   */
  addHolding: (holding) =>
    set((state) => ({
      holdings: [...state.holdings, holding],
      error: null,
    })),

  /**
   * Update an existing holding
   * @param {string} id - Holding ID
   * @param {Object} updates - Updated fields
   */
  updateHolding: (id, updates) =>
    set((state) => ({
      holdings: state.holdings.map((holding) =>
        holding.id === id ? { ...holding, ...updates } : holding
      ),
      error: null,
    })),

  /**
   * Remove a holding from the store
   * @param {string} id - Holding ID to remove
   */
  removeHolding: (id) =>
    set((state) => ({
      holdings: state.holdings.filter((holding) => holding.id !== id),
      error: null,
    })),

  /**
   * Set the currently selected stock for chart display
   * @param {Object} selectedStock - Stock object
   */
  setSelectedStock: (selectedStock) =>
    set({
      selectedStock,
    }),

  /**
   * Clear the selected stock
   */
  clearSelectedStock: () =>
    set({
      selectedStock: null,
    }),

  /**
   * Update real-time price for a stock
   * @param {Object} stock - Stock object with symbol and price data
   */
  updatePrice: (stock) =>
    set((state) => ({
      prices: {
        ...state.prices,
        [stock.symbol]: stock,
      },
      lastUpdate: new Date().toISOString(),
    })),

  /**
   * Update multiple prices at once (batch update)
   * @param {Object} pricesMap - Object with symbol as key and stock data as value
   */
  updatePrices: (pricesMap) =>
    set((state) => ({
      prices: {
        ...state.prices,
        ...pricesMap,
      },
      lastUpdate: new Date().toISOString(),
    })),

  /**
   * Handle batch update from socket
   * @param {Object} data - Batch update data with prices and timestamp
   */
  handleBatchUpdate: (data) => {
    if (data && data.prices) {
      set({
        prices: {
          ...get().prices,
          ...data.prices,
        },
        lastUpdate: data.timestamp || new Date().toISOString(),
      });
    }
  },

  /**
   * Set connection status
   * @param {boolean} isConnected - Connection status
   */
  setConnected: (isConnected) =>
    set({
      isConnected,
    }),

  /**
   * Set loading state
   * @param {boolean} isLoading - Loading state
   */
  setLoading: (isLoading) =>
    set({
      isLoading,
    }),

  /**
   * Set error state
   * @param {string|null} error - Error message or null
   */
  setError: (error) =>
    set({
      error,
    }),

  /**
   * Clear all error states
   */
  clearError: () =>
    set({
      error: null,
    }),

  /**
   * Get all unique stock symbols from holdings
   * @returns {Array<string>} Array of stock symbols
   */
  getHoldingSymbols: () => {
    const state = get();
    return [...new Set(state.holdings.map((h) => h.stockCode))];
  },

  /**
   * Reset the entire store to initial state
   */
  reset: () =>
    set({
      holdings: [],
      selectedStock: null,
      prices: {},
      isLoading: false,
      error: null,
      lastUpdate: null,
      isConnected: false,
    }),
}));

export default useStockStore;

// Made with Bob
