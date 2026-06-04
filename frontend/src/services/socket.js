import { io } from "socket.io-client";

/**
 * Socket.io client instance for real-time stock updates
 * Connects to backend server and handles stock price events
 */
export const socket = io(import.meta.env.VITE_API_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

/**
 * Register stock symbols to track for real-time updates
 * @param {Array<string>} symbols - Array of stock symbols to track
 */
export const trackSymbols = (symbols) => {
  if (socket.connected && symbols && symbols.length > 0) {
    socket.emit("track:symbols", { symbols });
  }
};

/**
 * Setup socket event listeners
 * @param {Function} onBatchUpdate - Callback for batch price updates
 * @param {Function} onConnect - Callback for connection established
 * @param {Function} onDisconnect - Callback for disconnection
 */
export const setupSocketListeners = (onBatchUpdate, onConnect, onDisconnect) => {
  // Handle batch price updates
  socket.on("stock:batch-update", onBatchUpdate);

  // Handle connection events
  socket.on("connect", () => {
    console.log("[SOCKET] Connected to server");
    if (onConnect) onConnect();
  });

  socket.on("disconnect", () => {
    console.log("[SOCKET] Disconnected from server");
    if (onDisconnect) onDisconnect();
  });

  socket.on("track:confirmed", (data) => {
    console.log("[SOCKET] Tracking confirmed:", data.symbols);
  });

  // Return cleanup function
  return () => {
    socket.off("stock:batch-update", onBatchUpdate);
    socket.off("connect");
    socket.off("disconnect");
    socket.off("track:confirmed");
  };
};

// Made with Bob
