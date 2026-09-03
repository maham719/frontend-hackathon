import { useEffect, useState,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, Clock3, MessageSquareText, SendHorizonal, Sparkles, Ticket, TriangleAlert, User } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";
import {useTicket} from "../../features/tickets/context/TicketContext.jsx"
import {useAuth} from "../../features/auth/services/authContext.jsx"
import Loading from "../Loading.jsx";
import socket from "../../services/socket.js";
const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const normalizeStatus = (status = "") => {
  const statusMap = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  };

  return statusMap[status?.toLowerCase()] || status || "Open";
};

const normalizePriority = (priority = "") => {
  const priorityMap = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };

  return priorityMap[priority?.toLowerCase()] || priority || "Medium";
};

const getStatusClass = (status = "Open") => {
  const normalized = status.toLowerCase();

  if (normalized.includes("open")) return "bg-[#5d9dfc1a] text-[#74a9ff]";
  if (normalized.includes("progress")) return "bg-[#7d5dfc1a] text-[#a995ff]";
  if (normalized.includes("resolve")) return "bg-[#53c7871a] text-[#4ecb91]";
  return "bg-[#f3ae451a] text-[#e7ad55]";
};

const getPriorityClass = (priority = "Medium") => {
  const normalized = priority.toLowerCase();

  if (normalized.includes("high") || normalized.includes("urgent")) return "bg-[#ff5a5a1a] text-[#ff6d6d]";
  if (normalized.includes("medium")) return "bg-[#3d77ff1a] text-[#5f8cff]";
  return "bg-[#5ac0871a] text-[#4dbe88]";
};

const formatConfidence = (value) => {
  if (value === null || value === undefined || value === "") return "—";

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "—";

  if (numericValue > 1) {
    return `${Math.min(100, Math.round(numericValue))}%`;
  }

  return `${Math.round(numericValue * 100)}%`;
};

const TicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
const [messageText, setMessageText] = useState("");
const [sending, setSending] = useState(false);
const [notification, setNotification] = useState(null);
const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
const typingTimeoutRef = useRef(null);
 const {
    selectedTicket,
    messages,
    loading,
    error,
    getTicketById,
    getTicketMessages,
    sendMessage,
    setMessages,
    joinTicket
} = useTicket();
const { user,accessToken,restoringSession } = useAuth();


useEffect(() => {
    if (!ticketId || restoringSession || !accessToken) return;

    getTicketById(ticketId);
    getTicketMessages(ticketId);

    console.log("🔑 ACCESS TOKEN EXISTS:", !!accessToken);
    console.log("🔌 SOCKET CONNECTED:", socket.connected);

    const cleanupSocket = joinTicket(
        ticketId,
        accessToken
    );

    return cleanupSocket;
}, [
    ticketId,
    restoringSession,
    accessToken
]);
useEffect(() => {
    const handleNotification = (data) => {
        console.log("🔔 CUSTOMER NOTIFICATION RECEIVED:", data);

        setNotification(data);

        setTimeout(() => {
            setNotification(null);
        }, 4000);
    };

    socket.on("notification", handleNotification);

    return () => {
        socket.off("notification", handleNotification);
    };
}, []);
useEffect(() => {
    if (!ticketId) return;

    const handleUserTyping = ({ userId }) => {
        if (userId !== user?._id) {
            setIsOtherUserTyping(true);
        }
    };

    const handleUserStopTyping = ({ userId }) => {
        if (userId !== user?._id) {
            setIsOtherUserTyping(false);
        }
    };

    socket.on("user-typing", handleUserTyping);
    socket.on("user-stop-typing", handleUserStopTyping);

    return () => {
        socket.off("user-typing", handleUserTyping);
        socket.off("user-stop-typing", handleUserStopTyping);
        setIsOtherUserTyping(false);
    };
}, [ticketId, user?._id]);
  const status = normalizeStatus(selectedTicket?.status);
const priority = normalizePriority(selectedTicket?.priority);


const handleSendMessage = async () => {
    if (!messageText.trim() || sending) return;

    clearTimeout(typingTimeoutRef.current);
    socket.emit("stop-typing", { ticketId });

    setSending(true);

    try {
        const result = await sendMessage(ticketId, messageText);

        if (result.success) {
            setMessageText("");
        }
    } catch (error) {
        console.error("SEND MESSAGE ERROR:", error);
    } finally {
        setSending(false);
    }
};
  return (
    <main
      className={`min-h-screen px-4 py-8 transition-colors duration-300 sm:px-6 lg:px-8 ${
        isDark ? "bg-[#0d1525] text-[#f3ebff]" : "bg-[#f5f0ff] text-[#1f1f2e]"
      }`}
    >
      {notification && (
    <div className="fixed right-5 top-5 z-[9999] w-[340px] rounded-2xl border border-[#8d5fe5] bg-[#1b2330] p-4 text-white shadow-2xl">
        <div className="flex items-start gap-3">
            <div className="mt-0.5">
                <AlertCircle size={20} className="text-[#a995ff]" />
            </div>

            <div>
                <p className="text-sm font-semibold">
                    {notification.title || "New Notification"}
                </p>

                <p className="mt-1 text-xs text-[#c9cde0]">
                    {notification.message}
                </p>
            </div>
        </div>
    </div>
)}
      <div className="mx-auto max-w-7xl">
        {loading ? (
          <Loading/>
        ) : error ? (
          <div
            className={`rounded-[28px] border p-8 shadow-[0_18px_45px_rgba(67,47,92,0.09)] ${
              isDark ? "border-[#2b3548] bg-[#121d2d]" : "border-[#e7dff3] bg-[#f5f1fc]"
            }`}
          >
            <div className="flex items-center gap-3 text-sm">
              <AlertCircle className="h-5 w-5 text-[#ff6d6d]" />
              <span className={isDark ? "text-[#f2dede]" : "text-[#4e475d]"}>{error}</span>
            </div>
          </div>
        ) : !selectedTicket ? (
          <div
            className={`rounded-[28px] border p-8 shadow-[0_18px_45px_rgba(67,47,92,0.09)] ${
              isDark ? "border-[#2b3548] bg-[#121d2d]" : "border-[#e7dff3] bg-[#f5f1fc]"
            }`}
          >
            <div className="flex items-center gap-3 text-sm">
              <TriangleAlert className="h-5 w-5 text-[#ff9a3d]" />
              <span className={isDark ? "text-[#f5dfd1]" : "text-[#4e475d]"}>Ticket not found.</span>
            </div>
          </div>
        ) : (
          <>
            <header
              className={`mb-6 rounded-[28px] border p-5 shadow-[0_18px_45px_rgba(67,47,92,0.09)] ${
                isDark ? "border-[#232d3f] bg-[#121c2d]" : "border-[#e7dff3] bg-[#f8f3ff]"
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                      isDark
                        ? "border-[#2d3548] bg-[#1b2330] text-[#dfe6ff] hover:bg-[#202a3d]"
                        : "border-[#e8def9] bg-[#f5efff] text-[#5d4a96] hover:bg-[#efe6ff]"
                    }`}
                    aria-label="Back to tickets"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <div>
                    <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-[#9aa5c9]" : "text-[#67627b]"}`}>
                      Ticket ID
                    </p>
                    <h1 className={`text-lg font-semibold tracking-[-0.04em] ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
                      {selectedTicket._id ? selectedTicket._id.slice(-6).toUpperCase() : "NEW"}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(status)}`}>
                    {status}
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <h2 className={`text-3xl font-semibold tracking-[-0.06em] ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
                  {selectedTicket.subject || "Untitled ticket"}
                </h2>
              </div>
            </header>

            <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
              <section
                className={`rounded-[28px] border p-5 shadow-[0_18px_45px_rgba(67,47,92,0.08)] ${
                  isDark ? "border-[#232d3f] bg-[#121c2d]" : "border-[#e7dff3] bg-[#f8f3ff]"
                }`}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-[#1d2537] text-[#d7c7ff]" : "bg-[#efe6ff] text-[#6d4bc8]"}`}>
                    <Ticket size={18} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-[#9aa5c9]" : "text-[#67627b]"}`}>
                      Ticket details
                    </p>
                    <h3 className={`text-xl font-semibold ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
                      Customer report
                    </h3>
                  </div>
                </div>

                <div className={`rounded-[20px] border p-5 ${isDark ? "border-[#2b3548] bg-[#172235]" : "border-[#ece1ff] bg-[#f4f0fb]"}`}>
                  <p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>
                    Description
                  </p>
                  <p className={`text-base leading-7 ${isDark ? "text-[#e7ebff]" : "text-[#3f3b4f]"}`}>
                    {selectedTicket.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isDark ? "bg-[#1d2537] text-[#d7c7ff]" : "bg-[#efe6ff] text-[#6d4bc8]"}`}>
                        <MessageSquareText size={16} />
                      </div>
                      <h3 className={`text-lg font-semibold ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
                        Customer conversation
                      </h3>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>
                      {messages.length} messages
                    </span>
                  </div>

                  <div
                    className={`rounded-[22px] border p-4 shadow-[0_12px_28px_rgba(67,47,92,0.05)] ${
                      isDark ? "border-[#2b3548] bg-[#172235]" : "border-[#ece1ff] bg-[#f4f0fb]"
                    }`}
                  >
                    {messages.length === 0 ? (
                      <div className="flex min-h-[220px] items-center justify-center rounded-[18px] border border-dashed p-6 text-center">
                        <div>
                          <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${isDark ? "bg-[#1d2537] text-[#d7c7ff]" : "bg-[#efe6ff] text-[#6d4bc8]"}`}>
                            <MessageSquareText size={20} />
                          </div>
                          <p className={`text-base font-medium ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
                            No conversation messages yet
                          </p>
                          <p className={`mt-2 text-sm ${isDark ? "text-[#d5d1e7]" : "text-[#585270]"}`}>
                            The latest ticket messages will appear here once they are available.
                          </p>
                        </div>
                      </div>
                    ) : (
                     <div className="flex max-h-[55vh] min-h-[250px] flex-col gap-4 overflow-y-auto custom-scrollbar">
  {messages.map((message) => {
    const isAgentMessage =
      message.senderRole === "agent" ||
      message.sender?.role === "agent";

    return (
      <div
        key={
          message._id ||
          `${message.createdAt}-${message.sender?.username}`
        }
        className={`flex ${
          isAgentMessage ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`w-[80%] md:w-[40%] break-words rounded-2xl border px-2 py-2 md:px-3 md:py-3 ${
            isAgentMessage
              ? isDark
                ? "border-[#4d5ecb] bg-[#1f2d52] text-[#f3ebff]"
                : "border-[#d0c0fb] bg-[#efe7ff] text-[#171827]"
              : isDark
                ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff]"
                : "border-[#e7dff3] bg-[#f9f6ff] text-[#1f1f2e]"
          }`}
        >
          <p
            className={`mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
              isDark ? "text-[#b9c4e8]" : "text-[#67627b]"
            }`}
          >
            {message.sender?.username ||
              message.senderRole ||
              (isAgentMessage ? "Agent" : "Customer")}
          </p>

          <p
            className={`text-sm leading-6 ${
              isDark ? "text-[#e7ebff]" : "text-[#3f3b4f]"
            }`}
          >
            {message.content}
          </p>

          <p
            className={`mt-2 text-[10px] ${
              isDark ? "text-[#a9afd4]" : "text-[#6d687d]"
            }`}
          >
            {formatDate(message.createdAt)}
          </p>
        </div>
      </div>
    );
  })}
</div>
                    )}
                  </div>

                  <div className={`mt-5 rounded-[20px] border p-4 shadow-[0_10px_20px_rgba(67,47,92,0.04)] ${isDark ? "border-[#2b3548] bg-[#172235]" : "border-[#ece1ff] bg-[#f4f0fb]"}`}>
                    <label className={`mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>
                      Reply
                    </label>
                    {isOtherUserTyping && (
                      <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                        <span className="animate-pulse">
                          Agent is typing...
                        </span>
                      </div>
)}
                    <textarea
                      rows={4}
                      value={messageText}
                    onChange={(e) => {
    const value = e.target.value;

    setMessageText(value);

    clearTimeout(typingTimeoutRef.current);

    if (!value.trim()) {
        socket.emit("stop-typing", { ticketId });
        return;
    }

    socket.emit("typing", { ticketId });

    typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", { ticketId });
    }, 1000);
}}
                      placeholder="Type your response to the customer..."
                      className={`w-full resize-none rounded-xl border px-3 py-3 text-sm outline-none transition-colors ${
                        isDark
                          ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff] placeholder:text-[#8c9ac0] focus:border-[#8d5fe5]"
                          : "border-[#ddcffd] bg-[#f9f5ff] text-[#171827] placeholder:text-[#7d7788] focus:border-[#a36ae8]"
                      }`}
                    />

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={!messageText.trim() || sending}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                          isDark
                            ? "bg-[#8d5fe5] text-white hover:bg-[#7a4fe0] disabled:bg-[#2b3548] disabled:text-[#9aa5c9]"
                            : "bg-[#8d5fe5] text-white hover:bg-[#7a4fe0] disabled:bg-[#e9ddff] disabled:text-[#7a5ec8]"
                        }`}
                      >
                        <SendHorizonal size={16} />
                        {sending ? "Sending..." : "Send message"}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <aside
                className={`rounded-[28px] border p-5 shadow-[0_18px_45px_rgba(67,47,92,0.08)] ${
                  isDark ? "border-[#232d3f] bg-[#121c2d]" : "border-[#e7dff3] bg-[#f8f3ff]"
                }`}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-[#1d2537] text-[#d7c7ff]" : "bg-[#efe6ff] text-[#6d4bc8]"}`}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-[#9aa5c9]" : "text-[#67627b]"}`}>
                      Overview
                    </p>
                    <h3 className={`text-xl font-semibold ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
                      Ticket info
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={`rounded-[20px] border p-4 ${isDark ? "border-[#2b3548] bg-[#172235]" : "border-[#ece1ff] bg-[#f4f0fb]"}`}>
                    <div className="mb-3 flex items-center gap-2">
                      <User className={`h-4 w-4 ${isDark ? "text-[#c3b5ff]" : "text-[#6d4bc8]"}`} />
                      <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>
                        Customer information
                      </p>
                    </div>

                    <dl className="space-y-3 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Customer</dt>
                        <dd className={`font-medium ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
                        {selectedTicket.customer?.username ||
    selectedTicket.customer?.email ||
    "Customer not available"}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Category</dt>
                        <dd className={`font-medium ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
                          {selectedTicket.customerCategory || "Not specified"}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Urgency</dt>
                        <dd className="font-medium text-[#ff7b54]">
                          {selectedTicket.customerUrgency || "Not specified"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className={`rounded-[20px] border p-4 ${isDark ? "border-[#2b3548] bg-[#172235]" : "border-[#ece1ff] bg-[#f4f0fb]"}`}>
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles className={`h-4 w-4 ${isDark ? "text-[#c3b5ff]" : "text-[#6d4bc8]"}`} />
                      <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>
                        AI triage
                      </p>
                    </div>

                    <dl className="space-y-3 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Category</dt>
                        <dd className={`font-medium ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
                          {selectedTicket.category || "Not classified"}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Priority</dt>
                        <dd>
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getPriorityClass(priority)}`}>
                            {priority}
                          </span>
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Confidence</dt>
                        <dd className={`font-medium ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
                          {formatConfidence(selectedTicket.aiConfidence)}
                        </dd>
                      </div>
                      <div className="pt-2">
                        <dt className={`mb-1 block ${isDark ? "text-[#c3cce8]" : "text-[#514d64]"}`}>Summary</dt>
                        <dd className={`leading-6 ${isDark ? "text-[#e7ebff]" : "text-[#3f3b4f]"}`}>
                          {selectedTicket.aiSummary || "AI summary is not available yet."}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className={`rounded-[20px] border p-4 ${isDark ? "border-[#2b3548] bg-[#172235]" : "border-[#ece1ff] bg-[#f4f0fb]"}`}>
                    <div className="mb-3 flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 ${isDark ? "text-[#c3b5ff]" : "text-[#6d4bc8]"}`} />
                      <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-[#a9afd4]" : "text-[#67627b]"}`}>
                        Ticket status
                      </p>
                    </div>

                    <dl className="space-y-3 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Status</dt>
                        <dd>
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(status)}`}>
                            {status}
                          </span>
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Assigned agent</dt>
                        <dd className={`font-medium ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
                      {selectedTicket.assignedAgent?.username ||
    selectedTicket.assignedAgent?.email ||
    "Unassigned"}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Created</dt>
                        <dd className={`font-medium ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
                          {formatDate(selectedTicket.createdAt)}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Updated</dt>
                        <dd className={`font-medium ${isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]"}`}>
                          {formatDate(selectedTicket.updatedAt)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default TicketDetail;
