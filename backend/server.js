import http from "http";
import app from "./app.js";

import { initSocketServer } from "./src/socket/socketServer.js";
import { startCronJob } from "./src/jobs/cronJob.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = initSocketServer(server);

startCronJob(io);

server.listen(PORT, () => {
  console.log(`Server Running ${PORT}`);
});