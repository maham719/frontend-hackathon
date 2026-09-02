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

export const getCustomersService = async () => {
	const response = await api.get("/admin/customers");
	return response.data?.customers || [];
};

export const getCustomerDetailsService = async (customerId) => {
	const response = await api.get(`/admin/customers/${customerId}`);
	return response.data;
};

export const getAnalyticsService = async (range) => {
	const response = await api.get(`/admin/analytics?range=${range}`);
	return response.data;
};

export const getSettingsService = async () => {
	const response = await api.get("/admin/settings");
	return response.data?.settings;
};

export const updateSettingsService = async (settings) => {
	const response = await api.put("/admin/settings", settings);
	return response.data?.settings;
};

export const updateProfileService = async (profile) => {
	const response = await api.put("/admin/profile", profile);
	return response.data?.user;
};
