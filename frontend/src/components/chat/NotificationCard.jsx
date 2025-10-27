import { FiBell } from "react-icons/fi";
import useNotificationStore from "../../store/notificationStore";

const NotificationCard = ({ onSelectRoom }) => {
  const { notifications, loading } = useNotificationStore();
  const isLoading = loading;

  const roomId = 1;

  const goToNotificationRoom = (e) => {
    if (e.target.closest("button")) {
      return;
    }

    if (onSelectRoom) {
      onSelectRoom(roomId);
    }
  };

  return (
    <>
      {/* 1. 전체 카드: 경계선, 호버 효과 및 클릭 이벤트 유지 */}
      <div
        className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={goToNotificationRoom}
      >
        {/* 2. 카드 내용: 아바타 + 텍스트 + 메뉴를 가로로 배치 */}
        <div className="flex items-center p-3 space-x-3">
          {/* 3. [추가] 아바타 (프로필 이미지) 영역: 채팅방 디자인에 통일성을 줍니다. */}
          <div className="flex-shrink-0">
            {/* ⚠️ 임시 아바타. 실제로는 otherUser.profilePicUrl 등을 사용해야 합니다. */}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
              {/* {otherUser ? otherUser.username.slice(0, 1) : '?'} */}
              <FiBell />
            </div>
          </div>

          {/* 4. 텍스트 영역: 채팅방 이름과 마지막 메시지 */}
          <div className="flex-1 min-w-0">
            {/* 4-1. 이름 + 시간 (가장 상단 라인) */}
            <div className="flex justify-between items-center mb-0.5">
              {/* 이름: 굵게, 한 줄 넘치면 ... 처리 */}
              <span className="text-sm font-semibold text-gray-800 truncate">
                알림 센터
              </span>
              {/* 시간: 작게, 오른쪽 정렬 */}
              <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                {/* 1시간 전 (예시) */}
              </span>
            </div>

            {/* 4-2. 마지막 메시지 미리보기 (더 작게, 회색, 한 줄 넘치면 ... 처리) */}
            <div className="text-xs text-gray-500">
              <p className="truncate">
                마지막 메시지 내용이 여기에 표시됩니다.
              </p>
            </div>
          </div>

          {/* 5. 메뉴 버튼 영역 (가장 오른쪽) */}
          <div className="flex-shrink-0 ml-auto relative">
            <button className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-700 transition-colors"></button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationCard;
