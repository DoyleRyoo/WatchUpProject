import { Server } from "socket.io";
import { registerSymbols } from "../jobs/cronJob.js";

/**
 * Initialize Socket.io server with CORS and event handlers
 * @param {Object} httpServer - HTTP server instance
 * @returns {Object} Socket.io server instance
 */
export const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[SOCKET] Client connected: ${socket.id}`);

    /**
     * Handle client requesting to track specific stock symbols
     * Client sends: { symbols: ["AAPL", "005930.KS", ...] }
     */
    socket.on("track:symbols", (data) => {
      if (data && Array.isArray(data.symbols)) {
        registerSymbols(data.symbols);
        console.log(`[SOCKET] Client ${socket.id} tracking: ${data.symbols.join(", ")}`);
        
        // Acknowledge registration
        socket.emit("track:confirmed", {
          symbols: data.symbols,
          message: "Symbols registered for real-time updates",
        });
      }
    });

    /**
     * Handle client requesting current tracked symbols
     */
    socket.on("track:get", () => {
      const { getTrackedSymbols } = require("../jobs/cronJob.js");
      socket.emit("track:list", {
        symbols: getTrackedSymbols(),
      });
    });

    socket.on("disconnect", () => {
      console.log(`[SOCKET] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Made with Bob
