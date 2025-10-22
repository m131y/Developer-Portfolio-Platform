package com.example.backend.message.controller;

import com.example.backend.message.dto.*;
import com.example.backend.message.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /**
     * 클라이언트로부터 SEND 요청이 오면 처리합니다.
     * 클라이언트 요청 경로: /pub/chat/message (WebSocketConfig에서 설정한 prefix에 매핑됨)
     */
    @MessageMapping("/chat/message") // /pub + /chat/message
    public void message(MessageDto messageDto) {
//        log.info("backend-chatController");
        chatService.message(messageDto);

    }

    @PostMapping("/api/messages/rooms")
    public ResponseEntity<MessageRoomDto> createMessageRoom(
            @RequestBody CreateRoomRequest request,
            @RequestParam Long creatorId
    ) {

        return ResponseEntity.ok(chatService.createMessageRoom(request, creatorId));
    }

    @GetMapping("/api/messages/rooms")
    public ResponseEntity<Page<MessageRoomDto>> getAllMessageRooms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam Long userId
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(chatService.getAllMessageRooms(pageable, userId));
    }

    @GetMapping("/api/messages/rooms/{roomId}")
    public ResponseEntity<RoomInfoResponse> getRoomInfo(
            @PathVariable Long roomId
    ) {
        return ResponseEntity.ok(chatService.getRoomInfo(roomId));
    }

//    @GetMapping("/api/message/messages")
//    public List<Message> getMessages() {
//        return chatService.getMessages();
//    }

    @PostMapping("/api/messages/rooms/{roomId}/join")
    public RoomParticipantDto joinMessageRoom(
            @PathVariable Long roomId,
            @RequestParam Long userId
    ) {
        log.info("chatcontroller");
        return chatService.joinMessageRoom(roomId, userId);
    }

    @PutMapping("/api/messages/rooms/{roomId}/left")
    public ResponseEntity<String> leftMessageRoom(
            @PathVariable Long roomId,
            @RequestParam Long userId
    ) {
        chatService.leftMessageRoom(roomId, userId);
        return ResponseEntity.ok("채팅방에서 퇴장하셨습니다.");
    }

    @DeleteMapping("/api/messages/rooms/{roomId}")
    public ResponseEntity<String> deleteMessageRoom(
            @PathVariable Long roomId
    ) {
        chatService.deleteMessageRoom(roomId);
        return ResponseEntity.ok("채팅방이 삭제되었습니다.");
    }
}
