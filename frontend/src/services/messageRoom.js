import api from "./api";

const messageRoomService = {
  createMessageRoom: async (requestBody) => {
    console.log(requestBody);
    const response = await api.post("/api/messages/rooms", requestBody);
    return response.data;
  },

  getAllMessageRooms: async (page = 0, size = 10) => {
    const response = await api.get("/api/messages/rooms", {
      params: { page, size },
    });
    // return response.data.content;
    return Array.isArray(response?.data?.content)
      ? response.data.content
      : response.data;
  },

  deleteMessageRooms: async (roomId) => {
    await api.delete(`/api/messages/rooms/${roomId}`);
  },

  getMessagesByRoom: async (roomId) => {
    const response = await api.get(`/api/messages/${roomId}/messages`);
    return response.data;
  },

  // toggleLike: async (postId) => {
  //   const response = await api.post(`/api/posts/${postId}/like`);
  //   return response.data;
  // },

  // queryPosts: async (query, page = 0, size = 10) => {
  //   const response = await api.get(`/api/posts/search`, {
  //     params: { query, page, size },
  //   });
  //   return response.data.content;
  // },
};

export default messageRoomService;
