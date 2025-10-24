// src/services/WebSocketService.js (클래스 이름 변경)

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SERVER_URL = import.meta.env.VITE_API_URL + "/ws-stomp";

class WebSocketService {
  // 👈 클래스 이름 변경
  constructor() {
    this.stompClient = null;
    this.roomId = null;
    this.senderName = null;
    this.userId = null; // 알림 구독을 위해 추가

    // 채팅 및 알림 콜백 분리
    this.onChatMessageReceived = null;
    this.onNotificationReceived = null;
    this.onConnected = null;
    this.onDisconnected = null;
  }

  // ------------------------------------
  // 1. 연결 및 활성화
  // ------------------------------------
  // user: { username, userId } 등, roomId: string, callbacks: { onChat, onNoti, onConn, onDisc }
  connect(user, roomId, callbacks) {
    this.roomId = roomId;
    this.senderName = user.username;
    this.userId = user.userId; // 👈 알림 구독을 위해 사용자 ID 저장

    this.onChatMessageReceived = callbacks.onChatMessageReceived;
    this.onNotificationReceived = callbacks.onNotificationReceived;
    this.onConnected = callbacks.onConnected;
    this.onDisconnected = callbacks.onDisconnected;

    const token = localStorage.getItem("accessToken");
    const connectHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(SERVER_URL),
      debug: (str) => {
        // console.log(str);
      },
      connectHeaders: connectHeaders,
      onConnect: this._handleConnect.bind(this),
      onStompError: this._handleError.bind(this),
      onWebSocketClose: this._handleClose.bind(this),
      reconnectDelay: 5000,
    });

    this.stompClient.activate();
  }

  // ------------------------------------
  // 2. STOMP 이벤트 핸들러
  // ------------------------------------

  _handleConnect(frame) {
    console.log("STOMP Connected: " + frame);
    if (this.onConnected) this.onConnected();

    // 1. 채팅 토픽 구독
    this._subscribeChat();

    // 2. 알림 큐 구독
    this._subscribeNotification();

    // 채팅방 입장 메시지 전송 (채팅 기능 유지)
    this.sendChatMessage("ENTER", `${this.senderName}님이 입장하셨습니다.`);
  }

  _handleError(frame) {
    console.error("STOMP Error:", frame);
    if (this.onDisconnected) this.onDisconnected();
  }

  _handleClose() {
    console.log("WebSocket Closed.");
    if (this.onDisconnected) this.onDisconnected();
  }

  // ------------------------------------
  // 3. 구독 및 메시지 전송 로직
  // ------------------------------------

  // 3-1. 채팅 토픽 구독
  _subscribeChat() {
    if (!this.stompClient || !this.roomId) return;

    this.stompClient.subscribe(`/topic/chat/room/${this.roomId}`, (message) => {
      console.log("채팅 메시지 수신 성공:", message.body);
      const receivedMsg = JSON.parse(message.body);
      if (this.onChatMessageReceived) {
        this.onChatMessageReceived(receivedMsg);
      }
    });
  }

  // 3-2. 알림 큐 구독
  _subscribeNotification() {
    if (!this.stompClient || !this.userId) return;

    // /user/queue/notifications 경로를 구독합니다. (1:1 메시징)
    this.stompClient.subscribe(`/user/queue/notifications`, (message) => {
      console.log("알림 메시지 수신 성공:", message.body);
      const receivedNoti = JSON.parse(message.body);
      if (this.onNotificationReceived) {
        this.onNotificationReceived(receivedNoti);
      }
    });
  }

  // 3-3. 채팅 메시지 전송
  sendChatMessage(type, message) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.warn("연결되지 않아 메시지 전송 불가.");
      return;
    }

    const chatMessage = {
      type: type,
      roomId: this.roomId,
      sender: this.senderName,
      message: message,
      timestamp: new Date().getTime(),
    };

    this.stompClient.publish({
      destination: "/app/chat/message",
      body: JSON.stringify(chatMessage),
    });
  }

  // 3-4. 알림 관련 요청 전송 (예: 알림 읽음 처리)
  sendNotificationRequest(data) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.warn("연결되지 않아 메시지 전송 불가.");
      return;
    }

    this.stompClient.publish({
      destination: "/app/notification/read",
      body: JSON.stringify(data),
    });
  }

  // ------------------------------------
  // 4. 연결 해제
  // ------------------------------------
  disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      // 퇴장 메시지 전송
      this.sendChatMessage("QUIT", `${this.senderName}님이 퇴장하셨습니다.`);
    }

    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      console.log("STOMP Disconnected.");
    }
  }
}

// 싱글톤 패턴으로 인스턴스 내보내기
export const webSocketService = new WebSocketService(); // 👈 객체 이름 변경
