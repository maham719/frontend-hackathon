import api from "../../../api/axios.js";

export const getRecentActivitiesService = async () => {
    const response = await api.get("/activities/recent");

    return response.data;
};

export const getMyActivitiesService = async () => {
    const response = await api.get("/activities/my");
    return response.data;
};