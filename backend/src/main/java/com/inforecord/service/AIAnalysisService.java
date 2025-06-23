package com.inforecord.service;

import com.inforecord.dto.EmotionDto;
import com.inforecord.dto.RecordDto;
import com.inforecord.dto.AIAnalysisDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIAnalysisService {
    
    private static final Logger log = LoggerFactory.getLogger(AIAnalysisService.class);
    
    /**
     * 주간 AI 통계분석을 수행합니다.
     * 
     * @param currentWeekRecords 이번주 기록 목록
     * @param currentWeekEmotions 이번주 감정 목록
     * @param previousWeekRecords 저번주 기록 목록
     * @param previousWeekEmotions 저번주 감정 목록
     * @return AI 분석 결과
     */
    public AIAnalysisDto analyzeWeeklyInsights(
            List<RecordDto> currentWeekRecords,
            List<EmotionDto> currentWeekEmotions,
            List<RecordDto> previousWeekRecords,
            List<EmotionDto> previousWeekEmotions) {
        
        log.info("주간 AI 통계분석 시작");
        
        AIAnalysisDto analysis = new AIAnalysisDto();
        
        // 1. 감정 변화 분석
        analysis.setEmotionChange(analyzeEmotionChange(currentWeekEmotions, previousWeekEmotions));
        
        // 2. 주요 감정 분석
        analysis.setMainEmotion(analyzeMainEmotion(currentWeekEmotions));
        
        // 3. 감정 패턴 분석
        analysis.setEmotionPattern(analyzeEmotionPattern(currentWeekRecords, currentWeekEmotions));
        
        // 4. 날씨-감정 상관관계 분석
        analysis.setWeatherEmotionCorrelation(analyzeWeatherEmotionCorrelation(currentWeekRecords, currentWeekEmotions));
        
        // 5. 개인화된 인사이트 생성
        analysis.setPersonalizedInsights(generatePersonalizedInsights(currentWeekRecords, currentWeekEmotions, previousWeekEmotions));
        
        log.info("주간 AI 통계분석 완료");
        return analysis;
    }
    
    /**
     * 감정 변화 분석
     */
    private String analyzeEmotionChange(List<EmotionDto> current, List<EmotionDto> previous) {
        if (previous.isEmpty()) {
            return "이번 주 첫 기록이에요.";
        }
        
        EmotionDto currentMain = current.stream().max(Comparator.comparing(EmotionDto::getPercentage)).orElse(null);
        EmotionDto previousMain = previous.stream().max(Comparator.comparing(EmotionDto::getPercentage)).orElse(null);
        
        if (currentMain == null || previousMain == null) {
            return "감정 데이터가 부족해 변화를 분석하기 어려워요.";
        }
        
        double change = currentMain.getPercentage() - previousMain.getPercentage();
        
        if (currentMain.getEmotionType().equals(previousMain.getEmotionType())) {
            if (change > 5) { // 변동 폭 기준 완화
                return String.format("지난 주보다 %s 감정을 %.0f%% 더 느꼈어요.", currentMain.getEmotionType(), change);
            } else if (change < -5) {
                return String.format("지난 주보다 %s 감정을 %.0f%% 덜 느꼈어요.", currentMain.getEmotionType(), Math.abs(change));
            } else {
                return String.format("지난 주와 비슷한 수준의 %s 감정을 느꼈어요.", currentMain.getEmotionType());
            }
        } else {
            return String.format("지난 주의 '%s'에서 이번 주는 '%s'을 더 많이 느꼈어요.", previousMain.getEmotionType(), currentMain.getEmotionType());
        }
    }
    
    /**
     * 주요 감정 분석
     */
    private String analyzeMainEmotion(List<EmotionDto> emotions) {
        if (emotions.isEmpty()) {
            return "이번 주 감정 기록이 없어요.";
        }
        
        EmotionDto mainEmotion = emotions.stream().max(Comparator.comparing(EmotionDto::getPercentage)).orElse(null);
            
        if (mainEmotion == null) {
            return "감정 분석 결과를 찾을 수 없어요.";
        }
        
        return String.format("이번 주는 '%s' 감정을 가장 많이 느꼈어요.", mainEmotion.getEmotionType());
    }
    
    /**
     * 감정 패턴 분석
     */
    private String analyzeEmotionPattern(List<RecordDto> records, List<EmotionDto> emotions) {
        if (records.isEmpty() || emotions.isEmpty()) {
            return "감정 패턴을 분석하기에 데이터가 부족해요.";
        }
        
        Map<DayOfWeek, List<EmotionDto>> dayOfWeekEmotions = new HashMap<>();
        for (RecordDto record : records) {
            DayOfWeek dayOfWeek = record.getRecordDate().getDayOfWeek();
            List<EmotionDto> dayEmotions = emotions.stream()
                .filter(e -> e.getDate() != null && e.getDate().equals(record.getRecordDate().toString()))
                .collect(Collectors.toList());
            if (!dayEmotions.isEmpty()) {
                dayOfWeekEmotions.computeIfAbsent(dayOfWeek, k -> new ArrayList<>()).addAll(dayEmotions);
            }
        }
        
        Optional<Map.Entry<DayOfWeek, List<EmotionDto>>> mostEmotionalDay = dayOfWeekEmotions.entrySet().stream()
            .max(Comparator.comparing(entry -> entry.getValue().stream().mapToDouble(EmotionDto::getIntensity).average().orElse(0.0)));
        
        if (mostEmotionalDay.isPresent()) {
            String dayName = getDayName(mostEmotionalDay.get().getKey());
            return String.format("이번 주는 %s에 감정을 가장 강하게 느꼈네요.", dayName);
        }
        
        return "요일별 감정 패턴이 비교적 일정했어요.";
    }
    
    /**
     * 날씨-감정 상관관계 분석
     */
    private String analyzeWeatherEmotionCorrelation(List<RecordDto> records, List<EmotionDto> emotions) {
        if (records.isEmpty() || emotions.isEmpty()) {
            return "날씨와 감정 상관관계를 분석하기에 데이터가 부족해요.";
        }

        Map<String, List<String>> weatherEmotionMap = new HashMap<>();
        for (RecordDto record : records) {
            List<EmotionDto> dayEmotions = emotions.stream()
                .filter(e -> e.getDate() != null && e.getDate().equals(record.getRecordDate().toString()))
                .collect(Collectors.toList());
            
            if (!dayEmotions.isEmpty()) {
                String weather = getDummyWeather(record.getRecordDate());
                String mainEmotion = dayEmotions.stream()
                    .max(Comparator.comparing(EmotionDto::getPercentage))
                    .map(EmotionDto::getEmotionType)
                    .orElse("알 수 없음");
                weatherEmotionMap.computeIfAbsent(weather, k -> new ArrayList<>()).add(mainEmotion);
            }
        }
        
        Optional<Map.Entry<String, List<String>>> mostCommon = weatherEmotionMap.entrySet().stream()
            .max(Comparator.comparing(entry -> entry.getValue().size()));
        
        if (mostCommon.isPresent()) {
            String weather = mostCommon.get().getKey();
            String mostFrequentEmotion = mostCommon.get().getValue().stream()
                .collect(Collectors.groupingBy(e -> e, Collectors.counting()))
                .entrySet().stream().max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse("알 수 없음");
            
            return String.format("%s 날씨에 %s 감정을 자주 느꼈어요.", weather, mostFrequentEmotion);
        }
        
        return "날씨와 감정의 특별한 패턴을 찾기 어려워요.";
    }
    
    /**
     * 개인화된 인사이트 생성
     */
    private String generatePersonalizedInsights(List<RecordDto> records, List<EmotionDto> currentEmotions, List<EmotionDto> previousEmotions) {
        if (records.isEmpty()) {
            return "기록을 남기면 더 자세한 분석을 해드릴게요.";
        }
        
        // 기록 빈도를 기반으로 한 인사이트 하나만 선택
        if (records.size() >= 5) {
            return String.format("이번 주에 %d번 꾸준히 기록을 남겼네요.", records.size());
        } else if (records.size() >= 1) {
            long uniqueEmotions = currentEmotions.stream().map(EmotionDto::getEmotionType).distinct().count();
            if (uniqueEmotions > 1) {
                return String.format("이번 주에 %d가지의 다양한 감정을 느꼈어요.", uniqueEmotions);
            } else {
                 return "감정 기록을 통해 스스로를 더 잘 이해하고 있어요.";
            }
        }
        
        return "꾸준한 기록은 자신을 이해하는 좋은 방법이에요.";
    }
    
    /**
     * 요일명 반환
     */
    private String getDayName(DayOfWeek dayOfWeek) {
        Map<DayOfWeek, String> dayNames = Map.of(
            DayOfWeek.MONDAY, "월요일",
            DayOfWeek.TUESDAY, "화요일", 
            DayOfWeek.WEDNESDAY, "수요일",
            DayOfWeek.THURSDAY, "목요일",
            DayOfWeek.FRIDAY, "금요일",
            DayOfWeek.SATURDAY, "토요일",
            DayOfWeek.SUNDAY, "일요일"
        );
        return dayNames.get(dayOfWeek);
    }
    
    /**
     * 더미 날씨 데이터 (실제로는 날씨 API 연동 필요)
     */
    private String getDummyWeather(LocalDate date) {
        String[] weathers = {"맑음", "흐림", "비", "눈", "안개"};
        return weathers[date.getDayOfYear() % weathers.length];
    }
} 