package com.example.backend.project.mapper;

import com.example.backend.project.dto.CreateProjectDto;
import com.example.backend.project.dto.ProjectDetailDto;
import com.example.backend.project.dto.ProjectListItemDto;
import com.example.backend.project.dto.ProjectMediaDto;
import com.example.backend.project.dto.UpdateProjectDto;
import com.example.backend.project.entity.Project;
import com.example.backend.project.entity.ProjectMedia;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-23T17:23:08+0900",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.15 (Eclipse Adoptium)"
)
@Component
public class ProjectMapperImpl implements ProjectMapper {

    @Override
    public ProjectDetailDto toDetail(Project entity) {
        if ( entity == null ) {
            return null;
        }

        ProjectDetailDto.ProjectDetailDtoBuilder projectDetailDto = ProjectDetailDto.builder();

        projectDetailDto.thumbnailUrl( entity.getThumbnailUrl() );
        projectDetailDto.id( entity.getId() );
        projectDetailDto.title( entity.getTitle() );
        projectDetailDto.summary( entity.getSummary() );
        projectDetailDto.descriptionMd( entity.getDescriptionMd() );
        projectDetailDto.ownerId( entity.getOwnerId() );
        projectDetailDto.type( entity.getType() );
        projectDetailDto.status( entity.getStatus() );

        projectDetailDto.likeCount( 0L );
        projectDetailDto.likedByMe( false );

        return projectDetailDto.build();
    }

    @Override
    public ProjectListItemDto toListItem(Project entity) {
        if ( entity == null ) {
            return null;
        }

        ProjectListItemDto.ProjectListItemDtoBuilder projectListItemDto = ProjectListItemDto.builder();

        projectListItemDto.id( entity.getId() );
        projectListItemDto.title( entity.getTitle() );
        projectListItemDto.summary( entity.getSummary() );
        projectListItemDto.thumbnailUrl( entity.getThumbnailUrl() );
        projectListItemDto.status( entity.getStatus() );
        projectListItemDto.ownerId( entity.getOwnerId() );

        return projectListItemDto.build();
    }

    @Override
    public ProjectMediaDto toMedia(ProjectMedia media) {
        if ( media == null ) {
            return null;
        }

        ProjectMediaDto.ProjectMediaDtoBuilder projectMediaDto = ProjectMediaDto.builder();

        projectMediaDto.id( media.getId() );
        projectMediaDto.type( media.getType() );
        projectMediaDto.url( media.getUrl() );
        projectMediaDto.sortOrder( media.getSortOrder() );
        projectMediaDto.sizeBytes( media.getSizeBytes() );

        return projectMediaDto.build();
    }

    @Override
    public List<ProjectMediaDto> toMediaList(List<ProjectMedia> mediaList) {
        if ( mediaList == null ) {
            return null;
        }

        List<ProjectMediaDto> list = new ArrayList<ProjectMediaDto>( mediaList.size() );
        for ( ProjectMedia projectMedia : mediaList ) {
            list.add( toMedia( projectMedia ) );
        }

        return list;
    }

    @Override
    public Project toEntity(CreateProjectDto dto) {
        if ( dto == null ) {
            return null;
        }

        Project.ProjectBuilder project = Project.builder();

        project.title( dto.getTitle() );
        project.summary( dto.getSummary() );
        project.descriptionMd( dto.getDescriptionMd() );
        project.startDate( dto.getStartDate() );
        project.endDate( dto.getEndDate() );
        project.type( dto.getType() );
        project.status( dto.getStatus() );
        project.repoUrl( dto.getRepoUrl() );
        project.demoUrl( dto.getDemoUrl() );
        project.docUrl( dto.getDocUrl() );

        return project.build();
    }

    @Override
    public void merge(UpdateProjectDto dto, Project entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getTitle() != null ) {
            entity.setTitle( dto.getTitle() );
        }
        if ( dto.getSummary() != null ) {
            entity.setSummary( dto.getSummary() );
        }
        if ( dto.getDescriptionMd() != null ) {
            entity.setDescriptionMd( dto.getDescriptionMd() );
        }
        if ( dto.getStartDate() != null ) {
            entity.setStartDate( dto.getStartDate() );
        }
        if ( dto.getEndDate() != null ) {
            entity.setEndDate( dto.getEndDate() );
        }
        if ( dto.getType() != null ) {
            entity.setType( dto.getType() );
        }
        if ( dto.getStatus() != null ) {
            entity.setStatus( dto.getStatus() );
        }
        if ( dto.getRepoUrl() != null ) {
            entity.setRepoUrl( dto.getRepoUrl() );
        }
        if ( dto.getDemoUrl() != null ) {
            entity.setDemoUrl( dto.getDemoUrl() );
        }
        if ( dto.getDocUrl() != null ) {
            entity.setDocUrl( dto.getDocUrl() );
        }
        if ( dto.getThumbnailUrl() != null ) {
            entity.setThumbnailUrl( dto.getThumbnailUrl() );
        }
    }
}
