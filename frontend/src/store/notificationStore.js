import { create } from "zustand";
import NotificationService from "../services/notification";

const useNotificationStore = create((set) => ({
  previousNotifications: [],
  loading: false,
  error: null,

  getAllNotification: async (userId) => {
    set({ loading: true, error: null });
    try {
      const content = await NotificationService.getAllNotification(userId);
      set({ previousNotifications: content, loading: false });
      return content;
    } catch (err) {
      set({
        error: err.response?.data.message || "Failed to get notifications",
        loading: false,
      });
    }
  },
}));

export default useNotificationStore;
