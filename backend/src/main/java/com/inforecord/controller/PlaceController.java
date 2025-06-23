package com.inforecord.controller;

import com.inforecord.dto.PlaceRequest;
import com.inforecord.dto.PlaceSummaryResponse;
import com.inforecord.dto.PlaceDetailResponse;
import com.inforecord.service.PlaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "false")
public class PlaceController {

    private final PlaceService placeService;

    // 1. 장소 등록 (이미지 포함)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadPlace(
            @RequestPart("image") MultipartFile image,
            @RequestPart("request") @Valid PlaceRequest request // 검증 추가
    ) {
        //입력 검증
        if (image.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "이미지 파일이 필요합니다."));
        }

        //파일 크기 검증
        if (image.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "파일 크기는 10MB를 초과할 수 없습니다."));
        }

        //이미지 타입 검증
        String contentType = image.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "이미지 파일만 업로드 가능합니다."));
        }

        try {
            //로깅
            log.info("장소 등록 요청: {}", request.getPlaceTitle());

            Long placeId = placeService.savePlaceWithImage(request, image);

            //ID를 포함한 응답 반환
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "장소가 저장되었습니다.",
                            "placeId", placeId
                    ));
        } catch (Exception e) {
            log.error("장소 등록 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "장소 등록 중 오류가 발생했습니다."));
        }

    }

    // 2. 지도용 장소 리스트 조회 (색상, 위치 등)
    @GetMapping
    public ResponseEntity<List<PlaceSummaryResponse>> getAllPlaces() {
        return ResponseEntity.ok(placeService.getAllPlaceSummaries());
    }

    // 3. 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<PlaceDetailResponse> getPlaceById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(placeService.getPlaceDetail(id));
        } catch (IllegalArgumentException e) {
            // 404 처리
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("장소 상세 조회 실패: id={}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    // 장소 삭제 기능
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlace(@PathVariable Long id) {
        try {
            placeService.deletePlace(id);
            return ResponseEntity.ok(Map.of("message", "장소가 삭제되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 