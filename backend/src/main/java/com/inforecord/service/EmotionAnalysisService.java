package com.inforecord.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inforecord.Entity.Emotion;
import com.inforecord.Entity.Record;
import com.inforecord.dto.EmotionDto;
import com.inforecord.repository.EmotionRepository;

@Service
public class EmotionAnalysisService {
    
    private static final Logger log = LoggerFactory.getLogger(EmotionAnalysisService.class);
    private static final String PYTHON_SCRIPT_PATH = "C:/Users/COEL_03/Desktop/sample/backend/emotion_analyze.py";
    
    @Autowired
    private EmotionRepository emotionRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public void analyzeAndSaveEmotions(Record record) {
        try {
            log.info("감정 분석 시작 - 기록 ID: {}", record.getId());

            // Flask REST API 호출
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:5000/analyze";
            Map<String, String> request = new HashMap<>();
            request.put("text", record.getContent());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map<String, Object> result = response.getBody();
            if (result == null || !result.containsKey("emotion")) {
                log.error("Flask 감정분석 결과가 비어있음: {}", result);
                throw new RuntimeException("Flask 감정분석 결과가 비어있음");
            }
            String emotionType = (String) result.get("emotion");
            Double intensity = result.get("confidence") != null ? Double.valueOf(result.get("confidence").toString()) / 100.0 : 0.0;
            
            // 주간 범위 계산 (월요일부터 일요일)
            LocalDate recordDate = record.getRecordDate();
            LocalDate weekStart = recordDate.minusDays(recordDate.getDayOfWeek().getValue() - 1);
            LocalDate weekEnd = weekStart.plusDays(6);
            
            List<Emotion> emotions = new ArrayList<>();
            Emotion emotion = new Emotion(record, emotionType, intensity);
            emotion.setDate(recordDate); // 기록 날짜로 설정
            emotion.setWeekStart(weekStart); // 주간 시작일 설정
            emotion.setWeekEnd(weekEnd); // 주간 종료일 설정
            emotions.add(emotion);
            
            // 감정 분석 결과 저장
            emotionRepository.saveAll(emotions);
            log.info("감정 분석 완료 - 기록 ID: {}, 감정: {} ({}%), 주간: {} ~ {}", 
                    record.getId(), emotionType, intensity * 100, weekStart, weekEnd);
        } catch (Exception e) {
            log.error("감정 분석 중 오류 발생 - 기록 ID: {}", record.getId(), e);
            throw new RuntimeException("감정 분석에 실패했습니다", e);
        }
    }
    
    public List<EmotionDto> getWeeklyEmotionSummary(String userId, String startDate, String endDate) {
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : LocalDate.now().minusDays(7);
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : LocalDate.now();
        
        // 주간 감정 데이터 조회 (weekStart와 weekEnd 필드 사용)
        List<Emotion> emotions = emotionRepository.findEmotionsByUserIdAndWeekRange(userId, start, end);
        
        log.debug("주간 감정 데이터 조회 - 사용자: {}, 기간: {} ~ {}, 조회된 데이터 수: {}", userId, start, end, emotions.size());
        
        if (emotions.isEmpty()) {
            log.info("주간 감정 데이터가 없음 - 사용자: {}, 기간: {} ~ {}", userId, start, end);
            return new ArrayList<>();
        }
        
        // 감정별 그룹화 및 비율 계산
        Map<String, List<Emotion>> emotionGroups = emotions.stream()
            .collect(Collectors.groupingBy(Emotion::getEmotionType));
        
        double totalIntensity = emotions.stream()
            .mapToDouble(Emotion::getIntensity)
            .sum();
        
        List<EmotionDto> result = emotionGroups.entrySet().stream()
            .map(entry -> {
                String emotionType = entry.getKey();
                double avgIntensity = entry.getValue().stream()
                    .mapToDouble(Emotion::getIntensity)
                    .average()
                    .orElse(0.0);
                double percentage = totalIntensity > 0 ? (entry.getValue().stream()
                    .mapToDouble(Emotion::getIntensity)
                    .sum() / totalIntensity) * 100 : 0.0;
                
                EmotionDto dto = new EmotionDto(emotionType, avgIntensity, percentage);
                log.debug("감정 분석 결과 - 타입: {}, 강도: {}, 비율: {}", emotionType, avgIntensity, percentage);
                return dto;
            })
            .sorted((a, b) -> Double.compare(b.getPercentage(), a.getPercentage()))
            .collect(Collectors.toList());
        
        log.info("주간 감정 분석 결과 - 사용자: {}, 결과 수: {}", userId, result.size());
        return result;
    }
    
    public List<EmotionDto> getDailyEmotionSummary(String userId) {
        LocalDate today = LocalDate.now();
        
        List<Emotion> emotions = emotionRepository.findEmotionsByUserIdAndDateRange(
            userId, today, today);
        
        // 감정별 그룹화 및 비율 계산
        Map<String, List<Emotion>> emotionGroups = emotions.stream()
            .collect(Collectors.groupingBy(Emotion::getEmotionType));
        
        double totalIntensity = emotions.stream()
            .mapToDouble(Emotion::getIntensity)
            .sum();
        
        return emotionGroups.entrySet().stream()
            .map(entry -> {
                String emotionType = entry.getKey();
                double avgIntensity = entry.getValue().stream()
                    .mapToDouble(Emotion::getIntensity)
                    .average()
                    .orElse(0.0);
                double percentage = totalIntensity > 0 ? (entry.getValue().stream()
                    .mapToDouble(Emotion::getIntensity)
                    .sum() / totalIntensity) * 100 : 0.0;
                
                return new EmotionDto(emotionType, avgIntensity, percentage);
            })
            .sorted((a, b) -> Double.compare(b.getPercentage(), a.getPercentage()))
            .collect(Collectors.toList());
    }
    
    private List<Emotion> generateDummyEmotions(Record record) {
        // 더미 감정 데이터 생성 (실제 구현 전까지 사용)
        List<Emotion> emotions = new ArrayList<>();
        String[] emotionTypes = {"기쁨", "슬픔", "화남", "평온", "불안"};
        Random random = new Random();
        
        for (int i = 0; i < 2 + random.nextInt(3); i++) {
            String emotionType = emotionTypes[random.nextInt(emotionTypes.length)];
            double intensity = 0.3 + random.nextDouble() * 0.7;
            emotions.add(new Emotion(record, emotionType, intensity));
        }
        
        return emotions;
    }

    private String extractJsonFromOutput(String output) {
        // 마지막 줄에서 JSON 찾기
        String[] lines = output.split("\n");
        for (int i = lines.length - 1; i >= 0; i--) {
            String line = lines[i].trim();
            if (line.startsWith("[") && line.endsWith("]")) {
                return line;
            }
        }
        return null;
    }

    // 감정 분석 데이터 저장
    public EmotionDto saveEmotion(EmotionDto emotionDto) {
        try {
            Emotion emotion = new Emotion();
            emotion.setEmotionType(emotionDto.getEmotionType());
            emotion.setIntensity(emotionDto.getIntensity());
            emotion.setUserId(emotionDto.getUserId());
            emotion.setDate(LocalDate.parse(emotionDto.getDate()));
            
            // 주간 정보 설정
            if (emotionDto.getWeekStart() != null) {
                emotion.setWeekStart(LocalDate.parse(emotionDto.getWeekStart()));
            }
            if (emotionDto.getWeekEnd() != null) {
                emotion.setWeekEnd(LocalDate.parse(emotionDto.getWeekEnd()));
            }
            
            Emotion savedEmotion = emotionRepository.save(emotion);
            
            // 저장된 데이터를 DTO로 변환하여 반환
            EmotionDto savedDto = new EmotionDto();
            savedDto.setId(savedEmotion.getId());
            savedDto.setEmotionType(savedEmotion.getEmotionType());
            savedDto.setIntensity(savedEmotion.getIntensity());
            savedDto.setUserId(savedEmotion.getUserId());
            savedDto.setDate(savedEmotion.getDate().toString());
            if (savedEmotion.getWeekStart() != null) {
                savedDto.setWeekStart(savedEmotion.getWeekStart().toString());
            }
            if (savedEmotion.getWeekEnd() != null) {
                savedDto.setWeekEnd(savedEmotion.getWeekEnd().toString());
            }
            
            return savedDto;
        } catch (Exception e) {
            log.error("감정 분석 데이터 저장 실패", e);
            throw new RuntimeException("감정 분석 데이터 저장에 실패했습니다", e);
        }
    }

    // 감정 분석 데이터 업데이트
    public EmotionDto updateEmotion(EmotionDto emotionDto) {
        try {
            Emotion existingEmotion = emotionRepository.findById(emotionDto.getId())
                .orElseThrow(() -> new RuntimeException("감정 분석 데이터를 찾을 수 없습니다"));
            
            existingEmotion.setEmotionType(emotionDto.getEmotionType());
            existingEmotion.setIntensity(emotionDto.getIntensity());
            existingEmotion.setUserId(emotionDto.getUserId());
            if (emotionDto.getDate() != null) {
                existingEmotion.setDate(LocalDate.parse(emotionDto.getDate()));
            }
            
            Emotion updatedEmotion = emotionRepository.save(existingEmotion);
            
            // 업데이트된 데이터를 DTO로 변환하여 반환
            EmotionDto updatedDto = new EmotionDto();
            updatedDto.setId(updatedEmotion.getId());
            updatedDto.setEmotionType(updatedEmotion.getEmotionType());
            updatedDto.setIntensity(updatedEmotion.getIntensity());
            updatedDto.setUserId(updatedEmotion.getUserId());
            updatedDto.setDate(updatedEmotion.getDate().toString());
            
            return updatedDto;
        } catch (Exception e) {
            log.error("감정 분석 데이터 업데이트 실패", e);
            throw new RuntimeException("감정 분석 데이터 업데이트에 실패했습니다", e);
        }
    }

    // 감정 분석 데이터 삭제
    public void deleteEmotion(Long id, String userId) {
        try {
            Emotion emotion = emotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("감정 분석 데이터를 찾을 수 없습니다"));
            
            // 사용자 확인
            if (!emotion.getUserId().equals(userId)) {
                throw new RuntimeException("해당 감정 분석 데이터에 대한 권한이 없습니다");
            }
            
            emotionRepository.delete(emotion);
        } catch (Exception e) {
            log.error("감정 분석 데이터 삭제 실패", e);
            throw new RuntimeException("감정 분석 데이터 삭제에 실패했습니다", e);
        }
    }

    // 주간 감정 분석 데이터 초기화
    public void clearWeeklyEmotions(String userId, String startDate, String endDate) {
        try {
            LocalDate start = startDate != null ? LocalDate.parse(startDate) : LocalDate.now().minusDays(7);
            LocalDate end = endDate != null ? LocalDate.parse(endDate) : LocalDate.now();
            
            List<Emotion> emotionsToDelete = emotionRepository.findEmotionsByUserIdAndDateRange(userId, start, end);
            
            for (Emotion emotion : emotionsToDelete) {
                emotionRepository.delete(emotion);
            }
            
            log.info("주간 감정 분석 데이터 초기화 완료 - 사용자: {}, 삭제된 데이터 수: {}", userId, emotionsToDelete.size());
        } catch (Exception e) {
            log.error("주간 감정 분석 데이터 초기화 실패", e);
            throw new RuntimeException("주간 감정 분석 데이터 초기화에 실패했습니다", e);
        }
    }

    // 감정 분석 데이터 저장 (기존 데이터 초기화 후 저장)
    public EmotionDto saveEmotionWithClear(EmotionDto emotionDto) {
        try {
            // 기존 주간 데이터 초기화
            clearWeeklyEmotions(emotionDto.getUserId(), null, null);
            
            // 새 데이터 저장
            return saveEmotion(emotionDto);
        } catch (Exception e) {
            log.error("감정 분석 데이터 저장 실패", e);
            throw new RuntimeException("감정 분석 데이터 저장에 실패했습니다", e);
        }
    }

    /**
     * 주간 기록을 기반으로 감정분석을 수행하고 저장합니다.
     * 기존 주간 감정 데이터를 삭제하고 새로 분석합니다.
     * 
     * @param records 주간 기록 목록
     * @param userId 사용자 ID
     * @param startDate 주간 시작 날짜
     * @param endDate 주간 종료 날짜
     * @return 분석된 감정 목록
     */
    public List<EmotionDto> analyzeWeeklyEmotions(List<Record> records, String userId, LocalDate startDate, LocalDate endDate) {
        try {
            log.info("주간 감정분석 시작 - 사용자: {}, 기간: {} ~ {}, 기록 수: {}", userId, startDate, endDate, records.size());
            
            // 기존 주간 감정 데이터 삭제
            clearWeeklyEmotions(userId, startDate.toString(), endDate.toString());
            
            if (records.isEmpty()) {
                log.info("분석할 기록이 없음 - 사용자: {}", userId);
                return new ArrayList<>();
            }
            
            List<EmotionDto> emotionDtos = new ArrayList<>();
            
            // 각 기록별로 개별 감정분석 수행
            for (Record record : records) {
                try {
                    // Flask REST API 호출
                    RestTemplate restTemplate = new RestTemplate();
                    String url = "http://localhost:5000/analyze";
                    Map<String, String> request = new HashMap<>();
                    request.put("text", record.getContent());
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);
                    HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);
                    ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
                    Map<String, Object> result = response.getBody();
                    
                    if (result == null || !result.containsKey("emotion")) {
                        log.error("Flask 감정분석 결과가 비어있음: {}", result);
                        continue;
                    }
                    
                    String emotionType = (String) result.get("emotion");
                    Double intensity = result.get("confidence") != null ? Double.valueOf(result.get("confidence").toString()) / 100.0 : 0.0;
                    
                    // 주간 감정 데이터 생성 및 저장
                    Emotion weeklyEmotion = new Emotion();
                    weeklyEmotion.setEmotionType(emotionType);
                    weeklyEmotion.setIntensity(intensity);
                    weeklyEmotion.setUserId(userId);
                    weeklyEmotion.setDate(record.getRecordDate());
                    weeklyEmotion.setWeekStart(startDate);
                    weeklyEmotion.setWeekEnd(endDate);
                    
                    Emotion savedEmotion = emotionRepository.save(weeklyEmotion);
                    
                    // DTO로 변환하여 리스트에 추가
                    EmotionDto emotionDto = new EmotionDto();
                    emotionDto.setId(savedEmotion.getId());
                    emotionDto.setEmotionType(savedEmotion.getEmotionType());
                    emotionDto.setIntensity(savedEmotion.getIntensity());
                    emotionDto.setUserId(savedEmotion.getUserId());
                    emotionDto.setDate(savedEmotion.getDate().toString());
                    emotionDto.setWeekStart(savedEmotion.getWeekStart().toString());
                    emotionDto.setWeekEnd(savedEmotion.getWeekEnd().toString());
                    
                    emotionDtos.add(emotionDto);
                    
                    log.debug("기록별 감정분석 완료 - 기록 ID: {}, 감정: {} ({}%)", record.getId(), emotionType, intensity * 100);
                    
                } catch (Exception e) {
                    log.error("개별 기록 감정분석 실패 - 기록 ID: {}", record.getId(), e);
                }
            }
            
            log.info("주간 감정분석 완료 - 사용자: {}, 분석된 감정 수: {}", userId, emotionDtos.size());
            
            return emotionDtos;
            
        } catch (Exception e) {
            log.error("주간 감정분석 중 오류 발생 - 사용자: {}, 기간: {} ~ {}", userId, startDate, endDate, e);
            throw new RuntimeException("주간 감정분석에 실패했습니다", e);
        }
    }
}