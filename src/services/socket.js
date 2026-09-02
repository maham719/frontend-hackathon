import { io } from "socket.io-client";

const socket = io("https://backend-hackathon-1dgv.onrender.com", {
    withCredentials: true,
    autoConnect: false
});

export const connectSocket = (accessToken) => {

    socket.auth = {
        token: accessToken
    };

    socket.connect();
};

export default socket;
