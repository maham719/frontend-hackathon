import { io } from "socket.io-client";

const socket = io("http://localhost:3006", {
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