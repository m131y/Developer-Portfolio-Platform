import { create } from "zustand";
import messageRoomService from "../services/messageRoom";

const useMessageRoomStore = create((set) => ({
  previousMessage: [],
  messageRooms: [],
  loading: false,
  error: null,

  createMessageRoom: async (requestBody) => {
    set({ loading: true, error: null });
    try {
      const newMessageRoom = await messageRoomService.createMessageRoom(
        requestBody
      );
      console.log(newMessageRoom);
      set((state) => ({
        messageRooms: [newMessageRoom, ...state.messageRooms],
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data.message || "Failed to create message rooms",
        loading: false,
      });
      throw err;
    }
  },

  fetchMessageRooms: async (page = 0) => {
    set({ loading: true, error: null });
    try {
      const content = await messageRoomService.getAllMessageRooms(page);
      console.log(content);
      set({
        messageRooms: content,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data.message || "Failed to message rooms",
        loading: false,
      });
      throw err;
    }
  },

  deleteMessageRooms: async (roomId) => {
    set({ loading: true, error: null });
    try {
      await messageRoomService.deleteMessageRooms(roomId);
      set((state) => ({
        messageRooms: state.messageRooms.filter((r) => r.id !== roomId),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data.message || "Failed to delete message rooms",
        loading: false,
      });
      throw err;
    }
  },

  fetchMessagesByRoom: async (roomId) => {
    try {
      const content = await messageRoomService.getMessagesByRoom(roomId);
      set({ previousMessage: content, loading: false });
      return content;
    } catch (err) {
      set({
        error: err.response?.data.message || "Failed to get messages by room",
        loading: false,
      });
    }
  },
}));

export default useMessageRoomStore;
