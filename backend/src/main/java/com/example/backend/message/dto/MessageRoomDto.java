package com.example.backend.message.dto;

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
    private String roomId;
    private String roomName;
    private UserDto creator;

    public static MessageRoomDto fromEntity(MessageRoom messageRoom) {
        return MessageRoomDto.builder()
                .id(messageRoom.getId())
                .roomId(messageRoom.getRoomId())
                .roomName(messageRoom.getRoomName())
                .creator(UserDto.fromEntity(messageRoom.getCreator()))
                .build();
    }
}
