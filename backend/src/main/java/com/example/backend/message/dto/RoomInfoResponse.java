package com.example.backend.message.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RoomInfoResponse {
    private Long roomId; // 또는 Long id;
    private String roomName;
    private List<UserDto> participants; // 참가자 정보를 위한 별도의 DTO
}
