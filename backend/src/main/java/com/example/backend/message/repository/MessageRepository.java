package com.example.backend.message.repository;

import com.example.backend.message.entity.Message;
import com.example.backend.message.entity.MessageRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByMessageRoom(MessageRoom messageRoom);
}
