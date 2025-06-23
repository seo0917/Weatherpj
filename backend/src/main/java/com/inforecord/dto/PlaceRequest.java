package com.inforecord.dto;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.*;

@Getter
@Setter
public class PlaceRequest {

    @NotBlank(message = "장소 제목은 필수입니다.")
    @Size(max = 100, message = "장소 제목은 100자를 초과할 수 없습니다.")
    private String placeTitle;

    @Size(max = 500, message = "설명은 500자를 초과할 수 없습니다.")
    private String comment;

    @NotBlank(message = "색상은 필수입니다.")
    @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message = "올바른 색상 형식이 아닙니다.")
    private String color;

    @NotBlank(message = "날씨 정보는 필수입니다.")
    private String weather;

    @NotNull(message = "기온은 필수입니다.")
    @Min(value = -50, message = "기온은 -50도 이상이어야 합니다.")
    @Max(value = 50, message = "기온은 50도 이하여야 합니다.")
    private Float temperature;

    @NotNull(message = "습도는 필수입니다.")
    @Min(value = 0, message = "습도는 0% 이상이어야 합니다.")
    @Max(value = 100, message = "습도는 100% 이하여야 합니다.")
    private Float humidity;

    @NotNull(message = "위도는 필수입니다.")
    @DecimalMin(value = "-90.0", message = "위도는 -90 이상이어야 합니다.")
    @DecimalMax(value = "90.0", message = "위도는 90 이하여야 합니다.")
    private Double latitude;

    @NotNull(message = "경도는 필수입니다.")
    @DecimalMin(value = "-180.0", message = "경도는 -180 이상이어야 합니다.")
    @DecimalMax(value = "180.0", message = "경도는 180 이하여야 합니다.")
    private Double longitude;
} 