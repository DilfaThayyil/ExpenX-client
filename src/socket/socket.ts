import { io, Socket } from "socket.io-client";

const BACKEND_ENDPOINT = "http://localhost:3000"; 

export let socket: Socket;

export const initializeSocket = () => {
  if (!socket || !socket.connected) {
    
    socket = io(BACKEND_ENDPOINT, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      path: "/socket.io", 
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socket.on("connect", () => {
      console.log("Socket connected successfully:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${reason}`);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  }
  
  return socket;
};

export const identifyUser = (userId: string) => {
  if (socket && socket.connected) {
    socket.emit("addUser", userId);
  } else {
    console.warn("Socket not connected. Cannot identify user.");
  }
};