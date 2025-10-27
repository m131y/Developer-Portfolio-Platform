import api from "./api";

const NotificationService = {
  getAllNotification: async (userId) => {
    const response = await api.get(`/api/notification/${userId}`);
    return response.data;
  },
};

export default NotificationService;
