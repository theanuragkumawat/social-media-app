import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  const newSocket = io("http://localhost:8000", {
    query: { userId }
  });

  socket = newSocket;

  return newSocket;
};

function getSocket() {
  return socket;
}

export { getSocket , socket}