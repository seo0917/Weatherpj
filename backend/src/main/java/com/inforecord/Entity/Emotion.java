package com.inforecord.Entity;

import java.time.LocalDate;

public class Emotion {
    private Long id;
    private Record record;
    private String emotionType;
    private Double intensity;
    private LocalDate extractedDate;
    private String userId;
    private LocalDate date;
    private LocalDate weekStart;
    private LocalDate weekEnd;
    
    public Emotion() {}
    
    public Emotion(Record record, String emotionType, Double intensity) {
        this.record = record;
        this.emotionType = emotionType;
        this.intensity = intensity;
        this.extractedDate = LocalDate.now();
        this.userId = record != null ? record.getUserId() : "default-user";
        this.date = LocalDate.now();
    }
    
    public Emotion(String emotionType, Double intensity, String userId, LocalDate date) {
        this.emotionType = emotionType;
        this.intensity = intensity;
        this.userId = userId;
        this.date = date;
        this.extractedDate = LocalDate.now();
    }
    
    public Emotion(String emotionType, Double intensity, String userId, LocalDate date, LocalDate weekStart, LocalDate weekEnd) {
        this.emotionType = emotionType;
        this.intensity = intensity;
        this.userId = userId;
        this.date = date;
        this.weekStart = weekStart;
        this.weekEnd = weekEnd;
        this.extractedDate = LocalDate.now();
    }
    
    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Record getRecord() { return record; }
    public void setRecord(Record record) { this.record = record; }
    
    public String getEmotionType() { return emotionType; }
    public void setEmotionType(String emotionType) { this.emotionType = emotionType; }
    
    public Double getIntensity() { return intensity; }
    public void setIntensity(Double intensity) { this.intensity = intensity; }
    
    public LocalDate getExtractedDate() { return extractedDate; }
    public void setExtractedDate(LocalDate extractedDate) { this.extractedDate = extractedDate; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public LocalDate getWeekStart() { return weekStart; }
    public void setWeekStart(LocalDate weekStart) { this.weekStart = weekStart; }
    
    public LocalDate getWeekEnd() { return weekEnd; }
    public void setWeekEnd(LocalDate weekEnd) { this.weekEnd = weekEnd; }
}