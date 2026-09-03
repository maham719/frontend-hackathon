import { useCallback, useEffect, useState } from "react";
import {
  getAgentsService,
  deleteAgentService,
} from "../services/admin.service.js";

export const useAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAgentsService();

      setAgents(data);
    } catch (fetchError) {
      console.error("Load agents error:", fetchError);

      setError(
        fetchError.response?.data?.message ||
          "Unable to load agents right now."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteAgent = async (agentId) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) {
      return;
    }

    try {
      setError("");

      await deleteAgentService(agentId);

      setAgents((currentAgents) =>
        currentAgents.filter((agent) => agent._id !== agentId)
      );

      return {
        success: true,
      };
    } catch (error) {
      console.error("Delete agent error:", error);

      const message =
        error.response?.data?.message ||
        "Unable to delete agent right now.";

      setError(message);

      return {
        success: false,
        message,
      };
    }
  };

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  return {
    agents,
    loading,
    error,
    setError,
    loadAgents,
    handleDeleteAgent,
  };
};