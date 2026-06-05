import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import { getStockPrice } from "./src/services/stockService.js";
import { searchStocks } from "./src/services/stockMasterService.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    success: true,
    service: "Watch Up API",
  });
});

app.get("/api/stock/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const stockData = await getStockPrice(symbol);
    res.json({
      success: true,
      data: stockData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/stocks/search", (req, res) => {
  try {
    const { q = "" } = req.query;

    res.json(searchStocks(String(q)));
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default app;
