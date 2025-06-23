package com.inforecord.controller;

import com.inforecord.dto.AIAnalysisDto;
import com.inforecord.dto.EmotionDto;
import com.inforecord.dto.RecordDto;
import com.inforecord.service.AIAnalysisService;
import com.inforecord.service.EmotionAnalysisService;
import com.inforecord.service.RecordService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ai-analysis")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "false")
public class AIAnalysisController {
    
    private static final Logger log = LoggerFactory.getLogger(AIAnalysisController.class);
    
    @Autowired
    private AIAnalysisService aiAnalysisService;
    
    @Autowired
    private RecordService recordService;
    
    @Autowired
    private EmotionAnalysisService emotionAnalysisService;
    
    @GetMapping("/weekly")
    public ResponseEntity<AIAnalysisDto> getWeeklyAnalysis(
            @RequestParam(defaultValue = "default-user") String userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        try {
            log.info("주간 AI 분석 요청 - 사용자: {}, 기간: {} ~ {}", userId, startDate, endDate);
            
            // 이번주 데이터 조회
            List<RecordDto> currentWeekRecords = recordService.getWeeklyRecords(userId, startDate, endDate);
            List<EmotionDto> currentWeekEmotions = emotionAnalysisService.getWeeklyEmotionSummary(userId, startDate, endDate);
            
            // 저번주 데이터 조회 (이번주 시작일에서 7일 전부터 이번주 시작일 전까지)
            LocalDate currentStart = startDate != null ? LocalDate.parse(startDate) : LocalDate.now().minusDays(7);
            LocalDate previousStart = currentStart.minusDays(7);
            LocalDate previousEnd = currentStart.minusDays(1);
            
            List<RecordDto> previousWeekRecords = recordService.getWeeklyRecords(userId, previousStart.toString(), previousEnd.toString());
            List<EmotionDto> previousWeekEmotions = emotionAnalysisService.getWeeklyEmotionSummary(userId, previousStart.toString(), previousEnd.toString());
            
            // AI 분석 수행
            AIAnalysisDto analysis = aiAnalysisService.analyzeWeeklyInsights(
                currentWeekRecords, currentWeekEmotions,
                previousWeekRecords, previousWeekEmotions
            );
            
            log.info("주간 AI 분석 완료 - 사용자: {}", userId);
            return ResponseEntity.ok(analysis);
            
        } catch (Exception e) {
            log.error("주간 AI 분석 중 오류 발생 - 사용자: {}", userId, e);
            return ResponseEntity.status(500).build();
        }
    }
} 