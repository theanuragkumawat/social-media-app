import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  const newSocket = io("https://social-media-app-gphq.onrender.com", {
    query: { userId }
  });

  socket = newSocket;

  return newSocket;
};

function getSocket() {
  return socket;
}

export { getSocket , socket}