import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    success: true,
    service: "Watch Up API",
  });
});

export default app;