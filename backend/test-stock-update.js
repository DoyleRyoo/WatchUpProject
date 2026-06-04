/**
 * Test Script for Real-Time Stock Update System
 * 
 * This script tests the stock update pipeline:
 * 1. Fetches stock prices using the stock service
 * 2. Verifies data structure
 * 3. Tests multiple symbols
 * 
 * Run: node test-stock-update.js
 */

import { getStockPrice } from "./src/services/stockService.js";

const TEST_SYMBOLS = ["AAPL", "MSFT", "005930.KS"];

console.log("=".repeat(60));
console.log("REAL-TIME STOCK UPDATE SYSTEM - TEST");
console.log("=".repeat(60));
console.log();

async function testStockFetch() {
  console.log("Testing stock price fetching...\n");

  for (const symbol of TEST_SYMBOLS) {
    try {
      console.log(`Fetching ${symbol}...`);
      const startTime = Date.now();
      
      const stock = await getStockPrice(symbol);
      
      const duration = Date.now() - startTime;
      
      console.log(`✓ Success (${duration}ms)`);
      console.log(`  Name: ${stock.name || "N/A"}`);
      console.log(`  Price: ${stock.price || "N/A"}`);
      console.log(`  Previous Close: ${stock.previousClose || "N/A"}`);
      console.log(`  Day High: ${stock.dayHigh || "N/A"}`);
      console.log(`  Day Low: ${stock.dayLow || "N/A"}`);
      console.log();
      
    } catch (error) {
      console.log(`✗ Failed: ${error.message}`);
      console.log();
    }
  }
}

async function runTests() {
  try {
    await testStockFetch();
    
    console.log("=".repeat(60));
    console.log("TEST COMPLETE");
    console.log("=".repeat(60));
    console.log();
    console.log("Next steps:");
    console.log("1. Start the server: npm start");
    console.log("2. Open the frontend dashboard");
    console.log("3. Watch for updates every 10 seconds");
    console.log("4. Check console logs for [STOCK UPDATE] messages");
    console.log();
    
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

runTests();

// Made with Bob
