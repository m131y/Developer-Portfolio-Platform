import {
  FiEdit2,
  FiHeart,
  FiMessageCircle,
  FiMoreVertical,
  FiTrash,
} from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import useMessageRoomStore from "../../store/messageRoomStore";

const ChatCard = ({ messageRoom, onSelectRoom }) => {
  // const { user } = useAuthStore();
  const user = {
    id: 1,
    username: "user1",
    email: "user1@gmail.com",
    fullName: "user1",
    bio: null,
    profileImageUrl: null,
  };

  // // 1. 상대방 사용자 정보를 저장할 로컬 상태를 추가
  // const [otherUser, setOtherUser] = useState(null); // 💡 이 부분이 핵심입니다.

  const { deleteMessageRooms, loading } = useMessageRoomStore();

  const menuRef = useRef(null);

  const isLoading = loading;

  const roomId = messageRoom.id;

  const goToMessageRoom = (e) => {
    if (e.target.closest("button")) {
      return;
    }

    if (onSelectRoom) {
      onSelectRoom(roomId);
    }
  };

  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this tweet?")) {
      try {
        await deleteMessageRooms(messageRoom.id);
      } catch (err) {
        alert("Failed to delete tweet. Please try again.");
      } finally {
        setShowMenu(false);
      }
    }
  };

  // useEffect(() => {
  //   const loadUserProfile = async () => {
  //     try {
  //       // getUserProfile은 프로필 데이터를 반환하도록 수정되어야 합니다.
  //       const profileData = await getUserProfile(otherUserId);
  //       // 3. 전역 상태를 덮어쓰지 않고, 로컬 상태를 업데이트합니다.
  //       setOtherUser(profileData.userProfile);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   loadUserProfile();
  // }, [getUserProfile, otherUserId]);

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutSide);
      return () => {
        document.removeEventListener("mousedown", handleClickOutSide);
      };
    }
  }, [showMenu]);

  return (
    <>
      {/* 1. 전체 카드: 경계선, 호버 효과 및 클릭 이벤트 유지 */}
      <div
        className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={goToMessageRoom}
        roomId={messageRoom.id}
      >
        {/* 2. 카드 내용: 아바타 + 텍스트 + 메뉴를 가로로 배치 */}
        <div className="flex items-center p-3 space-x-3">
          {/* 3. [추가] 아바타 (프로필 이미지) 영역: 채팅방 디자인에 통일성을 줍니다. */}
          <div className="flex-shrink-0">
            {/* ⚠️ 임시 아바타. 실제로는 otherUser.profilePicUrl 등을 사용해야 합니다. */}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
              {/* {otherUser ? otherUser.username.slice(0, 1) : '?'} */}
              {messageRoom.roomName.slice(0, 1)}
            </div>
          </div>

          {/* 4. 텍스트 영역: 채팅방 이름과 마지막 메시지 */}
          <div className="flex-1 min-w-0">
            {/* 4-1. 이름 + 시간 (가장 상단 라인) */}
            <div className="flex justify-between items-center mb-0.5">
              {/* 이름: 굵게, 한 줄 넘치면 ... 처리 */}
              <span className="text-sm font-semibold text-gray-800 truncate">
                {/* {otherUser.username} */}
                {messageRoom.roomName}
              </span>
              {/* 시간: 작게, 오른쪽 정렬 */}
              <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                {/* 1시간 전 (예시) */}
              </span>
            </div>

            {/* 4-2. 마지막 메시지 미리보기 (더 작게, 회색, 한 줄 넘치면 ... 처리) */}
            <div className="text-xs text-gray-500">
              <p className="truncate">
                {/* 실제로는 messageRoom.lastMessage.content를 사용 */}
                마지막 메시지 내용이 여기에 표시됩니다.
              </p>
            </div>
          </div>

          {/* 5. 메뉴 버튼 영역 (가장 오른쪽) */}
          <div className="flex-shrink-0 ml-auto relative" ref={menuRef}>
            <button
              className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <FiMoreVertical size={16} />
            </button>

            {showMenu && (
              // 메뉴 디자인을 목록 위젯에 맞게 작게 조정
              <div className="absolute right-0 top-0 mt-8 w-24 bg-white shadow-xl z-50 py-0.5 border border-gray-100 rounded-lg">
                <button
                  className="flex items-center space-x-1 px-2 py-1 hover:bg-red-50 text-red-600 w-full text-left transition-colors text-xs"
                  onClick={handleDelete}
                >
                  <FiTrash size={12} className="flex-shrink-0" />
                  <span>나가기</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatCard;
