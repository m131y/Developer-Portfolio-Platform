import { create } from "zustand";
import { webSocketService } from "../services/webSocket";
import { useCallback } from "react";

const useWebSocketStore = create((set, get) => ({
  messages: [],
  notifications: [],
  isConnected: false,
  isLoading: false,

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
      console.log("Store: STOMP 연결 성공 및 구독 완료.");
    },
    onDisconnected: () => {
      set({ isConnected: false });
      console.log("Store: STOMP 연결 해제됨.");
    },
  },

  // ------------------------------------
  // 1. 연결 액션
  // ------------------------------------
  connect: (user, roomId) => {
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
    webSocketService.disconnect(); // 👈 변경

    set({
      messages: [],
      notifications: [], // 👈 알림 상태도 초기화
    });
  },

  // 5. 알림 수신 시뮬레이션 액션 (테스트 목적)
  simulateNotification: (content) => {
    const newNotification = {
      content: content,
      timestamp: Date.now(),
    };
    // set 함수를 직접 호출하는 대신, Service에 요청하여 Service가 콜백을 실행하도록 유도합니다.
    // 이것이 실제 웹소켓 푸시를 가장 정확하게 시뮬레이션하는 방법입니다.
    // webSocketService가 연결 시 받았던 콜백을 이 시점에서 실행해야 합니다.
    webSocketService.simulateNotificationPush(newNotification);
    console.log(
      `[Zustand Mock Action] Notification simulation requested via Service: ${content}`
    );
  },
  // ------------------------------------
  // 5. 알림 상태 관리 액션 (예시)
  // ------------------------------------
  clearNotifications: () => {
    set({ notifications: [] }); // 알림 창을 닫거나 모두 읽었을 때 사용
  },

  setMessages: (previousMessages) => {
    set({ messages: previousMessages });
  },

  setNotifications: (previousNotifications) => {
    set({ notifications: previousNotifications });
  },
}));

export default useWebSocketStore;
