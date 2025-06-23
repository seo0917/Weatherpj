package com.inforecord.dto;

import lombok.Builder;
import lombok.Getter;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceSummaryResponse {
    private Long id;
    private String title;
    private Double latitude;
    private Double longitude;
    private String color;

    // 생성 시간(선택사항)
    private String createdAt;
} 