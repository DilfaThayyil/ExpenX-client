import { io, Socket } from "socket.io-client";
const BACKENDENDPOINT = "http://localhost:3000/socket"; 

export let socket: Socket;

export const initializeSocket = () => {
  console.log('initializing socket...')
  if (!socket) {
    socket = io(BACKENDENDPOINT, {
      transports: ["websocket"],
      withCredentials: true,
    });
    console.log('socket created... : ',socket)

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    return socket
  }
};
