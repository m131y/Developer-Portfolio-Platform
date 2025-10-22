package com.example.backend.message.repository;

import com.example.backend.message.entity.MessageRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRoomRepository extends JpaRepository<MessageRoom, Long> {

    /**
     * 특정 사용자 ID가 참여하고 있는 MessageRoom 중
     * ① 사용자가 나가지 않았고 (rp.leftAt IS NULL)
     * ② 채팅방이 삭제되지 않은 (rp.messageRoom.deletedAt IS NULL)
     * 활성 MessageRoom만 페이징 처리하여 조회합니다.
     * * @param userId 조회할 User의 ID
     * @param pageable 페이징 정보
     * @return MessageRoom 엔티티를 담은 Page 객체
     */
    @Query(value = "SELECT rp.messageRoom FROM RoomParticipant rp " +
            "WHERE rp.user.id = :userId " +
            "AND rp.leftAt IS NULL " +
            "AND rp.messageRoom.deletedAt IS NULL", // 💡 MessageRoom 삭제 조건 추가

            countQuery = "SELECT count(rp) FROM RoomParticipant rp " +
                    "WHERE rp.user.id = :userId " +
                    "AND rp.leftAt IS NULL " +
                    "AND rp.messageRoom.deletedAt IS NULL")
    Page<MessageRoom> findActiveMessageRoomsByUserId(@Param("userId") Long userId, Pageable pageable);

}
