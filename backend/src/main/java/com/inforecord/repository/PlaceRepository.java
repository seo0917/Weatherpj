package com.inforecord.repository;

import com.inforecord.Entity.PlaceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<PlaceLog, Long> {

    // 최신순 정렬 조회
    List<PlaceLog> findAllByOrderByCreatedAtDesc();

    // 제목으로 검색
    List<PlaceLog> findByPlaceTitleContaining(String title);

    // 날짜 범위로 조회
    List<PlaceLog> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // 특정 색상으로 필터링
    List<PlaceLog> findByColor(String color);

    // 좌표 범위로 조회 (지도 영역 내 장소)
    @Query("SELECT p FROM PlaceLog p WHERE " +
            "p.latitude BETWEEN :minLat AND :maxLat AND " +
            "p.longitude BETWEEN :minLon AND :maxLon")
    List<PlaceLog> findByLocationBounds(
            @Param("minLat") Double minLat,
            @Param("maxLat") Double maxLat,
            @Param("minLon") Double minLon,
            @Param("maxLon") Double maxLon
    );
} 