package com.example.backend.common.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3UploadService {

    private final S3Client s3Client; // (Spring Cloud AWS가 자동으로 Bean으로 등록해 줍니다)
    private final S3Presigner s3Presigner; // Presigned URL 생성을 위한 S3Presigner

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    /**
     * 파일을 S3에 업로드하고, 파일 URL을 반환합니다.
     * @param file (업로드할 파일)
     * @return S3에 저장된 파일의 전체 URL
     * @throws IOException
     */
    public String uploadFile(MultipartFile file) throws IOException {

        // 1. 파일 원본 이름에서 확장자 추출
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // 2. 고유한 파일 이름 생성 (UUID + 확장자)
        // (파일 이름 중복을 방지)
        String uniqueFileName = UUID.randomUUID().toString() + extension;

        // 3. S3에 업로드할 요청 객체 생성
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)      // 버킷 이름
                .key(uniqueFileName)     // S3에 저장될 파일 이름
                .contentType(file.getContentType()) // 파일 타입
                .build();

        // 4. S3에 파일 업로드
        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        // 5. 업로드된 파일의 S3 키(파일명)만 반환
        // 프론트엔드에서 사용할 때는 presigned URL을 생성해서 제공
        return uniqueFileName;
    }

    /**
     * S3에 저장된 파일의 Presigned URL을 생성합니다.
     * @param s3Key S3에 저장된 파일의 키(파일명)
     * @return 7일간 유효한 presigned URL
     */
    public String generatePresignedUrl(String s3Key) {
        if (s3Key == null || s3Key.isEmpty()) {
            return null;
        }

        // S3 키가 전체 URL인 경우 키만 추출
        String key = s3Key;
        if (s3Key.startsWith("http://") || s3Key.startsWith("https://")) {
            // 기존에 전체 URL이 저장된 경우, 파일명만 추출
            String[] parts = s3Key.split("/");
            key = parts[parts.length - 1];
        }

        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofDays(7)) // 7일간 유효
                    .getObjectRequest(getObjectRequest)
                    .build();

            PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
            return presignedRequest.url().toString();
        } catch (Exception e) {
            // 에러 발생 시 null 반환
            System.err.println("Presigned URL 생성 실패: " + e.getMessage());
            return null;
        }
    }
}