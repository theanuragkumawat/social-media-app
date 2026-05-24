import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  const newSocket = io(import.meta.env.VITE_BASE_URL, {
    query: { userId }
  });

  socket = newSocket;

  return newSocket;
};

function getSocket() {
  return socket;
}

export { getSocket , socket}