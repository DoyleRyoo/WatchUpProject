import cron from "node-cron";
import { getStockPrice } from "../services/stockService.js";

const WATCH_LIST = [
  "AAPL",
  "MSFT",
  "NVDA",
  "TSLA",
  "GOOGL",
  "005930.KS",
];

export const startCronJob = (io) => {
  cron.schedule("* * * * *", async () => {
    console.log("Stock Update Start");

    for (const symbol of WATCH_LIST) {
      try {
        const stock = await getStockPrice(symbol);

        io.emit("stock:update", stock);
      } catch (err) {
        console.error(err);
      }
    }
  });
};