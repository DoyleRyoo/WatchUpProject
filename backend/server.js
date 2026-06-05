import http from "http";
import app from "./app.js";

import { initSocketServer } from "./src/socket/socketServer.js";
import { startCronJob } from "./src/jobs/cronJob.js";
import {
  ensureStockMasterCsv,
  loadStockMaster,
} from "./src/services/stockMasterService.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = initSocketServer(server);

await ensureStockMasterCsv();
loadStockMaster();

startCronJob(io);

server.listen(PORT, () => {
  console.log(`Server Running ${PORT}`);
});
