package com.example.backend.message.repository;

import com.example.backend.message.entity.MessageRoom;
import com.example.backend.message.entity.RoomParticipant;
import com.example.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomParticipantRepository extends JpaRepository<RoomParticipant, Long> {
    List<RoomParticipant> findByUserId(Long userId);

    List<RoomParticipant> findByMessageRoom(MessageRoom messageRoom);

    Optional<RoomParticipant> findByMessageRoomAndUser(MessageRoom messageRoom, User user);

    Boolean existsByMessageRoomAndUser(MessageRoom messageRoom, User user);
}
