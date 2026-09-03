import api from "../../../api/axios.js";

export const getNotificationsService = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const markNotificationAsReadService = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsAsReadService = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data;
};
