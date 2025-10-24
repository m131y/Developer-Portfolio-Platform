import ChatCard from "./ChatCard";

const ChatList = ({ onSelectRoom, messageRooms }) => {
  if (!messageRooms || messageRooms.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No message yet.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {messageRooms.map((messageRoom) => (
        <ChatCard
          key={messageRoom.id}
          messageRoom={messageRoom}
          onSelectRoom={onSelectRoom}
        />
      ))}
    </div>
  );
};

export default ChatList;
