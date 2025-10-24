import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMessageRoomStore from "../../store/messageRoomStore";
import Loading from "../common/Loading";
import { FiPlus, FiPlusCircle, FiSend, FiX } from "react-icons/fi";
import ChatList from "../chat/ChatList";
import CreateChat from "../chat/CreateChat";
import MessageRoom from "../chat/MessageRoom";

const FAB = () => {
  const { messageRooms, fetchMessageRooms, loading } = useMessageRoomStore();

  const [showCreateChat, setShowCreateChat] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    fetchMessageRooms();
  }, [fetchMessageRooms]);

  const handleCloseNotification = useCallback(() => {
    setShowNotification(false);
    setSelectedRoomId(null);
  }, []);

  useEffect(() => {
    if (showNotification) {
      // 렌더링 직후(다음 이벤트 루프)에 애니메이션 상태를 true로 설정하여 효과 발동
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer); // 클린업
    } else {
      // 닫을 때는 애니메이션 효과를 먼저 제거
      setIsAnimating(false);
    }
  }, [showNotification]);

  // ChatList에서 전달받아 RoomID를 설정하는 함수
  const handleSelectRoom = (roomId) => {
    setSelectedRoomId(roomId);
  };

  // MessageRoom 내부에서 목록으로 돌아갈 때 사용할 함수
  const handleGoBackToList = () => {
    setSelectedRoomId(null);
  };

  return (
    <div>
      <button
        // 챗 목록 토글 (on/off)
        onClick={() => setShowNotification(!showNotification)}
        // 고정 위치를 위해 FAB 버튼 자체에 fixed 클래스를 적용하는 것이 더 좋습니다.
        className="fixed bottom-8 right-8 z-50 
                   w-14 h-14 rounded-full bg-blue-500 shadow-lg 
                   flex items-center justify-center cursor-pointer 
                   hover:bg-blue-600 transition-colors focus:outline-none"
      >
        {/* 아이콘: 목록이 열려있으면 X, 닫혀있으면 + */}
        <span className="text-white text-3xl font-bold mb-0.5 font-presentation">
          {showNotification ? <FiX size={25} /> : <FiPlus />}
        </span>
      </button>

      {showNotification && (
        <div
          className="fixed bottom-24 right-8 z-50 
                    w-[18rem] h-[30rem] bg-white rounded-xl shadow-2xl overflow-hidden 
                    flex flex-col border border-gray-100

                    transform 
                    transition-all 
                    duration-300 
                    ease-out 
                    ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                    "
        >
          {selectedRoomId ? (
            // 2. 채팅 상세 화면
            <MessageRoom
              // MessageRoom 컴포넌트가 위젯 내에서 작동하도록 prop을 전달
              roomId={selectedRoomId}
              onClose={handleCloseNotification} // 전체 위젯 닫기
              onBack={handleGoBackToList} // 목록으로 돌아가기
              isWidget={true} // 위젯 내부임을 표시하는 플래그
            />
          ) : (
            // 1. 채팅 목록 화면
            <>
              {/* 2-1. 상단 헤더: 제목 및 대화방 생성 버튼 (목록 화면 전용 헤더) */}
              <div className="p-2 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                <div
                  className="fixed top-2 left-0 right-0 z-40 
                              pb-[env(safe-area-inset-bottom)] 
                              flex justify-center items-end"
                >
                  <div className="w-32 h-1 bg-gray-300 rounded-full" />
                </div>
                <div className="mt-1 flex justify-between items-start">
                  <button
                    onClick={() => setShowCreateChat(true)}
                    className="ml-1 mt-1 size-7 bg-blue-500 text-white rounded-full font-semibold 
                                  hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <FiSend size={15} className="mr-1" />
                  </button>

                  <span className="font-presentation text-sm flex justify-center font-bold text-gray-800 mt-2 mb-3">
                    Notification Center
                  </span>
                  <button
                    onClick={handleCloseNotification}
                    className="mr-1 mt-1 size-7 bg-gray-300 text-white rounded-full font-semibold 
                                  hover:bg-gray-400 transition-colors flex items-center justify-center"
                  >
                    <div className=" font-presentation">
                      <FiX size={15} />
                    </div>
                  </button>
                </div>
              </div>

              {/* 2-2. 채팅방 목록 영역 (스크롤 가능) */}
              <div className="flex-grow overflow-y-auto bg-white">
                {/* ChatList에 방을 선택하는 핸들러 전달 */}
                {loading ? (
                  <Loading />
                ) : (
                  <ChatList
                    messageRooms={messageRooms}
                    onSelectRoom={handleSelectRoom}
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}

      {showCreateChat && (
        <div
          className="fixed inset-0 bg-black/50 z-50 p-4 
                  flex justify-end items-end"
        >
          <div className="mb-24">
            {/* 기존 채팅 목록 창 위에 오도록 위치 조정 */}
            <CreateChat onClose={() => setShowCreateChat(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FAB;
