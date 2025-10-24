import { useEffect, useState, useRef } from "react";

import { FiChevronLeft, FiSend, FiX } from "react-icons/fi";
import useMessageRoomStore from "../../store/messageRoomStore";
import useWebSocketStore from "../../store/webSocketStore";
import Loading from "../common/Loading";

const MessageRoom = ({ roomId: propRoomId, onBack, onClose, isWidget }) => {
  const { previousMessage, fetchMessagesByRoom, loading } =
    useMessageRoomStore();
  // const { user } = useAuthStore();
  const user = {
    id: 1,
    username: "user1",
    email: "user1@gmail.com",
    fullName: "user1",
    bio: null,
    profileImageUrl: null,
  };

  const { messages, isConnected, connect, sendMessage, disconnect } =
    useWebSocketStore();

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const roomId = isWidget ? propRoomId : params.roomId;

  // 메시지 목록의 스크롤을 맨 아래로 이동시키기 위한 ref
  const messagesEndRef = useRef(null);
  // 메시지 컨테이너 ref (높이 계산 등에 필요할 수 있으나 여기서는 주로 스크롤용)
  const messageContainerRef = useRef(null);

  useEffect(() => {
    // 💡 수정: 비동기 로직을 처리하는 내부 함수를 정의하여 순서를 강제합니다.
    const loadHistoryAndConnect = async () => {
      // 사용자 정보가 없거나 roomId가 유효하지 않으면 실행 중단
      if (!user || isNaN(roomId)) return;

      setIsLoading(true);

      try {
        const initialMessages = await fetchMessagesByRoom(roomId);

        connect(user, roomId, initialMessages);
      } catch (error) {
        console.error("Failed to load chat history and connect:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistoryAndConnect();

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => {
      disconnect();
    };
  }, [user, roomId, fetchMessagesByRoom, connect, disconnect]);

  useEffect(() => {
    console.log(messages);
    // 메시지가 업데이트될 때마다 스크롤을 맨 아래로 이동
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== "") {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  return (
    // 위젯의 전체 크기(h-full)를 채우도록 설정
    <div className="flex flex-col h-full bg-white">
      {/* 1. 채팅방 헤더 (위젯용 헤더) */}
      <div className="p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* 목록으로 돌아가기 (onBack Prop 사용) */}
          {isWidget && onBack && (
            <button
              onClick={onBack}
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
            채팅방: {roomId}
          </h2>
          {/* 위젯 닫기 버튼 */}
          {isWidget && onClose && (
            <button
              onClick={onClose}
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
          messages &&
          Array.isArray(messages) &&
          messages.map((msg, index) => {
            const isCurrentUser = msg.sender === user?.username;
            const isSystemMessage = msg.type === "ENTER" || msg.type === "QUIT";

            return (
              <div
                key={index}
                className={`flex my-1 ${
                  isSystemMessage
                    ? "justify-center"
                    : isCurrentUser
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {isSystemMessage ? (
                  <i className="text-xs text-gray-500 text-center">
                    {msg.message}
                  </i>
                ) : (
                  <div
                    className={`flex flex-col max-w-[80%] ${
                      isCurrentUser ? "items-end" : "items-start"
                    }`}
                  >
                    {!isCurrentUser && (
                      <span className="text-xs text-gray-600 mb-0.5 ml-1 font-medium select-none">
                        {msg.sender}
                      </span>
                    )}
                    <div
                      className={`p-2 shadow-sm text-sm whitespace-pre-wrap ${
                        isCurrentUser
                          ? "bg-blue-500 text-white rounded-xl rounded-br-sm"
                          : "bg-white text-gray-800 rounded-xl rounded-tl-sm border border-gray-200"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        {/* 스크롤 자동 이동을 위한 ref */}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. 메시지 입력 폼 */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-3 flex-shrink-0 border-t border-gray-200 bg-white"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            isConnected ? "메시지를 입력하세요" : "연결 상태를 확인하세요"
          }
          disabled={!isConnected}
          className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 transition text-sm"
        />
        <button
          type="submit"
          disabled={!isConnected || inputMessage.trim() === ""}
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 disabled:bg-blue-300 disabled:text-gray-100"
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageRoom;
