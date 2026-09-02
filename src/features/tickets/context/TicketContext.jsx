import { createContext, useContext, useState, useEffect ,useCallback } from "react";
import {
  getTicketByIdService,
  getTicketMessagesService,
    getCustomerTicketsService,
    createTicketService,getAgentTicketsService
} from "../services/ticket.service.js";
import socket from "../../../services/socket.js";
const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // GET SINGLE TICKET
  // ==============================

  const getTicketById = async (ticketId) => {
    try {
      setLoading(true);
      setError("");

      const ticket = await getTicketByIdService(ticketId);

      setSelectedTicket(ticket);

      return {
        success: true,
        ticket,
      };
    } catch (error) {
      console.error("Get Ticket Error:", error);

      const message =
        error.response?.data?.message || "Failed to fetch ticket.";

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // GET TICKET MESSAGES
  // ==============================

  const getTicketMessages = async (ticketId) => {
    try {
      setLoading(true);
      setError("");

      const messages = await getTicketMessagesService(ticketId);

      setMessages(messages);

      return {
        success: true,
        messages,
      };
    } catch (error) {
      console.error("Get Ticket Messages Error:", error);

      const message =
        error.response?.data?.message || "Failed to fetch messages.";

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  };

  const getCustomerTickets = useCallback(async () => {
    try {
        setLoading(true);
        setError("");

        const response = await getCustomerTicketsService();

        setTickets(response);

        return {
            success: true,
            tickets: response
        };

    } catch (error) {
        console.error("Get Customer Tickets Error:", error);

        const message =
            error.response?.data?.message ||
            "Failed to fetch tickets.";

        setError(message);

        return {
            success: false,
            message
        };

    } finally {
        setLoading(false);
    }
}, []);

const getAgentTickets = useCallback(async () => {
    try {
        setLoading(true);
        setError("");

        const response = await getAgentTicketsService();

        setTickets(response);

        return {
            success: true,
            tickets: response
        };
    } catch (error) {
        console.error("Get Agent Tickets Error:", error);

        const message =
            error.response?.data?.message ||
            "Failed to fetch agent tickets.";

        setError(message);

        return {
            success: false,
            message
        };
    } finally {
        setLoading(false);
    }
}, []);

const createTicket = async (ticketData) => {
  try {
    setLoading(true);
    setError("");

    const response = await createTicketService(ticketData);

    if (response?.success) {
      setTickets((currentTickets) => [
        response.ticket,
        ...currentTickets
      ]);

      return {
        success: true,
        ticket: response.ticket,
        message: response.message
      };
    }

    return {
      success: false,
      message: response?.message || "Failed to create ticket."
    };
  } catch (error) {
    console.error("Create Ticket Error:", error);

    const message =
      error.response?.data?.message ||
      "Failed to create ticket.";

    setError(message);

    return {
      success: false,
      message
    };
  } finally {
    setLoading(false);
  }
};
  const sendMessage = (ticketId, content) => {
    return new Promise((resolve) => {
      if (!socket.connected) {
        resolve({ success: false, message: "Socket is not connected." });
        return;
      }
      socket.emit("send-message", { ticketId, content }, (response) => {
        console.log("📨 SEND MESSAGE RESPONSE:", response);
        if (response?.success) {
          resolve({
            success: true,
            message: response.message,
            data: response.data,
          });
        } else {
          resolve({
            success: false,
            message: response?.message || "Failed to send message.",
          });
        }
      });
    });
  };

  const joinTicket = (ticketId) => {
    if (!ticketId) return;

    const handleJoin = () => {
      console.log("🔌 Socket connected:", socket.id);

      socket.emit("join-ticket", ticketId, (response) => {
        console.log("🎫 Join ticket response:", response);
      });
    };

    const handleNewMessage = (message) => {
      console.log("🔥 SOCKET NEW MESSAGE RECEIVED:", message);

      if (message.ticket?.toString() === ticketId.toString()) {
        console.log("✅ MESSAGE BELONGS TO THIS TICKET");

        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    if (socket.connected) {
      handleJoin();
    }

    socket.on("connect", handleJoin);
    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("connect", handleJoin);
      socket.off("new-message", handleNewMessage);
    };
  };

  const value = {
  tickets,
    selectedTicket,
    messages,
    loading,
    error,

    setTickets,
    setSelectedTicket,
    createTicket,
    setMessages,

    getTicketById,
    getTicketMessages,
    getCustomerTickets,
    getAgentTickets,
    sendMessage,
    joinTicket
  };

  return (
    <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
  );
};

export const useTicket = () => {
  const context = useContext(TicketContext);

  if (!context) {
    throw new Error("useTicket must be used inside TicketProvider");
  }

  return context;
};
