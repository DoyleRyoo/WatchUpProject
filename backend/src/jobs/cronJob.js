import cron from "node-cron";
import { getStockPrice } from "../services/stockService.js";
import stockCache from "../cache/stockCache.js";

// Track active symbols to fetch
let activeSymbols = new Set();

/**
 * Register a symbol to be tracked for real-time updates
 * @param {string} symbol - Stock symbol to track
 */
export const registerSymbol = (symbol) => {
  if (symbol && !activeSymbols.has(symbol)) {
    activeSymbols.add(symbol);
    console.log(`[STOCK TRACKER] Registered: ${symbol}`);
  }
};

/**
 * Register multiple symbols at once
 * @param {Array<string>} symbols - Array of stock symbols
 */
export const registerSymbols = (symbols) => {
  symbols.forEach((symbol) => registerSymbol(symbol));
};

/**
 * Get all currently tracked symbols
 * @returns {Array<string>} Array of tracked symbols
 */
export const getTrackedSymbols = () => {
  return Array.from(activeSymbols);
};

/**
 * Start the cron job that fetches stock prices every 10 seconds
 * @param {Object} io - Socket.io server instance
 */
export const startCronJob = (io) => {
  console.log("[STOCK TRACKER] Starting real-time stock update service...");
  console.log("[STOCK TRACKER] Update interval: Every 10 seconds");

  // Run every 10 seconds: */10 * * * * *
  cron.schedule("*/10 * * * * *", async () => {
    const symbols = Array.from(activeSymbols);

    if (symbols.length === 0) {
      return;
    }

    console.log("\n[STOCK UPDATE] Fetching prices...");
    const timestamp = new Date().toISOString();
    const updates = {};
    let successCount = 0;
    let errorCount = 0;

    // Fetch all symbols in parallel for better performance
    const promises = symbols.map(async (symbol) => {
      try {
        // Clear cache to force fresh fetch
        stockCache.del(symbol);
        
        const stock = await getStockPrice(symbol);
        
        if (stock && stock.price) {
          updates[symbol] = {
            ...stock,
            timestamp,
          };
          successCount++;
          
          // Log price update
          const priceStr = stock.price.toLocaleString();
          console.log(`  ✓ ${symbol.padEnd(12)} → ${priceStr}`);
        }
      } catch (err) {
        errorCount++;
        console.error(`  ✗ ${symbol.padEnd(12)} → Error: ${err.message}`);
      }
    });

    await Promise.all(promises);

    // Broadcast all updates at once
    if (Object.keys(updates).length > 0) {
      io.emit("stock:batch-update", {
        prices: updates,
        timestamp,
      });

      console.log(`[STOCK UPDATE] Complete: ${successCount} success, ${errorCount} errors`);
    }
  });

  console.log("[STOCK TRACKER] Service started successfully");
};

// Made with Bob
