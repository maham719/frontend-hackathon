import { io } from "socket.io-client";

const socket = io("https://backend-hackathon-1dgv.onrender.com", {
    withCredentials: true,
    autoConnect: false,
     transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("✅ SOCKET CONNECTED:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("❌ SOCKET CONNECT ERROR:", error.message);
  console.error("Details:", error);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 SOCKET DISCONNECTED:", reason);
});

console.log("Socket object:", socket);
console.log("Socket connected:", socket.connected);
export const connectSocket = (accessToken) => {

    socket.auth = {
        token: accessToken
    };

    socket.connect();
};

export default socket;
