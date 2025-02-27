import { io, Socket } from "socket.io-client";

const BACKEND_ENDPOINT = "http://localhost:3000"; // Remove '/socket' to match server config

export let socket: Socket;

export const initializeSocket = () => {
  if (!socket || !socket.connected) {
    console.log("Initializing socket connection...");
    
    socket = io(BACKEND_ENDPOINT, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      path: "/socket.io", // Match path with server
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

// Helper function to identify a user to the socket
export const identifyUser = (userId: string) => {
  if (socket && socket.connected) {
    console.log("Identifying user to socket:", userId);
    socket.emit("addUser", userId);
  } else {
    console.warn("Socket not connected. Cannot identify user.");
  }
};