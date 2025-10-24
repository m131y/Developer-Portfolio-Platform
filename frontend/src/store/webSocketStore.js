import { create } from "zustand";
import { webSocketService } from "../services/webSocket";

const useWebSocketStore = create((set, get) => ({
  messages: [],
  notifications: [],
  isConnected: false,

  // Service 객체에 전달할 콜백 함수 정의
  callbacks: {
    onChatMessageReceived: (message) => {
      set((state) => ({ messages: [...state.messages, message] }));
    },
    onNotificationReceived: (notification) => {
      set((state) => ({
        notifications: [...state.notifications, notification],
        // 🔔 새로운 알림이 오면 카운터 등을 업데이트하는 로직을 여기에 추가할 수 있습니다.
      }));
    },
    onConnected: () => {
      set({ isConnected: true });
    },
    onDisconnected: () => {
      set({ isConnected: false });
    },
  },

  // ------------------------------------
  // 1. 연결 액션
  // ------------------------------------
  connect: (user, roomId, previousMessage) => {
    set({ messages: previousMessage || [] });
    webSocketService.connect(user, roomId, get().callbacks); // 👈 변경
  },

  // ------------------------------------
  // 2. 메시지 전송 액션
  // ------------------------------------
  sendMessage: (message) => {
    // 🚨 서비스 객체 이름 변경
    webSocketService.sendChatMessage("MESSAGE", message); // 👈 변경 (함수 이름도 변경됨)
  },
  // ------------------------------------
  // 3. 알림 요청 액션
  // ------------------------------------
  sendNotificationRequest: (data) => {
    webSocketService.sendNotificationRequest(data);
  },
  // ------------------------------------
  // 4. 연결 해제 액션
  // ------------------------------------
  disconnect: () => {
    // 🚨 서비스 객체 이름 변경
    webSocketService.disconnect(); // 👈 변경

    // 상태 초기화
    set({
      messages: [],
      notifications: [], // 👈 알림 상태도 초기화
      isConnected: false,
    });
  },

  // ------------------------------------
  // 5. 알림 상태 관리 액션 (예시)
  // ------------------------------------
  clearNotifications: () => {
    set({ notifications: [] }); // 알림 창을 닫거나 모두 읽었을 때 사용
  },
}));

export default useWebSocketStore;
