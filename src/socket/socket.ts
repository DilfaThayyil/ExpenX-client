import { io, Socket } from "socket.io-client";

const BACKENDENDPOINT = "http://localhost:3000"; 

export let socket: Socket;

export const initializeSocket = () => {
  
  if (!socket) {
    console.log("Initializing socket...");
    socket = io(BACKENDENDPOINT, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
  }
  return socket;
};
