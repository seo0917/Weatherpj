package com.inforecord.service;

import com.inforecord.dto.PlaceRequest;
import com.inforecord.dto.PlaceSummaryResponse;
import com.inforecord.dto.PlaceDetailResponse;
import com.inforecord.Entity.PlaceLog;
import com.inforecord.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Value;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)  // 읽기 전용 트랜잭션
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final ImageStorageService imageStorageService;

    // 서버 URL 설정
    @Value("${server.url:http://localhost:8080}")
    private String serverUrl;

    // 날짜 포맷터
    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional  // 쓰기 트랜잭션
    public Long savePlaceWithImage(PlaceRequest request, MultipartFile image) {
        log.info("장소 저장 시작: {}", request.getPlaceTitle());

        String imageUrl = imageStorageService.save(image);

        PlaceLog place = PlaceLog.builder()
                .placeTitle(request.getPlaceTitle())
                .comment(request.getComment())
                .color(request.getColor())
                .weather(request.getWeather())
                .temperature(request.getTemperature())
                .humidity(request.getHumidity())
                .imageUrl(imageUrl)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        PlaceLog savedPlace = placeRepository.save(place);
        log.info("장소 저장 완료: ID={}", savedPlace.getId());

        // ID 반환
        return savedPlace.getId();
    }

    public List<PlaceSummaryResponse> getAllPlaceSummaries() {
        // 최신순으로 정렬된 데이터 사용
        return placeRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(place -> PlaceSummaryResponse.builder()
                        .id(place.getId())
                        .title(place.getPlaceTitle())
                        .latitude(place.getLatitude())
                        .longitude(place.getLongitude())
                        .color(place.getColor())
                        // 생성 시간
                        .createdAt(place.getCreatedAt().format(DATE_FORMATTER))
                        .build())
                .collect(Collectors.toList());
    }

    public PlaceDetailResponse getPlaceDetail(Long id) {
        PlaceLog place = placeRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("장소를 찾을 수 없습니다: id={}", id);
                    return new IllegalArgumentException("해당 장소를 찾을 수 없습니다: id=" + id);
                });

        return PlaceDetailResponse.builder()
                .id(place.getId())
                .title(place.getPlaceTitle())
                .comment(place.getComment())
                // 전체 URL 반환
                .imageUrl(serverUrl + place.getImageUrl())
                .weather(place.getWeather())
                .temperature(place.getTemperature())
                .humidity(place.getHumidity())
                .latitude(place.getLatitude())
                .longitude(place.getLongitude())
                // 색상과 생성 시간
                .color(place.getColor())
                .createdAt(place.getCreatedAt().format(DATE_FORMATTER))
                .build();
    }

    // 장소 삭제
    @Transactional
    public void deletePlace(Long id) {
        PlaceLog place = placeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("장소를 찾을 수 없습니다: id=" + id));

        // 이미지 파일 삭제
        imageStorageService.delete(place.getImageUrl());

        // DB에서 삭제
        placeRepository.delete(place);
        log.info("장소 삭제 완료: id={}", id);
    }

    // 검색 기능
    public List<PlaceSummaryResponse> searchPlacesByTitle(String title) {
        return placeRepository.findByPlaceTitleContaining(title).stream()
                .map(this::toSummaryResponse)
                .collect(Collectors.toList());
    }

    // 변환 헬퍼 메서드
    private PlaceSummaryResponse toSummaryResponse(PlaceLog place) {
        return PlaceSummaryResponse.builder()
                .id(place.getId())
                .title(place.getPlaceTitle())
                .latitude(place.getLatitude())
                .longitude(place.getLongitude())
                .color(place.getColor())
                .createdAt(place.getCreatedAt().format(DATE_FORMATTER))
                .build();
    }
} 