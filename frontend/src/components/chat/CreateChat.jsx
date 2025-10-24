import { FiX } from "react-icons/fi";
import { useState } from "react";
import Input from "../ui/Input";
import useMessageRoomStore from "../../store/messageRoomStore";

const CreateChat = ({ onClose }) => {
  const { messageRooms, createMessageRoom, loading, error } =
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

  const [roomName, setRoomName] = useState("");
  const [invitee, setInvitee] = useState("");
  const [inviteeNames, setInviteeNames] = useState([]);

  const handleAddInvitee = () => {
    // 1. 이름이 비어있거나, 이미 추가된 이름이거나, 본인 이름이면 추가하지 않음 (선택 사항)
    if (
      invitee.trim() === "" ||
      inviteeNames.includes(invitee.trim()) ||
      invitee.trim() == user.username
    ) {
      setInvitee(""); // 입력 필드 초기화
      return;
    }

    // 2. 현재 입력된 이름을 기존 리스트에 추가
    setInviteeNames((prevNames) => [...prevNames, invitee.trim()]);

    // 3. 입력 필드 초기화
    setInvitee("");
  };

  const handleRemoveInvitee = (nameToRemove) => {
    setInviteeNames((prevNames) =>
      prevNames.filter((name) => name !== nameToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = {
        roomName: roomName,
        inviteeNames: inviteeNames, // 백엔드 DTO 필드 이름과 일치!
      };
      await createMessageRoom(requestBody);

      setRoomName("");
      setInviteeNames([]);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    // 🚨 [핵심 수정] 배경 오버레이 및 중앙 정렬 클래스 제거! 🚨
    // 배경은 부모에서 처리했으므로, 여기서는 패널 자체의 스타일만 남깁니다.
    <div
      className="bg-white rounded-xl shadow-2xl p-4 
                    w-80 h-auto max-h-[25rem] 
                    flex flex-col border border-gray-100"
    >
      {/* 1. 상단: 제목 및 닫기 버튼 */}
      <div className="flex items-center justify-between mb-3 pb-2">
        <h2 className="text-sm font-presentation tracking-wider font-bold">
          새 대화방 만들기
        </h2>{" "}
        {/* 제목 추가 */}
        <button
          className="text-gray-500 hover:text-gray-700 p-1"
          onClick={onClose}
        >
          <FiX size={18} />
        </button>
      </div>

      {/* 2. 폼 영역 */}
      <form
        className="space-y-3 flex-1 overflow-y-auto pr-1"
        onSubmit={handleSubmit}
      >
        {/* 2-1. 채팅방 이름 입력 */}
        <div className="space-y-1">
          <Input
            className="w-full font-presentation tracking-wider text-xs border p-2 rounded"
            placeholder="채팅방 이름을 입력하세요 (예: 팀 프로젝트)"
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>

        {/* 2-2. 초대 사용자 입력 및 추가 */}
        <div className="space-y-1">
          <div className="flex items-center">
            <Input
              className="flex-1 mr-2  font-presentation tracking-wider text-xs border p-2 rounded"
              placeholder="사용자 이름 입력"
              value={invitee}
              onChange={(e) => setInvitee(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddInvitee}
              // 버튼 크기 조정
              className="px-3 py-2 bg-blue-500 text-white  font-presentation tracking-wider rounded-lg hover:bg-blue-600 font-semibold text-xs disabled:opacity-50"
              disabled={invitee.trim() === ""}
            >
              추가
            </button>
          </div>
        </div>

        {/* 2-3. 추가된 초대 사용자 이름 목록 표시 (스크롤 가능 영역) */}
        <div className="mt-3 flex flex-wrap gap-1 p-1 min-h-8">
          {inviteeNames.length > 0 ? (
            inviteeNames.map((name) => (
              <span
                key={name}
                // 태그 디자인 변경: 작게, 둥글게, 꽉 채운 배경
                className="inline-flex items-center h-6 px-2 font-presentation tracking-wider text-xs font-medium bg-blue-500 text-white rounded-full"
              >
                {name}
                <button
                  type="button"
                  onClick={() => handleRemoveInvitee(name)}
                  className="ml-1 text-white opacity-80 hover:opacity-100 transition-opacity"
                >
                  <FiX size={10} />
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs  font-presentation tracking-wider text-gray-400">
              초대할 사용자를 입력하고 추가하세요.
            </span>
          )}
        </div>
      </form>

      {/* 3. 하단: 오류 메시지 및 생성 버튼 */}
      <div className="pt-2">
        {error && <div className="text-red-500 text-xs mb-2">{error}</div>}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500  font-presentation tracking-wider text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
            // roomName이 비어있거나, 로딩 중이거나, 초대한 사람이 없을 때 비활성화
            disabled={
              loading || roomName.trim() === "" || inviteeNames.length === 0
            }
            onClick={handleSubmit} // 폼 태그 바깥에 있지만 handleSubmit을 직접 호출
          >
            대화방 생성
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChat;
