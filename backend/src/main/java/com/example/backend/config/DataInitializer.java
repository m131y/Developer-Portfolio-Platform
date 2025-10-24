package com.example.backend.config;

import com.example.backend.project.entity.Project;
import com.example.backend.project.repository.ProjectRepository;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (projectRepository.count() > 0) {
            log.info("데이터가 이미 존재합니다. 초기화를 건너뜁니다.");
            return;
        }

        log.info("더미 데이터 생성을 시작합니다...");

        User testUser = createTestUser();
        createDummyProjects(testUser.getId());

        log.info("더미 데이터 생성이 완료되었습니다.");
    }

    private User createTestUser() {
        User existingUser = userRepository.findByEmail("test@example.com").orElse(null);
        if (existingUser != null) {
            log.info("테스트 유저가 이미 존재합니다: {}", existingUser.getEmail());
            return existingUser;
        }

        User user = User.builder()
                .email("test@example.com")
                .nickname("TestUser")
                .password(passwordEncoder.encode("password123"))
                .role("ROLE_USER")
                .job("Full Stack Developer")
                .bio("테스트용 개발자 계정입니다.")
                .location("Seoul, Korea")
                .experience("5년차")
                .build();

        User saved = userRepository.save(user);
        log.info("테스트 유저 생성 완료: {}", saved.getEmail());
        return saved;
    }

    private void createDummyProjects(Long userId) {
        List<Project> projects = new ArrayList<>();

        projects.add(Project.builder()
                .title("포트폴리오 웹사이트")
                .summary("개발자 포트폴리오를 관리하고 공유할 수 있는 플랫폼")
                .descriptionMd("# 포트폴리오 플랫폼\n\n개발자들이 자신의 프로젝트를 등록하고 관리할 수 있는 웹 애플리케이션입니다.\n\n## 주요 기능\n- 프로젝트 등록 및 관리\n- OAuth2 소셜 로그인\n- 실시간 메시지 기능\n- 반응형 디자인")
                .startDate(LocalDate.of(2024, 1, 1))
                .endDate(LocalDate.of(2024, 12, 31))
                .type("WEB")
                .status("IN_PROGRESS")
                .repoUrl("https://github.com/example/portfolio-platform")
                .demoUrl("https://portfolio-demo.com")
                .visibility("PUBLIC")
                .ownerId(userId)
                .build());

        projects.add(Project.builder()
                .title("E-Commerce 쇼핑몰")
                .summary("React와 Spring Boot 기반의 온라인 쇼핑몰")
                .descriptionMd("# E-Commerce 프로젝트\n\n풀스택 쇼핑몰 애플리케이션입니다.\n\n## 기술 스택\n- Frontend: React, TailwindCSS\n- Backend: Spring Boot, JPA\n- Database: MySQL\n- 결제: Stripe API")
                .startDate(LocalDate.of(2023, 6, 1))
                .endDate(LocalDate.of(2023, 11, 30))
                .type("WEB")
                .status("COMPLETED")
                .repoUrl("https://github.com/example/ecommerce")
                .demoUrl("https://shop-demo.com")
                .thumbnailUrl("https://via.placeholder.com/400x300")
                .visibility("PUBLIC")
                .ownerId(userId)
                .build());

        projects.add(Project.builder()
                .title("실시간 채팅 애플리케이션")
                .summary("WebSocket을 활용한 실시간 채팅 서비스")
                .descriptionMd("# 실시간 채팅\n\nWebSocket과 STOMP를 사용한 실시간 메시징 플랫폼입니다.\n\n## 특징\n- 1:1 채팅\n- 그룹 채팅\n- 읽음 확인\n- 파일 전송")
                .startDate(LocalDate.of(2023, 3, 1))
                .endDate(LocalDate.of(2023, 5, 31))
                .type("WEB")
                .status("COMPLETED")
                .repoUrl("https://github.com/example/chat-app")
                .visibility("PUBLIC")
                .ownerId(userId)
                .build());

        projects.add(Project.builder()
                .title("Task Management System")
                .summary("팀 협업을 위한 태스크 관리 도구")
                .descriptionMd("# 태스크 관리 시스템\n\n## 기능\n- 칸반 보드\n- 스프린트 관리\n- 팀원 할당\n- 진행률 대시보드")
                .startDate(LocalDate.of(2024, 2, 1))
                .endDate(null)
                .type("WEB")
                .status("IN_PROGRESS")
                .repoUrl("https://github.com/example/task-manager")
                .visibility("PUBLIC")
                .ownerId(userId)
                .build());

        projects.add(Project.builder()
                .title("날씨 예보 앱")
                .summary("OpenWeather API를 활용한 날씨 정보 제공 서비스")
                .descriptionMd("# 날씨 예보 앱\n\n## 기능\n- 현재 날씨 정보\n- 5일 예보\n- 위치 기반 검색\n- 즐겨찾기 지역")
                .startDate(LocalDate.of(2023, 1, 15))
                .endDate(LocalDate.of(2023, 2, 28))
                .type("MOBILE")
                .status("COMPLETED")
                .repoUrl("https://github.com/example/weather-app")
                .demoUrl("https://weather-demo.com")
                .thumbnailUrl("https://via.placeholder.com/400x300")
                .visibility("PUBLIC")
                .ownerId(userId)
                .build());

        projects.add(Project.builder()
                .title("블로그 플랫폼")
                .summary("마크다운 기반의 개발 블로그")
                .descriptionMd("# 개발 블로그\n\n## 주요 기능\n- 마크다운 에디터\n- 코드 하이라이팅\n- 댓글 시스템\n- 태그 분류")
                .startDate(LocalDate.of(2022, 10, 1))
                .endDate(LocalDate.of(2023, 1, 31))
                .type("WEB")
                .status("COMPLETED")
                .repoUrl("https://github.com/example/blog")
                .demoUrl("https://blog-demo.com")
                .visibility("PUBLIC")
                .ownerId(userId)
                .build());

        projects.add(Project.builder()
                .title("API Gateway Service")
                .summary("마이크로서비스 아키텍처를 위한 API Gateway")
                .descriptionMd("# API Gateway\n\n## 기술\n- Spring Cloud Gateway\n- Service Discovery (Eureka)\n- Load Balancing\n- Circuit Breaker")
                .startDate(LocalDate.of(2023, 8, 1))
                .endDate(LocalDate.of(2023, 10, 31))
                .type("BACKEND")
                .status("COMPLETED")
                .repoUrl("https://github.com/example/api-gateway")
                .visibility("PUBLIC")
                .ownerId(userId)
                .build());

        projects.add(Project.builder()
                .title("머신러닝 이미지 분류기")
                .summary("TensorFlow를 활용한 이미지 분류 모델")
                .descriptionMd("# 이미지 분류기\n\n## 모델\n- CNN 아키텍처\n- Transfer Learning (ResNet50)\n- 정확도: 94%\n- 데이터셋: ImageNet")
                .startDate(LocalDate.of(2023, 4, 1))
                .endDate(LocalDate.of(2023, 7, 31))
                .type("AI")
                .status("COMPLETED")
                .repoUrl("https://github.com/example/image-classifier")
                .visibility("PRIVATE")
                .ownerId(userId)
                .build());

        projects.add(Project.builder()
                .title("CI/CD 파이프라인 구축")
                .summary("Jenkins와 Docker를 활용한 자동화 배포")
                .descriptionMd("# CI/CD Pipeline\n\n## 구성\n- Jenkins\n- Docker\n- Kubernetes\n- GitHub Actions")
                .startDate(LocalDate.of(2024, 3, 1))
                .endDate(null)
                .type("DEVOPS")
                .status("IN_PROGRESS")
                .repoUrl("https://github.com/example/cicd-pipeline")
                .docUrl("https://docs.cicd-demo.com")
                .visibility("PUBLIC")
                .ownerId(userId)
                .build());

        projects.add(Project.builder()
                .title("음악 스트리밍 서비스")
                .summary("Spotify 클론 프로젝트")
                .descriptionMd("# 음악 스트리밍\n\n## 기능\n- 음악 재생\n- 플레이리스트 관리\n- 검색 및 필터링\n- 사용자 추천")
                .startDate(LocalDate.of(2022, 5, 1))
                .endDate(LocalDate.of(2022, 9, 30))
                .type("WEB")
                .status("COMPLETED")
                .repoUrl("https://github.com/example/music-streaming")
                .demoUrl("https://music-demo.com")
                .thumbnailUrl("https://via.placeholder.com/400x300")
                .visibility("PUBLIC")
                .ownerId(userId)
                .build());

        projectRepository.saveAll(projects);
        log.info("{}개의 더미 프로젝트가 생성되었습니다.", projects.size());
    }
}
