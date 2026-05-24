import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: {
      userId: userId
    },
    withCredentials: true,
    transports: ["websocket"],
  });
  newSocket.on("connect", () => {
    console.log("connected", socket.id);
  });
  
  newSocket.on("connect_error", (err) => {
    console.log("ERROR:", err.message);
  });
  
  socket = newSocket;

  return newSocket;
};

function getSocket() {
  return socket;
}

export { getSocket, socket }