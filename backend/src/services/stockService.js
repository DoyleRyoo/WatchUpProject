import { spawn } from "child_process";
import stockCache from "../cache/stockCache.js";

export const getStockPrice = (symbol) => {
  return new Promise((resolve, reject) => {
    const cached = stockCache.get(symbol);

    if (cached) {
      return resolve(cached);
    }

    const python = spawn("python", [
      "./src/python/yfinance.py",
      symbol,
    ]);

    let result = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    python.on("close", () => {
      try {
        const parsed = JSON.parse(result);

        stockCache.set(symbol, parsed);

        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
  });
};