package com.example.backend.comment.service;

import com.example.backend.comment.dto.CommentDto;
import com.example.backend.comment.dto.CreateCommentDto;
import com.example.backend.comment.dto.LikeResponseDto;
import com.example.backend.comment.entity.ProjectComment;
import com.example.backend.comment.entity.ProjectLike;
import com.example.backend.comment.repository.ProjectCommentRepository;
import com.example.backend.comment.repository.ProjectLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectSocialServiceImpl implements ProjectSocialService{

    private final ProjectLikeRepository likeRepository;
    private final ProjectCommentRepository commentRepository;

    @Override
    public LikeResponseDto toggleLike(Long projectId, Long userId){
        boolean exists = likeRepository.existsByProjectIdAndUserId(projectId, userId);
        if(exists) {
            //Unlike
            likeRepository.deleteAll(
                    likeRepository.findAll().stream()
                            .filter(l -> l.getProjectId().equals(projectId) && l.getUserId().equals(userId))
                            .toList()
            );
        }else {
            ProjectLike like = ProjectLike.builder()
                    .projectId(projectId)
                    .userId(userId)
                    .build();
            likeRepository.save(like);
        }
        long count = likeRepository.countByProjectId(projectId);
        boolean likeByMe = !exists;
        return LikeResponseDto.builder()
                .likeCount(count)
                .likedByMe(likeByMe)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public LikeResponseDto getLikeStatus(Long projectId, Long userId) {
        long count = likeRepository.countByProjectId(projectId);
        boolean likedByMe = likeRepository.existsByProjectIdAndUserId(projectId, userId);
        return LikeResponseDto.builder()
                .likeCount(count)
                .likedByMe(likedByMe)
                .build();
    }

    @Override
    public CommentDto addComment(Long projectId, Long userId, CreateCommentDto dto) {
        ProjectComment comment = ProjectComment.builder()
                .projectId(projectId)
                .userId(userId)
                .parentId(dto.getParentId())
                .content(dto.getContent())
                .build();

        ProjectComment saved = commentRepository.save(comment);
        return toDto(saved, new ArrayList<>());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDto> getComments(Long projectId) {
        List<ProjectComment> comments = commentRepository.findByProjectIdOrderByCreatedAtAsc(projectId);
        // Map <- parent ID
        Map<Long, List<ProjectComment>> byParent = comments.stream()
                .collect(Collectors.groupingBy(c -> Optional.ofNullable(c.getParentId()).orElse(0L)));

        return buildTree(byParent, 0L);
    }

    private List<CommentDto> buildTree(Map<Long, List<ProjectComment>> byParent, Long parentId) {
        List<ProjectComment> children = byParent.getOrDefault(parentId, Collections.emptyList());
        List<CommentDto> result = new ArrayList<>();
        for(ProjectComment child : children) {
            List<CommentDto> replies = buildTree(byParent, child.getId());
            result.add(toDto(child, replies));
        }
        return result;
    }

    private CommentDto toDto (ProjectComment entity, List<CommentDto> replies) {
        return CommentDto.builder()
                .id(entity.getId())
                .projectId(entity.getProjectId())
                .userId(entity.getUserId())
                .parentId(entity.getParentId())
                .content(entity.getContent())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .replies(replies)
                .build();
    }

}
