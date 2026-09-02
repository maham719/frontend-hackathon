import { io } from "socket.io-client";

const socket = io("https://backend-hackathon-seven.vercel.app", {
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
