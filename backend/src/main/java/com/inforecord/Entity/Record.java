package com.inforecord.Entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 사용자의 정보 기록을 저장하는 엔티티
 * 하루에 하나의 기록만 저장 가능 (날짜 + 사용자 ID 유니크 제약)
 */
@Getter
@Setter
@NoArgsConstructor
public class Record {
    
    /**
     * 기록의 고유 ID (자동 증가)
     */
    private Long id;
    
    /**
     * 기록 내용 (필수 입력, 공백 불가)
     */
    private String content;
    
    /**
     * 기록 날짜 (필수 입력)
     */
    private LocalDate recordDate;
    
    /**
     * 생성 시간 (자동 설정)
     */
    private LocalDateTime createdAt;
    
    /**
     * 수정 시간 (업데이트 시 자동 갱신)
     */
    private LocalDateTime updatedAt;
    
    /**
     * 사용자 ID (현재는 문자열, 추후 User 엔티티와 연관관계 설정 예정)
     */
    private String userId;
    
    /**
     * 날씨 설명
     */
    private String weatherDesc;
    
    /**
     * 날씨 아이콘
     */
    private String weatherIcon;
    
    /**
     * 날씨 온도
     */
    private Double weatherTemp;
    
    /**
     * 기록 생성자
     * @param content 기록 내용
     * @param recordDate 기록 날짜
     * @param userId 사용자 ID
     */
    public Record(String content, LocalDate recordDate, String userId) {
        this.content = content;
        this.recordDate = recordDate;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
    }
    
    /**
     * 엔티티가 저장되기 전에 실행 (생성 시간 설정)
     */
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
    
    /**
     * 엔티티가 업데이트되기 전에 실행 (수정 시간 갱신)
     */
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getter/Setter 메서드들
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getWeatherDesc() { return weatherDesc; }
    public void setWeatherDesc(String weatherDesc) { this.weatherDesc = weatherDesc; }
    
    public String getWeatherIcon() { return weatherIcon; }
    public void setWeatherIcon(String weatherIcon) { this.weatherIcon = weatherIcon; }
    
    public Double getWeatherTemp() { return weatherTemp; }
    public void setWeatherTemp(Double weatherTemp) { this.weatherTemp = weatherTemp; }

    /**
     * toString 메서드 (디버깅용)
     */
    @Override
    public String toString() {
        return String.format("Record{id=%d, recordDate=%s, userId='%s', content='%.50s%s'}", 
                           id, recordDate, userId, 
                           content != null && content.length() > 50 ? content : content,
                           content != null && content.length() > 50 ? "..." : "");
    }
}