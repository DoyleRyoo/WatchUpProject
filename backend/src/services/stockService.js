import { spawn } from "child_process";
import stockCache from "../cache/stockCache.js";

const PYTHON_BIN = process.env.PYTHON_BIN || "python3";

export const getStockPrice = (symbol) => {
  return new Promise((resolve, reject) => {
    const cached = stockCache.get(symbol);

    if (cached) {
      return resolve(cached);
    }

    const python = spawn(PYTHON_BIN, [
      "./src/python/stockPrice.py",
      symbol,
    ]);

    let result = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.error(data.toString());
    });

    python.on("error", (err) => {
      reject(err);
    });

    python.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(
            `Python script exited with code ${code}: ${errorOutput.trim()}`
          )
        );
      }

      try {
        const parsed = JSON.parse(result);

        if (parsed.error) {
          return reject(new Error(parsed.error));
        }

        stockCache.set(symbol, parsed);

        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
  });
};
