import { io, Socket } from "socket.io-client";
import {BACKENDENDPOINT} from '@/utility/env'

export let socket: Socket;

export const initializeSocket = () => {
  if (!socket || !socket.connected) {
    
    socket = io(BACKENDENDPOINT, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      path: "/socket.io", 
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socket.on("connect", () => {
    });

    socket.on("disconnect", () => {
    });

    socket.on("connect_error", () => {
    });

    socket.on("error", () => {
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