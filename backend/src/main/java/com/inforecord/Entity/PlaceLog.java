package com.inforecord.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Entity
@Table(name = "place_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "imageUrl")
public class PlaceLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String placeTitle;

    @Column(length = 500)  // 길이 제한
    private String comment;

    @Column(nullable = false, length = 7)  // HEX 색상
    private String color;

    @Column(nullable = false)
    private String weather;

    @Column(nullable = false)
    private Float temperature;

    @Column(nullable = false)
    private Float humidity;

    @Column(length = 500)  // URL 길이
    private String imageUrl;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(updatable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    // 수정 시간
    private LocalDateTime updatedAt;

    @PrePersist
    public void initTime() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // 업데이트 시간 자동 갱신
    @PreUpdate
    public void updateTime() {
        this.updatedAt = LocalDateTime.now();
    }
} 