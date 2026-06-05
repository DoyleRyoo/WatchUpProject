import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PYTHON_BIN = process.env.PYTHON_BIN || "python3";
const STOCKS_CSV_PATH = path.resolve(__dirname, "../cache/stocks.csv");
const GENERATE_SCRIPT_PATH = path.resolve(
  __dirname,
  "../python/generateStockMaster.py"
);

let stockMaster = null;

const parseCsvLine = (line) => {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      i++;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
};

export const ensureStockMasterCsv = () => {
  if (fs.existsSync(STOCKS_CSV_PATH)) {
    console.log(`[STOCK MASTER] CSV already exists. Skipping generation: ${STOCKS_CSV_PATH}`);
    return Promise.resolve();
  }

  console.log("[STOCK MASTER] CSV not found. Generating stock master CSV...");
  fs.mkdirSync(path.dirname(STOCKS_CSV_PATH), { recursive: true });

  return new Promise((resolve) => {
    const python = spawn(PYTHON_BIN, [GENERATE_SCRIPT_PATH, STOCKS_CSV_PATH]);

    let errorOutput = "";

    python.stdout.on("data", (data) => {
      process.stdout.write(data.toString());
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
      process.stderr.write(data.toString());
    });

    python.on("error", (error) => {
      console.error(`[STOCK MASTER] Failed to start CSV generator: ${error.message}`);
      resolve();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        console.error(
          `[STOCK MASTER] CSV generation failed with code ${code}: ${errorOutput.trim()}`
        );
        resolve();
        return;
      }

      console.log("[STOCK MASTER] CSV generation complete.");
      resolve();
    });
  });
};

export const loadStockMaster = () => {
  if (stockMaster) {
    return stockMaster;
  }

  if (!fs.existsSync(STOCKS_CSV_PATH)) {
    console.error(`[STOCK MASTER] CSV not found: ${STOCKS_CSV_PATH}`);
    stockMaster = [];
    return stockMaster;
  }

  const csv = fs.readFileSync(STOCKS_CSV_PATH, "utf-8");
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const [, ...rows] = lines;

  stockMaster = rows
    .map((line) => {
      const [symbol, name, market, country] = parseCsvLine(line);

      return {
        symbol,
        name,
        market,
        country,
      };
    })
    .filter((stock) => stock.symbol && stock.name && stock.market && stock.country);

  console.log(`[STOCK MASTER] Loaded ${stockMaster.length} stocks into memory.`);
  return stockMaster;
};

export const searchStocks = (keyword) => {
  const query = keyword.trim().toLowerCase();

  if (!query) {
    return [];
  }

  return loadStockMaster()
    .filter((stock) => {
      return (
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query)
      );
    })
    .slice(0, 20);
};
