import { useEffect, useState } from "react";
import { AlertCircle, Clock3, Plus, Trash2, Users, X } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext.jsx";
import { useAuth } from "../../auth/context/authContext.jsx";
import { deleteAgent } from "../services/admin.service.js";
import {
  createAgentService,
  getAgentsService,
  updateAgentStatusService,
} from "../../auth/services/auth.api.js";

const Agents = () => {
  const { theme } = useTheme();
  const { user, restoringSession } = useAuth();
  const isDark = theme === "dark";
  const [agents, setAgents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const panel = isDark
    ? "border-[#293449] bg-[#121c2d]"
    : "border-[#e8def4] bg-[#f8f3ff]";
  const heading = isDark ? "text-[#f8f0ff]" : "text-[#201d2c]";
  const muted = isDark ? "text-[#9fa9c5]" : "text-[#6c687d]";
  const control = isDark
    ? "border-[#2d3548] bg-[#1b2330] text-[#f3ebff]"
    : "border-[#e9ddf9] bg-[#f9f5ff] text-[#171827]";

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError("");
      setAgents(await getAgentsService());
    } catch (fetchError) {
      setError(
        fetchError.response?.data?.message ||
          "Unable to load agents right now.",
      );
    } finally {
      setLoading(false);
    }
  };
const handleDeleteAgent = async (agentId) => {
  if (!window.confirm("Are you sure you want to delete this agent?")) {
    return;
  }

  try {
    await deleteAgent(agentId);

    setAgents((currentAgents) =>
      currentAgents.filter((agent) => agent._id !== agentId)
    );
  } catch (error) {
    console.error("Delete agent error:", error);

    setError(
      error.response?.data?.message ||
        "Unable to delete agent right now."
    );
  }
};
  useEffect(() => {
    if (!restoringSession && user?.role === "admin") loadAgents();
  }, [restoringSession, user?.role]);

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const agent = await createAgentService(form);
      setAgents((current) =>
        [...current, agent].sort((first, second) =>
          first.username.localeCompare(second.username),
        ),
      );
      setForm({ username: "", email: "", password: "", category: "" });
      setModalOpen(false);
    } catch (createError) {
      setError(
        createError.response?.data?.message || "Unable to create agent.",
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (agent) => {
    try {
      const updatedAgent = await updateAgentStatusService(
        agent._id,
        !agent.active,
      );
      setAgents((current) =>
        current.map((item) =>
          item._id === agent._id ? { ...item, ...updatedAgent } : item,
        ),
      );
    } catch (statusError) {
      setError(
        statusError.response?.data?.message || "Unable to update agent status.",
      );
    }
  };

  if (user && user.role !== "admin")
    return (
      <section className={`rounded-[22px] border p-8 ${panel}`}>
        <p className="text-[#ff7777]">Admin access required.</p>
      </section>
    );

  return (
    <section
      className={`rounded-[22px] border p-5 shadow-[0_20px_45px_rgba(67,47,92,0.12)] sm:p-7 ${panel}`}
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p
            className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${muted}`}
          >
            Support operations
          </p>
          <h1
            className={`text-3xl font-semibold tracking-[-0.05em] ${heading}`}
          >
            Agents
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#9b5ce7] to-[#7f46d9] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(127,70,217,0.3)]"
        >
          <Plus size={16} /> Create Agent
        </button>
      </div>
      {loading ? (
        <div
          className={`flex items-center justify-center gap-3 px-6 py-16 text-sm ${muted}`}
        >
          <Clock3 size={18} /> Loading agents...
        </div>
      ) : error && agents.length === 0 ? (
        <div className="flex items-center gap-3 px-6 py-16 text-sm text-[#ff7777]">
          <AlertCircle size={18} /> {error}
        </div>
      ) : agents.length === 0 ? (
        <div
          className={`flex flex-col items-center px-6 py-16 text-center ${muted}`}
        >
          <Users size={26} />
          <p className={`mt-3 text-lg font-semibold ${heading}`}>
            No agents yet
          </p>
          <p className="mt-1 text-sm">
            Create an agent to start assigning tickets.
          </p>
        </div>
      ) : (
        <div
          className={`overflow-x-auto rounded-[18px] border ${isDark ? "border-[#2b3548]" : "border-[#e7dff3]"}`}
        >
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className={isDark ? "bg-[#171f2d]" : "bg-[#efe8f8]"}>
              <tr>
                {[
                  "Name",
                  "Email",
                  "Status",
                  "Assigned Tickets",
                  "In Progress",
                  "Resolved",
                  "",
                ].map((label) => (
                  <th
                    key={label}
                    className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] ${muted}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className={`divide-y ${isDark ? "divide-[#2b3548]" : "divide-[#e7dff3]"}`}
            >
              {agents.map((agent) => (
                <tr key={agent._id}>
                  <td className={`px-4 py-4 font-semibold ${heading}`}>
                    {agent.username}
                  </td>
                  <td className={`px-4 py-4 ${muted}`}>{agent.email}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${agent.active ? "bg-[#53c7871a] text-[#4ecb91]" : "bg-[#ff5a5a1a] text-[#ff7777]"}`}
                    >
                      {agent.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className={`px-4 py-4 ${heading}`}>
                    {agent.assignedTickets ?? 0}
                  </td>
                  <td className={`px-4 py-4 ${muted}`}>
                    {agent.inProgress ?? 0}
                  </td>
                  <td className={`px-4 py-4 ${muted}`}>
                    {agent.resolved ?? 0}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toggleStatus(agent)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${control}`}
                      >
                        {agent.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        type="button"
                        title="Delete agent"
                        aria-label={`Delete agent ${agent.username}`}
                        onClick={() => handleDeleteAgent(agent._id)}
                        className={`rounded-lg p-2 ${isDark ? "text-[#ff7777] hover:bg-[#ff5a5a1a]" : "text-[#d94c5c] hover:bg-[#ffe8eb]"}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && agents.length > 0 && (
        <p className="mt-4 text-sm text-[#ff7777]">{error}</p>
      )}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080a10]/70 p-4">
          <div
            className={`w-full max-w-md rounded-[22px] border p-6 shadow-2xl ${panel}`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${heading}`}>
                Create Agent
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close create agent dialog"
                className={muted}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              {[
                ["username", "Name", "text"],
                ["email", "Email", "email"],
                ["password", "Password", "password"],
              ].map(([field, label, type]) => (
                <label
                  key={field}
                  className={`block text-sm font-medium ${heading}`}
                >
                  {label}
                  <input
                    required
                    type={type}
                    value={form[field]}
                    onChange={(event) =>
                      setForm({ ...form, [field]: event.target.value })
                    }
                    className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 outline-none focus:border-[#8d5fe5] ${control}`}
                  />
                </label>
              ))}
              <label className={`block text-sm font-medium ${heading}`}>
                Category
                <select
                  required
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 outline-none focus:border-[#8d5fe5] ${control}`}
                >
                  <option value="">Select category</option>
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="account">Account</option>
                  <option value="general">General</option>
                </select>
              </label>
              {error && <p className="text-sm text-[#ff7777]">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${control}`}
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#9b5ce7] to-[#7f46d9] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? "Creating..." : "Create Agent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Agents;
