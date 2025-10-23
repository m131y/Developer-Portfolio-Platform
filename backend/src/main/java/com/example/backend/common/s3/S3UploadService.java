package com.example.backend.common.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3UploadService {

    private final S3Client s3Client; // (Spring Cloud AWS가 자동으로 Bean으로 등록해 줍니다)

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

        // 5. 업로드된 파일의 S3 URL 반환
        // (S3Client를 통해 URL을 가져오는 것이 더 정확하지만, 일단 표준 URL 형식으로 반환)
        // (S3 버킷 리전 정보가 필요할 수 있습니다.)
        return String.format("https://%s.s3.amazonaws.com/%s", bucketName, uniqueFileName);

        /* * 참고: 더 정확한 URL을 가져오는 방법 (S3 버킷 리전에 따라 URL이 다를 수 있음)
         * GetUrlRequest getUrlRequest = GetUrlRequest.builder()
         * .bucket(bucketName)
         * .key(uniqueFileName)
         * .build();
         * return s3Client.utilities().getUrl(getUrlRequest).toString();
         */
    }
}