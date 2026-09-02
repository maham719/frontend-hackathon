import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../services/socket.js";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MessageSquareText,
  SendHorizonal,
  Sparkles,
  Ticket,
  User,
} from "lucide-react";
import api from "../../api/axios.js";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useAuth } from "../../features/auth/services/authContext.jsx";
import { useRef } from "react";

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
  const map = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  };
  return map[status?.toLowerCase()] || status || "Open";
};

const normalizePriority = (priority = "") => {
  const map = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };
  return map[priority?.toLowerCase()] || priority || "Medium";
};

const normalizeCategory = (category = "") => {
  const map = {
    technical: "Technical",
    billing: "Billing",
    account: "Account",
    general: "General",
  };
  return map[category?.toLowerCase()] || category || "General";
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
  if (numericValue > 1) return `${Math.min(100, Math.round(numericValue))}%`;
  return `${Math.round(numericValue * 100)}%`;
};

const statusOptions = ["open", "in_progress", "resolved", "closed"];
const priorityOptions = ["low", "medium", "high", "urgent"];
const categoryOptions = ["technical", "billing", "account", "general"];

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, accessToken, restoringSession  } = useAuth();
  const isDark = theme === "dark";

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [savingAi, setSavingAi] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");
  const [showAiEdit, setShowAiEdit] = useState(false);
  const [statusDraft, setStatusDraft] = useState("open");
  const [priorityDraft, setPriorityDraft] = useState("medium");
  const [categoryDraft, setCategoryDraft] = useState("general");
  const [notification, setNotification] = useState(null);
  const [aiDraft, setAiDraft] = useState({
    category: "general",
    priority: "medium",
    summary: "",
    confidence: null,
    agent: null,
  });
const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
const typingTimeoutRef = useRef(null);
  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/tickets/${ticketId}`, { withCredentials: true });
      const nextTicket = response.data?.ticket || null;
      setTicket(nextTicket);

      setStatusDraft(nextTicket?.status || "open");
      setPriorityDraft(nextTicket?.priority || "medium");
      setCategoryDraft(nextTicket?.category || "general");

      setAiDraft({
        category: nextTicket?.aiSuggestedCategory || nextTicket?.category || "general",
        priority: nextTicket?.aiSuggestedPriority || nextTicket?.priority || "medium",
        summary: nextTicket?.aiSummary || "",
        confidence: nextTicket?.aiConfidence ?? null,
        agent: nextTicket?.aiSuggestedAgent || nextTicket?.assignedAgent || null,
      });
    } catch (fetchError) {
      console.error("GET TICKET ERROR:", fetchError);
      setError(fetchError.response?.data?.message || "Unable to load the ticket right now.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/tickets/${ticketId}/messages`, { withCredentials: true });
      setMessages(response.data?.messages || []);
    } catch (fetchError) {
      console.error("GET MESSAGES ERROR:", fetchError);
      setMessages([]);
    }
  };
  useEffect(() => {
    const handleNotification = (data) => {
        console.log("🔔 NOTIFICATION RECEIVED:", data);

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
    if (!ticketId || restoringSession || !accessToken) return;

    const roomName = `ticket:${ticketId}`;

    socket.emit("join-ticket", ticketId, (response) => {
        console.log("🎫 AGENT JOIN TICKET:", response);
    });

    return () => {
        socket.emit("stop-typing", { ticketId });
    };
}, [ticketId, accessToken, restoringSession]);
useEffect(() => {
    if (!ticketId || restoringSession || !accessToken) return;

    fetchTicket();
    fetchMessages();
}, [ticketId, restoringSession, accessToken]);

useEffect(() => {
    if (!ticketId) return;

    const handleUserTyping = ({ userId }) => {
       console.log("👀 AGENT RECEIVED TYPING:", userId);
    console.log("👤 MY USER ID:", user?._id);
        if (userId !== user?._id) {
            setIsOtherUserTyping(true);
        }
    };

    const handleUserStopTyping = ({ userId }) => {
       console.log("👀 AGENT RECEIVED STOP TYPING:", userId);
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

  const currentStatus = normalizeStatus(ticket?.status || statusDraft);
  const currentPriority = normalizePriority(ticket?.priority || priorityDraft);
  const currentCategory = normalizeCategory(ticket?.category || categoryDraft);

  const aiSummary = ticket?.aiSummary || aiDraft.summary || "No AI summary is available yet.";
  const aiConfidence = ticket?.aiConfidence ?? aiDraft.confidence;

  const activityEntries = useMemo(() => {
    if (!ticket || !Array.isArray(ticket.activity)) return [];
    return ticket.activity.slice(0, 5);
  }, [ticket]);

  const panelClass = isDark ? "border-[#232d3f] bg-[#121c2d]" : "border-[#e7dff3] bg-[#f8f3ff]";
  const softPanel = isDark ? "border-[#2b3548] bg-[#172235]" : "border-[#ece1ff] bg-[#f4f0fb]";
  const heading = isDark ? "text-[#f3ebff]" : "text-[#1f1f2e]";
  const subText = isDark ? "text-[#9aa5c9]" : "text-[#67627b]";
  const muted = isDark ? "text-[#d9e1f5]" : "text-[#4d4a5f]";
  const inputClass = isDark
    ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff] placeholder:text-[#8c9ac0] focus:border-[#8d5fe5]"
    : "border-[#ddcffd] bg-[#f9f5ff] text-[#171827] placeholder:text-[#7d7788] focus:border-[#a36ae8]";

  const handleSendMessage = async () => {
   if (!messageText.trim() || sending) return;

    clearTimeout(typingTimeoutRef.current);
    socket.emit("stop-typing", { ticketId });

    setSending(true);

    try {
      setSending(true);
      const response = await api.post(
        `/tickets/${ticketId}/messages`,
        { content: messageText.trim() },
        { withCredentials: true }
      );

      const newMessage = response.data?.data || response.data?.message;
      if (newMessage) {
        setMessages((prev) => [...prev, newMessage]);
      }
      setMessageText("");
    } catch (sendError) {
      console.error("SEND MESSAGE ERROR:", sendError);
      setError(sendError.response?.data?.message || "Failed to send your message.");
    } finally {
      setSending(false);
    }
  };

  const handleAiReview = async (accepted = false) => {
    if (!ticketId) return;

    try {
      setSavingAi(true);
      const payload = {
        category: aiDraft.category || categoryDraft || ticket?.category || "general",
        priority: aiDraft.priority || priorityDraft || ticket?.priority || "medium",
        assignedAgent: aiDraft.agent?._id || aiDraft.agent || ticket?.assignedAgent?._id || ticket?.assignedAgent || user?._id,
        accepted,
      };

      const response = await api.patch(`/tickets/${ticketId}/ai-review`, payload, { withCredentials: true });
      const updatedTicket = response.data?.ticket || response.data;

      if (updatedTicket) {
        setTicket((prev) => ({ ...prev, ...updatedTicket }));
        setCategoryDraft(updatedTicket.category || payload.category);
        setPriorityDraft(updatedTicket.priority || payload.priority);
        setAiDraft({
          category: updatedTicket.aiSuggestedCategory || payload.category,
          priority: updatedTicket.aiSuggestedPriority || payload.priority,
          summary: updatedTicket.aiSummary || aiSummary,
          confidence: updatedTicket.aiConfidence ?? aiConfidence,
          agent: updatedTicket.aiSuggestedAgent || updatedTicket.assignedAgent || payload.assignedAgent,
        });
      }

      setShowAiEdit(false);
    } catch (reviewError) {
      console.error("AI REVIEW ERROR:", reviewError);
      setError(reviewError.response?.data?.message || "Unable to apply AI suggestions right now.");
    } finally {
      setSavingAi(false);
    }
  };

  const handleResolveTicket = async () => {
    if (!resolutionNote.trim()) {
      setError("Add a resolution note before resolving this ticket.");
      return;
    }

    const confirmed = window.confirm("Resolve this ticket after review? This action should be confirmed before closing the issue.");
    if (!confirmed) return;

    try {
      setSavingAi(true);
      const payload = {
        category: ticket?.category || categoryDraft,
        priority: ticket?.priority || priorityDraft,
        assignedAgent: ticket?.assignedAgent?._id || ticket?.assignedAgent || user?._id,
        accepted: true,
      };

      const response = await api.patch(
    `/tickets/${ticketId}/resolve`,
    {
        resolutionNote
    },
    {
        withCredentials: true
    }
);
      const updatedTicket = response.data?.ticket || response.data;
      if (updatedTicket) {
        setTicket((prev) => ({ ...prev, ...updatedTicket, resolutionNote }));
        setStatusDraft(updatedTicket.status || "resolved");
        setCategoryDraft(updatedTicket.category || payload.category);
        setPriorityDraft(updatedTicket.priority || payload.priority);
      }
      setResolutionNote("");
    } catch (resolveError) {
      console.error("RESOLVE TICKET ERROR:", resolveError);
      setError(resolveError.response?.data?.message || "The current app does not expose a dedicated resolve action for tickets.");
    } finally {
      setSavingAi(false);
    }
  };

  if (loading) {
    return (
      <main className={`min-h-screen px-4 py-8 ${isDark ? "bg-[#0d1525] text-[#f3ebff]" : "bg-[#f5f0ff] text-[#1f1f2e]"}`}>
        <div className="mx-auto max-w-7xl rounded-[28px] border border-dashed p-12 text-center">
          <Clock3 className="mx-auto mb-3 h-5 w-5 animate-spin text-[#8d5fe5]" />
          <p className={subText}>Loading ticket details...</p>
        </div>
      </main>
    );
  }

  if (error && !ticket) {
    return (
      <main className={`min-h-screen px-4 py-8 ${isDark ? "bg-[#0d1525] text-[#f3ebff]" : "bg-[#f5f0ff] text-[#1f1f2e]"}`}>
      
        <div className="mx-auto max-w-5xl rounded-[28px] border p-8 shadow-[0_18px_45px_rgba(67,47,92,0.08)] ${panelClass}">
          <div className="flex items-center gap-3 text-sm">
            <AlertCircle className="h-5 w-5 text-[#ff6d6d]" />
            <span className={isDark ? "text-[#f2dede]" : "text-[#4e475d]"}>{error}</span>
          </div>
        </div>
        
      </main>
    );
  }

  if (!ticket) return null;

  const customerName = ticket.customer?.username || ticket.customer?.email || "Customer not available";
  const assignedAgentName = ticket.assignedAgent?.username || ticket.assignedAgent?.email || "Unassigned";

  return (
    <main className={`min-h-screen px-4 py-8 transition-colors duration-300 sm:px-6 lg:px-8 ${isDark ? "bg-[#0d1525] text-[#f3ebff]" : "bg-[#f5f0ff] text-[#1f1f2e]"}`}>
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
        <header className={`mb-6 rounded-[28px] border p-5 shadow-[0_18px_45px_rgba(67,47,92,0.09)] ${panelClass}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${isDark ? "border-[#2d3548] bg-[#1b2330] text-[#dfe6ff] hover:bg-[#202a3d]" : "border-[#e8def9] bg-[#f5efff] text-[#5d4a96] hover:bg-[#efe6ff]"}`}
                aria-label="Back to tickets"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>Ticket ID</p>
                <h1 className={`text-lg font-semibold tracking-[-0.04em] ${heading}`}>
                  {ticket._id ? ticket._id.slice(-6).toUpperCase() : "NEW"}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(currentStatus)}`}>
                {currentStatus}
              </span>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getPriorityClass(currentPriority)}`}>
                {currentPriority}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>Subject</p>
              <h2 className={`text-3xl font-semibold tracking-[-0.06em] ${heading}`}>{ticket.subject || "Untitled ticket"}</h2>
            </div>

            <div className={`flex flex-wrap items-center gap-3 text-sm ${muted}`}>
              <span>Customer: {customerName}</span>
              <span>•</span>
              <span>Created: {formatDate(ticket.createdAt)}</span>
              <span>•</span>
              <span>Updated: {formatDate(ticket.updatedAt)}</span>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
          <section className={`rounded-[28px] border p-5 shadow-[0_18px_45px_rgba(67,47,92,0.08)] ${panelClass}`}>
            <div className="mb-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Customer", customerName],
                ["Category", normalizeCategory(ticket.category || categoryDraft)],
                ["Priority", normalizePriority(ticket.priority || priorityDraft)],
                ["Status", normalizeStatus(ticket.status || statusDraft)],
              ].map(([label, value]) => (
                <div key={label} className={`rounded-[18px] border p-4 ${softPanel}`}>
                  <p className={`mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>{label}</p>
                  <p className={`text-sm font-semibold ${heading}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className={`mb-6 rounded-[20px] border p-5 ${softPanel}`}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-[#1d2537] text-[#d7c7ff]" : "bg-[#efe6ff] text-[#6d4bc8]"}`}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>AI triage</p>
                    <h3 className={`text-xl font-semibold ${heading}`}>AI Triage Suggestions</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAiEdit((prev) => !prev)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold ${isDark ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff]" : "border-[#e9ddf9] bg-[#f9f5ff] text-[#171827]"}`}
                  >
                    Edit Suggestions
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAiReview(true)}
                    disabled={savingAi}
                    className="rounded-xl bg-[#8d5fe5] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    {savingAi ? "Saving..." : "Accept Suggestions"}
                  </button>
                </div>
              </div>

              {showAiEdit && (
                <div className="mb-4 grid gap-3 md:grid-cols-2">
                  <label className="block">
                    <span className={`mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>Category</span>
                    <select
                      value={aiDraft.category || categoryDraft}
                      onChange={(event) => setAiDraft((prev) => ({ ...prev, category: event.target.value }))}
                      className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#8d5fe5] ${inputClass}`}
                    >
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>{normalizeCategory(option)}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className={`mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>Priority</span>
                    <select
                      value={aiDraft.priority || priorityDraft}
                      onChange={(event) => setAiDraft((prev) => ({ ...prev, priority: event.target.value }))}
                      className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#8d5fe5] ${inputClass}`}
                    >
                      {priorityOptions.map((option) => (
                        <option key={option} value={option}>{normalizePriority(option)}</option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className={`rounded-[16px] border p-3 ${isDark ? "border-[#2b3548] bg-[#172235]" : "border-[#e7dff3] bg-[#f7f3ff]"}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>Suggested category</p>
                  <p className={`mt-2 text-sm font-semibold ${heading}`}>{normalizeCategory(aiDraft.category || ticket.aiSuggestedCategory || ticket.category || "general")}</p>
                </div>
                <div className={`rounded-[16px] border p-3 ${isDark ? "border-[#2b3548] bg-[#172235]" : "border-[#e7dff3] bg-[#f7f3ff]"}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>Suggested priority</p>
                  <p className={`mt-2 text-sm font-semibold ${heading}`}>{normalizePriority(aiDraft.priority || ticket.aiSuggestedPriority || ticket.priority || "medium")}</p>
                </div>
                <div className={`rounded-[16px] border p-3 ${isDark ? "border-[#2b3548] bg-[#172235]" : "border-[#e7dff3] bg-[#f7f3ff]"}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>Confidence</p>
                  <p className={`mt-2 text-sm font-semibold ${heading}`}>{formatConfidence(aiConfidence)}</p>
                </div>
                <div className={`rounded-[16px] border p-3 ${isDark ? "border-[#2b3548] bg-[#172235]" : "border-[#e7dff3] bg-[#f7f3ff]"}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>Suggested agent</p>
                  <p className={`mt-2 text-sm font-semibold ${heading}`}>{ticket.aiSuggestedAgent?.username || ticket.aiSuggestedAgent?.email || assignedAgentName}</p>
                </div>
              </div>

              <div className={`mt-5 rounded-[18px] border p-4 ${isDark ? "border-[#2b3548] bg-[#172235]" : "border-[#e7dff3] bg-[#f8f4ff]"}`}>
                <p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>AI Summary</p>
                <p className={`text-sm leading-7 ${muted}`}>{aiSummary}</p>
              </div>

              {showAiEdit && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleAiReview(false)}
                    disabled={savingAi}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold ${isDark ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff]" : "border-[#e9ddf9] bg-[#f9f5ff] text-[#171827]"}`}
                  >
                    {savingAi ? "Updating..." : "Save AI Review"}
                  </button>
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-[#1d2537] text-[#d7c7ff]" : "bg-[#efe6ff] text-[#6d4bc8]"}`}>
                    <MessageSquareText size={18} />
                  </div>
                  <h3 className={`text-xl font-semibold ${heading}`}>Customer conversation</h3>
                </div>
                <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>{messages.length} messages</p>
              </div>

              <div className={`rounded-[22px] border p-4 ${softPanel}`}>
                {messages.length === 0 ? (
                  <div className="flex min-h-[220px] items-center justify-center rounded-[18px] border border-dashed p-6 text-center">
                    <div>
                      <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${isDark ? "bg-[#1d2537] text-[#d7c7ff]" : "bg-[#efe6ff] text-[#6d4bc8]"}`}>
                        <MessageSquareText size={20} />
                      </div>
                      <p className={`text-base font-medium ${heading}`}>No conversation messages yet</p>
                      <p className={`mt-2 text-sm ${muted}`}>The latest ticket messages will appear here once they are available.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isAgentMessage = message.senderRole === "agent" || message.sender?.role === "agent" || message.sender?._id === user?._id;

                      return (
                        <div key={message._id || `${message.createdAt}-${message.sender?.username}`} className={`flex ${isAgentMessage ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[85%] rounded-2xl border px-4 py-3 ${isAgentMessage ? (isDark ? "border-[#4d5ecb] bg-[#1f2d52] text-[#f3ebff]" : "border-[#d0c0fb] bg-[#efe7ff] text-[#171827]") : (isDark ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff]" : "border-[#e7dff3] bg-[#f9f6ff] text-[#1f1f2e]")}`}>
                            <p className={`mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${isDark ? "text-[#b9c4e8]" : "text-[#67627b]"}`}>
                              {message.sender?.username || message.senderRole || (isAgentMessage ? "Agent" : "Customer")}
                            </p>
                            <p className={`text-sm leading-6 ${isDark ? "text-[#e7ebff]" : "text-[#3f3b4f]"}`}>{message.content}</p>
                            <p className={`mt-2 text-[10px] ${isDark ? "text-[#a9afd4]" : "text-[#6d687d]"}`}>{formatDate(message.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={`mt-5 rounded-[20px] border p-4 ${softPanel}`}>
                <label className={`mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>Reply</label>
                {isOtherUserTyping && (
    <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
        <span className="animate-pulse">
            {user?.role === "agent"
                ? "Customer is typing..."
                : "Agent is typing..."}
        </span>
    </div>
)}
                <textarea
                  rows={4}
                  value={messageText}
                 onChange={(event) => {
    const value = event.target.value;

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
                  className={`w-full resize-none rounded-xl border px-3 py-3 text-sm outline-none transition-colors ${inputClass}`}
                />

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sending}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#8d5fe5] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    <SendHorizonal size={16} />
                    {sending ? "Sending..." : "Send message"}
                  </button>
                </div>
              </div>
            </div>

            <div className={`rounded-[20px] border p-5 ${softPanel}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-[#1d2537] text-[#d7c7ff]" : "bg-[#efe6ff] text-[#6d4bc8]"}`}>
                  <CheckCircle2 size={18} />
                </div>
                <h3 className={`text-xl font-semibold ${heading}`}>Ticket controls</h3>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <label className="block">
                  <span className={`mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>Status</span>
                  <select
                    value={statusDraft}
                    onChange={(event) => setStatusDraft(event.target.value)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#8d5fe5] ${inputClass}`}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>{normalizeStatus(option)}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className={`mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>Priority</span>
                  <select
                    value={priorityDraft}
                    onChange={(event) => setPriorityDraft(event.target.value)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#8d5fe5] ${inputClass}`}
                  >
                    {priorityOptions.map((option) => (
                      <option key={option} value={option}>{normalizePriority(option)}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className={`mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>Category</span>
                  <select
                    value={categoryDraft}
                    onChange={(event) => setCategoryDraft(event.target.value)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[#8d5fe5] ${inputClass}`}
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>{normalizeCategory(option)}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setSavingAi(true);
                      const response = await api.patch(
                        `/tickets/${ticketId}/ai-review`,
                        {
                          category: categoryDraft,
                          priority: priorityDraft,
                          assignedAgent: ticket.assignedAgent?._id || ticket.assignedAgent || user?._id,
                          accepted: true,
                        },
                        { withCredentials: true }
                      );

                      const updatedTicket = response.data?.ticket || response.data;
                      if (updatedTicket) setTicket((prev) => ({ ...prev, ...updatedTicket }));
                    } catch (updateError) {
                      console.error("UPDATE TICKET VALUES ERROR:", updateError);
                      setError(updateError.response?.data?.message || "The current app does not expose a dedicated ticket update endpoint for status changes.");
                    } finally {
                      setSavingAi(false);
                    }
                  }}
                  disabled={savingAi}
                  className="rounded-xl bg-[#8d5fe5] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {savingAi ? "Updating..." : "Apply ticket updates"}
                </button>
              </div>
            </div>

            <div className={`mt-6 rounded-[20px] border p-5 ${softPanel}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-[#1d2537] text-[#d7c7ff]" : "bg-[#efe6ff] text-[#6d4bc8]"}`}>
                  <ChevronRight size={18} />
                </div>
                <h3 className={`text-xl font-semibold ${heading}`}>Resolution</h3>
              </div>

              <textarea
                rows={4}
                value={resolutionNote}
                onChange={(event) => setResolutionNote(event.target.value)}
                placeholder="Write a resolution summary before closing this ticket..."
                className={`w-full resize-none rounded-xl border px-3 py-3 text-sm outline-none transition-colors ${inputClass}`}
              />

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleResolveTicket}
                  disabled={savingAi || !resolutionNote.trim()}
                  className="rounded-xl bg-[#4ecb91] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {savingAi ? "Resolving..." : "Resolve Ticket"}
                </button>
              </div>
            </div>

            {activityEntries.length > 0 && (
              <div className={`mt-6 rounded-[20px] border p-5 ${softPanel}`}>
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-[#1d2537] text-[#d7c7ff]" : "bg-[#efe6ff] text-[#6d4bc8]"}`}>
                    <Clock3 size={18} />
                  </div>
                  <h3 className={`text-xl font-semibold ${heading}`}>Ticket activity</h3>
                </div>

                <div className="space-y-3">
                  {activityEntries.map((entry) => (
                    <div key={entry._id || entry.type || entry.message} className={`rounded-[16px] border p-3 ${isDark ? "border-[#2b3548] bg-[#172235]" : "border-[#e7dff3] bg-[#f8f4ff]"}`}>
                      <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>{entry.type || "Activity"}</p>
                      <p className={`mt-2 text-sm ${muted}`}>{entry.message || "Ticket activity was recorded."}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <aside className={`rounded-[28px] border p-5 shadow-[0_18px_45px_rgba(67,47,92,0.08)] ${panelClass}`}>
            <div className="mb-5 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? "bg-[#1d2537] text-[#d7c7ff]" : "bg-[#efe6ff] text-[#6d4bc8]"}`}>
                <Sparkles size={18} />
              </div>
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>Overview</p>
                <h3 className={`text-xl font-semibold ${heading}`}>Ticket info</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`rounded-[20px] border p-4 ${softPanel}`}>
                <div className="mb-3 flex items-center gap-2">
                  <User className={`h-4 w-4 ${isDark ? "text-[#c3b5ff]" : "text-[#6d4bc8]"}`} />
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>Customer</p>
                </div>

                <dl className="space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Name</dt>
                    <dd className={`font-medium ${heading}`}>{customerName}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Email</dt>
                    <dd className={`font-medium ${heading}`}>{ticket.customer?.email || "Not available"}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Category</dt>
                    <dd className={`font-medium ${heading}`}>{normalizeCategory(ticket.customerCategory || ticket.category || "general")}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Urgency</dt>
                    <dd className={`font-medium ${heading}`}>{normalizePriority(ticket.customerUrgency || ticket.priority || "medium")}</dd>
                  </div>
                </dl>
              </div>

              <div className={`rounded-[20px] border p-4 ${softPanel}`}>
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className={`h-4 w-4 ${isDark ? "text-[#c3b5ff]" : "text-[#6d4bc8]"}`} />
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>AI insight</p>
                </div>

                <dl className="space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Confidence</dt>
                    <dd className={`font-medium ${heading}`}>{formatConfidence(aiConfidence)}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Suggested category</dt>
                    <dd className={`font-medium ${heading}`}>{normalizeCategory(aiDraft.category || ticket.aiSuggestedCategory || ticket.category || "general")}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Suggested priority</dt>
                    <dd className={`font-medium ${heading}`}>{normalizePriority(aiDraft.priority || ticket.aiSuggestedPriority || ticket.priority || "medium")}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Suggested agent</dt>
                    <dd className={`font-medium ${heading}`}>{ticket.aiSuggestedAgent?.username || ticket.aiSuggestedAgent?.email || assignedAgentName}</dd>
                  </div>
                </dl>
              </div>

              <div className={`rounded-[20px] border p-4 ${softPanel}`}>
                <div className="mb-3 flex items-center gap-2">
                  <Ticket className={`h-4 w-4 ${isDark ? "text-[#c3b5ff]" : "text-[#6d4bc8]"}`} />
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${subText}`}>Current state</p>
                </div>

                <dl className="space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Status</dt>
                    <dd>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(currentStatus)}`}>{currentStatus}</span>
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Priority</dt>
                    <dd>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getPriorityClass(currentPriority)}`}>{currentPriority}</span>
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Assigned agent</dt>
                    <dd className={`font-medium ${heading}`}>{assignedAgentName}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className={isDark ? "text-[#c3cce8]" : "text-[#514d64]"}>Last updated</dt>
                    <dd className={`font-medium ${heading}`}>{formatDate(ticket.updatedAt)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default TicketDetails;

