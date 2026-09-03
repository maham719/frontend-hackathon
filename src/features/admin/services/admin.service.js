import api from "../../../api/axios.js";
export const getAgentsService = async () => {
    const response = await api.get("/admin/agents");
    return response.data?.agents || [];
};

export const createAgentService = async (agentData) => {
    const response = await api.post("/admin/agents", agentData);
    return response.data?.agent;
};

export const updateAgentStatusService = async (agentId, active) => {
    const response = await api.patch(`/admin/agents/${agentId}/status`, { active });
    return response.data?.agent;
};

export const getAllTicketsService = async () => {
    const response = await api.get("/admin/tickets");
    return response.data?.tickets || [];
};

export const getAnalyticsService = async (range = 7) => {
    const response = await api.get(`/admin/analytics?range=${range}`);

    return response.data;
};

export const deleteAgent = async (agentId) => {
  try {
    const response = await api.delete(`/admin/agents/${agentId}`);

    return {
      success: true,
      message: response.data?.message || "Agent deleted successfully",
    };
  } catch (error) {
    console.error(
      "Delete agent error:",
      error.response?.data?.message || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Unable to delete agent right now.",
    };
  }
};