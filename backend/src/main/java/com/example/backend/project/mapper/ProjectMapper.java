package com.example.backend.project.mapper;

import com.example.backend.project.dto.*;
import com.example.backend.project.entity.Project;
import com.example.backend.project.entity.ProjectMedia;
import org.mapstruct.*;

import java.util.List;

//Mapper 추가
@Mapper(componentModel = "spring")
public interface ProjectMapper {

    // --- Entity -> DTO ---
    @Mapping(target = "ownerNickname", ignore = true) // 추후 User 연동 시 채움
    @Mapping(target = "thumbnailUrl", source = "thumbnailUrl")
    @Mapping(target = "techStacks", ignore = true) // 추후 ProjectTechStack 연동 시 채움
    @Mapping(target = "media", ignore = true)      // 별도 조회/매핑
    @Mapping(target = "likeCount", expression = "java(0L)")
    @Mapping(target = "likedByMe", expression = "java(false)")
    ProjectDetailDto toDetail(Project entity);

    ProjectListItemDto toListItem(Project entity);

    ProjectMediaDto toMedia(ProjectMedia media);

    List<ProjectMediaDto> toMediaList(List<ProjectMedia> mediaList);

    // --- DTO -> Entity (Create) ---
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "ownerId", ignore = true) // 서비스에서 세팅
    @Mapping(target = "thumbnailUrl", ignore = true)
    Project toEntity(CreateProjectDto dto);

    // --- Entity 업데이트용 merge (Update) ---
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void merge(UpdateProjectDto dto, @MappingTarget Project entity);
}
