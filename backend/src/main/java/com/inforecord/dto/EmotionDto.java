package com.inforecord.dto;

public class EmotionDto {
    private Long id;
    private String emotionType;
    private Double intensity;
    private Double percentage;
    private String userId;
    private String date;
    private String weekStart;
    private String weekEnd;
    
    public EmotionDto() {}
    
    public EmotionDto(String emotionType, Double intensity, Double percentage) {
        this.emotionType = emotionType;
        this.intensity = intensity;
        this.percentage = percentage;
    }
    
    public EmotionDto(Long id, String emotionType, Double intensity, Double percentage, String userId, String date) {
        this.id = id;
        this.emotionType = emotionType;
        this.intensity = intensity;
        this.percentage = percentage;
        this.userId = userId;
        this.date = date;
    }
    
    public EmotionDto(Long id, String emotionType, Double intensity, Double percentage, String userId, String date, String weekStart, String weekEnd) {
        this.id = id;
        this.emotionType = emotionType;
        this.intensity = intensity;
        this.percentage = percentage;
        this.userId = userId;
        this.date = date;
        this.weekStart = weekStart;
        this.weekEnd = weekEnd;
    }
    
    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmotionType() { return emotionType; }
    public void setEmotionType(String emotionType) { this.emotionType = emotionType; }
    
    public Double getIntensity() { return intensity; }
    public void setIntensity(Double intensity) { this.intensity = intensity; }
    
    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    
    public String getWeekStart() { return weekStart; }
    public void setWeekStart(String weekStart) { this.weekStart = weekStart; }
    
    public String getWeekEnd() { return weekEnd; }
    public void setWeekEnd(String weekEnd) { this.weekEnd = weekEnd; }
}