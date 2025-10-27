import { useEffect, useState, useRef, useCallback } from "react";
import { FiChevronLeft, FiSend, FiX } from "react-icons/fi";
import Loading from "../common/Loading";
import useWebSocketStore from "../../store/webSocketStore";
import useNotificationStore from "../../store/notificationStore";

const NotificationRoom = ({ onBack, onClose, isWidget }) => {
  const { previousNotifications, getAllNotification, loading } =
    useNotificationStore();

  const user = {
    id: 1,
    username: "user1",
    email: "user1@gmail.com",
    fullName: "user1",
    bio: null,
    profileImageUrl: null,
  };

  const {
    notifications,
    clearNotifications,
    isConnected,
    connect,
    disconnect,
    setNotifications,
    simulateNotification,
  } = useWebSocketStore();

  const [isLoading, setIsLoading] = useState(false);

  const roomId = 1;

  // 메시지 목록의 스크롤을 맨 아래로 이동시키기 위한 ref
  const messagesEndRef = useRef(null);
  // 메시지 컨테이너 ref (높이 계산 등에 필요할 수 있으나 여기서는 주로 스크롤용)
  const messageContainerRef = useRef(null);

  const stableFetchMessages = useCallback(getAllNotification, [
    getAllNotification,
  ]);
  const stableDisconnect = useCallback(disconnect, [disconnect]);

  const handleCloseNotificationCenter = () => {
    clearNotifications();
    onClose();
  };

  const handleBackNotificationCenter = () => {
    clearNotifications();
    onBack();
  };
  const handleSimulateRealtimeNotification = () => {
    const time = new Date().toLocaleTimeString("ko-KR");
    simulateNotification(`[실시간] 새로운 알림 테스트: ${time}에 수신됨`);
  };

  useEffect(() => {
    const loadHistoryAndConnect = async () => {
      if (!user || isNaN(user.id)) return;

      setIsLoading(true);

      try {
        await getAllNotification(user.id);
        console.log(previousNotifications);
        setNotifications(previousNotifications);
        connect(user, roomId);
      } catch (error) {
        console.error("Failed to load notificatio history and connect:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistoryAndConnect();

    // 💡 3. Cleanup 함수에서 안정적인 disconnect 참조 사용
    return () => {
      stableDisconnect();
    };
  }, [roomId, stableFetchMessages, connect, stableDisconnect]);

  useEffect(() => {
    // 메시지가 업데이트될 때마다 스크롤을 맨 아래로 이동
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notifications]);

  return (
    // 위젯의 전체 크기(h-full)를 채우도록 설정
    <div className="flex flex-col h-full bg-white">
      {/* 1. 채팅방 헤더 (위젯용 헤더) */}
      <div className="p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* 목록으로 돌아가기 (onBack Prop 사용) */}
          {isWidget && onBack && (
            <button
              onClick={handleBackNotificationCenter}
              className="text-gray-600 hover:text-blue-500 p-1"
            >
              <FiChevronLeft size={20} />
            </button>
          )}
          <h2
            className={`text-sm font-bold truncate ${
              isWidget ? "text-center flex-grow" : "flex-grow"
            }`}
          >
            알림
          </h2>
          {/* 위젯 닫기 버튼 */}
          {isWidget && onClose && (
            <button
              onClick={handleCloseNotificationCenter}
              className="text-gray-600 hover:text-red-500 p-1"
            >
              <FiX size={20} />
            </button>
          )}

          {/* 연결 상태 */}
          <span
            className={`ml-3 text-xs font-normal ${
              isConnected ? "text-green-500" : "text-red-500"
            } ${isWidget ? "hidden" : ""}`} // 위젯에서는 숨김
          >
            ({isConnected ? "연결됨" : "연결 끊김"})
          </span>
        </div>
        {/* 위젯이 아닐 때만 나가기 버튼 표시 (옵션) */}
        {!isWidget && (
          <button
            onClick={disconnect}
            disabled={!isConnected}
            className="mt-1 text-xs text-gray-500 hover:text-red-500 disabled:text-gray-300"
          >
            채팅방 나가기 (연결 해제)
          </button>
        )}
      </div>

      {/* 2. 메시지 영역 */}
      <div className="flex-grow overflow-y-auto p-3 bg-gray-50 space-y-2">
        {isLoading ? (
          <Loading />
        ) : (
          notifications &&
          Array.isArray(notifications) &&
          notifications.map((noti, index) => {
            return (
              <div key={index} className="flex my-1 justify-start">
                <span className="flex flex-col max-w-[80%] items-start mb-0.5 ml-1 font-medium select-none p-2 shadow-sm text-sm whitespace-pre-wrap bg-white text-gray-800 rounded-xl rounded-tl-sm border border-gray-200">
                  {noti.content}
                </span>
              </div>
            );
          })
        )}
        {/* **수정**: 실시간 수신 테스트 버튼 추가 */}
        <button
          onClick={handleSimulateRealtimeNotification}
          disabled={!isConnected}
          className="w-full p-2 mt-4 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition shadow-md disabled:bg-purple-300"
        >
          ➕ 실시간 알림 수신 테스트
        </button>
        {/* 스크롤 자동 이동을 위한 ref */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default NotificationRoom;
