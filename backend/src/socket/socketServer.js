import { Server } from "socket.io";

export const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket Connected");

    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
    });
  });

  return io;
};