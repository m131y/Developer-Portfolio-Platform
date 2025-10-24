package com.example.backend.notification.repository;

import com.example.backend.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    long countByReceiverIdAndIsReadFalse(Long receiverId);

    List<Notification> findAllByReceiverIdOrderByCreatedAtDesc(Long receiverId);
}
