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
    this.userId = user.id; // 👈 알림 구독을 위해 사용자 ID 저장

    this.onChatMessageReceived = callbacks.onChatMessageReceived;
    this.onNotificationReceived = callbacks.onNotificationReceived;
    this.onConnected = callbacks.onConnected;
    this.onDisconnected = callbacks.onDisconnected;

    // 🚨 연결 상태 확인: 이미 연결되어 있거나 연결 시도 중이면 재연결하지 않음
    if (
      this.stompClient &&
      (this.stompClient.connected ||
        this.stompClient.webSocket.readyState ===
          this.stompClient.webSocket.CONNECTING)
    ) {
      console.warn("STOMP client already connected or connecting.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    const connectHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(SERVER_URL),
      debug: (str) => {
        console.log(str);
      },
      connectHeaders: connectHeaders,
      onConnect: this._handleConnect.bind(this),
      onStompError: this._handleError.bind(this),
      onWebSocketClose: this._handleClose.bind(this),
      reconnectDelay: 3000,
    });

    this.stompClient.activate();
  }

  // ------------------------------------
  // 2. STOMP 이벤트 핸들러
  // ------------------------------------

  _handleConnect(frame) {
    console.log("STOMP Connected: " + frame);
    if (this.onConnected) this.onConnected();

    // 채팅방 ID가 있을 때만 채팅 구독
    if (this.roomId) {
      this._subscribeChat();
      this.sendChatMessage("ENTER", `${this.senderName}님이 입장하셨습니다.`);
    }

    if (this.userId) {
      this._subscribeNotification();
    } else {
      // 🚨 [디버깅 코드 추가] 🚨 userId가 없어서 구독이 실패했을 때 로그
      console.warn(
        `STOMP: 알림 구독 실패. this.userId가 유효하지 않음: ${this.userId}`
      );
    }
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
    console.log(
      `STOMP: 알림 큐 구독 시도 - /user/queue/notifications (User ID: ${this.userId})`
    );

    if (!this.stompClient || !this.userId) return;

    // /user/queue/notifications 경로를 구독합니다. (1:1 메시징)
    this.stompClient.subscribe(`/user/queue/notifications`, (notification) => {
      console.log("-----------------------------------------");
      console.log(
        "🔔 [알림 도착] STOMP 프레임 수신 성공 (Raw Message):",
        notification
      );
      console.log("프레임 바디:", notification.body);
      console.log("-----------------------------------------");

      // 백엔드에서 DTO 객체를 보냈기 때문에, 바디는 깨끗한 JSON 문자열이어야 합니다.
      try {
        // 이중 문자열일 경우를 대비해 1차 시도:
        let body = notification.body;

        // 만약 STOMP 프레임이 바디를 문자열로 감싸서 보낸다면, 한 번 더 파싱해야 합니다.
        if (body.startsWith('"') && body.endsWith('"')) {
          // 이중 JSON 문자열이라고 가정하고, 바디를 JSON.parse합니다. (예: '"{"id":1}"' -> '{"id":1}')
          body = JSON.parse(body);
        }

        const receivedNoti = JSON.parse(body);

        if (this.onNotificationReceived) {
          this.onNotificationReceived(receivedNoti);
          console.log("✅ 알림 메시지 콜백 실행 완료.");
        } else {
          console.warn("경고: 알림 메시지 콜백이 설정되지 않았습니다.");
        }
      } catch (e) {
        console.error("❌ 알림 JSON 파싱 또는 콜백 실행 중 오류:", e);
        console.error("오류 발생 메시지 바디:", notification.body);
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

  simulateNotificationPush(notificationData) {
    this.onNotificationReceived(notificationData);
    console.log(`[Service Mock] Pushing notification data to Store callback.`);
  }
}

// 싱글톤 패턴으로 인스턴스 내보내기
export const webSocketService = new WebSocketService(); // 👈 객체 이름 변경
