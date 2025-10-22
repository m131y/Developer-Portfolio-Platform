package com.example.backend.message.dto;

import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class CreateRoomRequest {
    private String roomName;
    @Builder.Default
    private List<String> inviteeNames = new ArrayList<>();
}
