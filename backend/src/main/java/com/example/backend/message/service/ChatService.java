package com.example.backend.message.service;

import com.example.backend.message.dto.*;
import com.example.backend.message.entity.*;
import com.example.backend.message.repository.MessageRepository;
import com.example.backend.message.repository.MessageRoomRepository;
import com.example.backend.message.repository.RoomParticipantRepository;
import com.example.backend.redis.RedisPublisher;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final RedisPublisher redisPublisher;
//    private final AuthenticationService authenticationService;

    private final MessageRoomRepository messageRoomRepository;
    private final MessageRepository messageRepository;
    private final RoomParticipantRepository roomParticipantRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Transactional
    public void message(MessageDto messageDto) {

        MessageRoom room = messageRoomRepository.findById(Long.valueOf(messageDto.getRoomId()))
                .orElseThrow(()->new RuntimeException("해당 대화방을 찾을 수 없습니다."));

        User sendUser = userRepository.findByNickname(messageDto.getSender())
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));

        if (MessageType.ENTER.equals(messageDto.getType())) {
            log.info("ENTER" + messageDto.getMessage());

            simpMessagingTemplate.convertAndSend("/topic/chat/room/" + messageDto.getRoomId(), messageDto);

        } else if (MessageType.MESSAGE.equals(messageDto.getType())) {
            log.info("MESSAGE" + messageDto.getMessage());
            simpMessagingTemplate.convertAndSend("/topic/chat/room/" + messageDto.getRoomId(), messageDto);

            Message message = Message.builder()
                    .type(messageDto.getType())
                    .messageRoom(room)
                    .sender(sendUser)
                    .message(messageDto.getMessage())
                    .createdAt(LocalDateTime.now())
                    .build();

            messageRepository.save(message);
        }
    }

    public Page<MessageRoomDto> getAllMessageRooms(Pageable pageable, Long userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));


        Page<MessageRoom> rooms = messageRoomRepository.findActiveMessageRoomsByUserId(currentUser.getId(), pageable);
        return rooms.map(room -> MessageRoomDto.fromEntity(room));
    }

    public List<MessageDto> getMessagesByRoom(Long roomId) {
        MessageRoom room = messageRoomRepository.findById(roomId)
                .orElseThrow(()->new RuntimeException("해당 대화방을 찾을 수 없습니다."));

        return messageRepository.findByMessageRoom(room).stream().map(dto -> MessageDto.fromEntity(dto)).toList();
    }

    @Transactional
    public MessageRoomDto createMessageRoom(CreateRoomRequest request, Long userId) {

        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));


        MessageRoom newRoom = MessageRoom.builder()
                .roomName(request.getRoomName())
                .creator(creator)
                .build();

        // 방 생성, 저장
        MessageRoom savedRoom = messageRoomRepository.save(newRoom);

        // 3. 참여자 ID 목록 준비 (생성자 ID + 초대된 사용자 ID 목록)
        Set<String> participantNames = new HashSet<>(request.getInviteeNames());
        participantNames.add(creator.getNickname());

        // 4. 모든 참가자 User 엔티티 조회
        List<User> participants = userRepository.findAllByNicknameIn(participantNames);
        // ^ userRepository가 Iterable<Long>을 받는 findAllById를 가지고 있어야 합니다.

        if (participants.size() != participantNames.size()) {
            // 초대 ID 중 유효하지 않은 ID가 있을 경우 처리
            throw new IllegalArgumentException("유효하지 않은 사용자 ID가 포함되어 있습니다.");
        }

        // 5. RoomParticipant 엔티티 생성 및 저장
        List<RoomParticipant> roomParticipants = participants.stream()
                .map(user -> RoomParticipant.builder()
                        .messageRoom(savedRoom)
                        .user(user)
                        .joinedAt(LocalDateTime.now())
                        .leftAt(null)
                        .build())
                .collect(Collectors.toList());

        roomParticipantRepository.saveAll(roomParticipants); // 모든 참가자 저장

        // 6. 결과 반환
        return MessageRoomDto.fromEntity(savedRoom);
    }

    // 참가자 목록, messageRoomDto 을 같이 조회해서 보내기
    public RoomInfoResponse getRoomInfo(Long roomId) {
        MessageRoom messageRoom = messageRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("해당 대화방을 찾을 수 없습니다."));
        List<RoomParticipant> participants = roomParticipantRepository.findByMessageRoom(messageRoom);

        // 3. 참가자 엔티티 목록을 UserDTO 목록으로 변환
        List<UserDto> participantDtos = participants.stream()
                .map(RoomParticipant::getUser) // RoomParticipant에서 User 엔티티 추출
                .map(user -> UserDto.builder() // User 엔티티를 UserDTO로 변환
                        .id(user.getId())
                        .nickname(user.getNickname())
                        .email(user.getEmail())
                        .bio(user.getBio())
                        .profileImageUrl(user.getProfileImageUrl())
                        .build())
                .collect(Collectors.toList());

        // 4. 최종 RoomInfoResponse DTO 생성
        return RoomInfoResponse.builder()
                .roomId(messageRoom.getId())
                .roomName(messageRoom.getRoomName())
                .participants(participantDtos)
                .build();
    }

    public RoomParticipantDto joinMessageRoom(Long roomId, Long userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));


        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));

        MessageRoom messageRoom = messageRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("해당 대화방을 찾을 수 없습니다."));

        Optional<RoomParticipant> existingParticipantOpt =
                roomParticipantRepository.findByMessageRoomAndUser(messageRoom, user);

        if (existingParticipantOpt.isPresent()) {
            RoomParticipant existingParticipant = existingParticipantOpt.get();

            // 2-A. 이미 활성 상태로 참여 중인 경우 (중복 참가 방지)
            if (existingParticipant.getLeftAt() == null) {
                log.info("User {} is already an active member of room {}",
                        user.getId(), messageRoom.getId());

                // 이미 참가 중이면 기존 참가 정보를 DTO로 반환
                return RoomParticipantDto.fromEntity(existingParticipant);
            }

            // 2-B. 나갔던 기록이 있는 경우 (leftAt != null) -> 재입장 처리
            else {
                log.info("User {} is rejoining room {}", user.getId(), messageRoom.getId());

                // [재입장 로직]
                existingParticipant.setJoinedAt(LocalDateTime.now()); // joinedAt 업데이트
                existingParticipant.setLeftAt(null);                  // leftAt을 null로 설정 (재활성화)

                // JPA의 영속성 컨텍스트 덕분에 save()를 명시적으로 호출할 필요 없이
                // 트랜잭션 종료 시 자동으로 업데이트됩니다. (명시적으로 호출해도 무방)
                return RoomParticipantDto.fromEntity(roomParticipantRepository.save(existingParticipant));
            }
        }

        // 3. 참가 기록이 아예 없는 경우 -> 신규 참가 처리
        else {
            log.info("User {} is newly joining room {}", user.getId(), messageRoom.getId());

            RoomParticipant newParticipant = RoomParticipant.builder()
                    .messageRoom(messageRoom)
                    .user(user)
                    .joinedAt(LocalDateTime.now())
                    .leftAt(null) // 신규 참가자는 당연히 null
                    .build();

            return RoomParticipantDto.fromEntity(roomParticipantRepository.save(newParticipant));
        }
    }

    public void leftMessageRoom(Long roomId, Long userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));

        MessageRoom messageRoom = messageRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("해당 대화방을 찾을 수 없습니다."));

        RoomParticipant participant = roomParticipantRepository.findByMessageRoomAndUser(messageRoom, currentUser)
                .orElseThrow(() -> new RuntimeException("해당 대화방의 참가자를 찾을 수 없습니다."));

        participant.setLeftAt(LocalDateTime.now());

        roomParticipantRepository.save(participant);
    }

    public void deleteMessageRoom(Long roomId) {
        MessageRoom messageRoom = messageRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("해당 대화방을 찾을 수 없습니다."));

        messageRoom.setDeletedAt(LocalDateTime.now());

        messageRoomRepository.save(messageRoom);
    }

    public boolean isParticipant(Long roomId, String nickname) {
        User user = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다."));

        MessageRoom messageRoom = messageRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("해당 대화방을 찾을 수 없습니다."));

        return roomParticipantRepository.existsByMessageRoomAndUser(messageRoom, user);
    }
}