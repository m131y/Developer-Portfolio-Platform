package com.example.backend.comment.service;

import com.example.backend.comment.dto.CommentDto;
import com.example.backend.comment.dto.CreateCommentDto;
import com.example.backend.comment.dto.LikeResponseDto;

import java.util.List;

public interface ProjectSocialService {

    LikeResponseDto toggleLike(Long projectId, Long userId);
    LikeResponseDto getLikeStatus(Long projectId, Long userId);
    CommentDto addComment(Long projectId, Long userId, CreateCommentDto dto);
    List<CommentDto> getComments(Long projectId);
}
