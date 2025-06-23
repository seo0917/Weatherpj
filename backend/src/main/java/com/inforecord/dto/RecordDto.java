package com.inforecord.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecordDto {
    private Long id;
    private String content;
    private LocalDate recordDate;
    private String userId;
    private String weatherDesc;
    private String weatherIcon;
    private Double weatherTemp;
    
    // Getter 메서드들
    public Long getId() { return id; }
    public String getContent() { return content; }
    public LocalDate getRecordDate() { return recordDate; }
    public String getUserId() { return userId; }
    public String getWeatherDesc() { return weatherDesc; }
    public String getWeatherIcon() { return weatherIcon; }
    public Double getWeatherTemp() { return weatherTemp; }
    
    // Setter 메서드들
    public void setId(Long id) { this.id = id; }
    public void setContent(String content) { this.content = content; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setWeatherDesc(String weatherDesc) { this.weatherDesc = weatherDesc; }
    public void setWeatherIcon(String weatherIcon) { this.weatherIcon = weatherIcon; }
    public void setWeatherTemp(Double weatherTemp) { this.weatherTemp = weatherTemp; }
}