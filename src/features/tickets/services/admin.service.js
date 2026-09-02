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