package com.inforecord.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
// ✅ 추가: 로깅
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
public class ImageStorageService {

    @Value("${file.upload-dir:images}")
    private String uploadDir;

    private static final List<String> ALLOWED_EXTENSIONS =
            Arrays.asList(".jpg", ".jpeg", ".png", ".gif", ".webp");

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    public String save(MultipartFile file) {
        try {

            validateFile(file);

            // 고유한 파일명 생성
            String originalFilename = file.getOriginalFilename();
            String ext = getFileExtension(originalFilename);
            String uniqueName = UUID.randomUUID().toString() + ext;

            // 저장 경로 생성
            Path dirPath = Paths.get(uploadDir).toAbsolutePath();
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
                log.info("이미지 디렉토리 생성: {}", dirPath);
            }

            // 파일 저장
            Path filePath = dirPath.resolve(uniqueName);
            file.transferTo(filePath.toFile());

            log.info("이미지 저장 완료: {}", uniqueName);

            return "/images/" + uniqueName;

        } catch (IOException e) {
            log.error("이미지 저장 실패", e);
            throw new RuntimeException("이미지 저장 실패", e);
        }
    }

    // 파일 삭제
    public void delete(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return;
        }

        try {
            // URL에서 파일명 추출
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir).resolve(filename);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("이미지 삭제 완료: {}", filename);
            }
        } catch (IOException e) {
            log.error("이미지 삭제 실패: {}", imageUrl, e);
        }
    }

    // 파일 검증
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("빈 파일입니다.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("파일 크기가 10MB를 초과합니다.");
        }

        String filename = file.getOriginalFilename();
        String ext = getFileExtension(filename).toLowerCase();

        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            throw new IllegalArgumentException("지원하지 않는 파일 형식입니다: " + ext);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            throw new IllegalArgumentException("올바른 파일명이 아닙니다.");
        }
        return filename.substring(filename.lastIndexOf("."));
    }
} 