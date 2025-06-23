package com.inforecord.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisDto {
    private String emotionChange;           // 감정 변화 분석
    private String mainEmotion;             // 주요 감정 분석
    private String emotionPattern;          // 감정 패턴 분석
    private String weatherEmotionCorrelation; // 날씨-감정 상관관계
    private String personalizedInsights;    // 개인화된 인사이트
    
    // Setter 메서드들
    public void setEmotionChange(String emotionChange) { this.emotionChange = emotionChange; }
    public void setMainEmotion(String mainEmotion) { this.mainEmotion = mainEmotion; }
    public void setEmotionPattern(String emotionPattern) { this.emotionPattern = emotionPattern; }
    public void setWeatherEmotionCorrelation(String weatherEmotionCorrelation) { this.weatherEmotionCorrelation = weatherEmotionCorrelation; }
    public void setPersonalizedInsights(String personalizedInsights) { this.personalizedInsights = personalizedInsights; }
    
    // Getter 메서드들
    public String getEmotionChange() { return emotionChange; }
    public String getMainEmotion() { return mainEmotion; }
    public String getEmotionPattern() { return emotionPattern; }
    public String getWeatherEmotionCorrelation() { return weatherEmotionCorrelation; }
    public String getPersonalizedInsights() { return personalizedInsights; }
} 