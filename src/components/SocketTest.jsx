import { useEffect } from "react";
import socket from "../services/socket.js";

const SocketTest = () => {

    const ticketId = "6a957584a78e3cee8b1dbc79";

    useEffect(() => {

        const joinTicket = () => {
            console.log("Socket connected:", socket.id);

            socket.emit(
                "join-ticket",
                ticketId,
                (response) => {
                    console.log("Join ticket response:", response);
                }
            );
        };

        if (socket.connected) {
            joinTicket();
        }

        socket.on("connect", joinTicket);

        return () => {
            socket.off("connect", joinTicket);
        };

    }, []);


    const sendTestMessage = () => {

        socket.emit(
            "send-message",
            {
                ticketId,
                content: "Hello from Socket.IO!"
            },
            (response) => {
                console.log(
                    "Send message response:",
                    response
                );
            }
        );
    };


    useEffect(() => {

        const handleNewMessage = (message) => {
            console.log("🔥 NEW MESSAGE:", message);
        };

        socket.on("new-message", handleNewMessage);

        return () => {
            socket.off("new-message", handleNewMessage);
        };

    }, []);


    return (
        <div>
            <h2>Socket.IO Test</h2>

            <button onClick={sendTestMessage}>
                Send Test Message
            </button>
        </div>
    );
};

export default SocketTest;