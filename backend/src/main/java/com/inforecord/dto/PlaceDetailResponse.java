package com.inforecord.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceDetailResponse {
    private Long id;
    private String title;
    private String comment;
    private String imageUrl;
    private String weather;
    private Float temperature;
    private Float humidity;
    private Double latitude;
    private Double longitude;

    // 추가 정보
    private String color;
    private String createdAt;
} 