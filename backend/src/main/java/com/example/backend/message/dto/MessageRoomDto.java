package com.example.backend.message.dto;

import com.example.backend.message.entity.MessageRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageRoomDto {
    private long id;
    private String roomName;
    private UserDto creator;

    public static MessageRoomDto fromEntity(MessageRoom messageRoom) {
        return MessageRoomDto.builder()
                .id(messageRoom.getId())
                .roomName(messageRoom.getRoomName())
                .creator(UserDto.fromEntity(messageRoom.getCreator()))
                .build();
    }
}
