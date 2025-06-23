package com.inforecord.controller;

import com.inforecord.dto.EmotionDto;
import com.inforecord.service.EmotionAnalysisService;
import com.inforecord.service.RecordService;
import com.inforecord.Entity.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/emotions")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "false")
public class EmotionController {
    
    @Autowired
    private EmotionAnalysisService emotionAnalysisService;
    
    @Autowired
    private RecordService recordService;
    
    @GetMapping("/daily")
    public ResponseEntity<List<EmotionDto>> getDailyEmotions(
            @RequestParam(defaultValue = "default-user") String userId) {
        
        List<EmotionDto> emotions = emotionAnalysisService.getDailyEmotionSummary(userId);
        return ResponseEntity.ok(emotions);
    }
    
    @GetMapping("/weekly")
    public ResponseEntity<List<EmotionDto>> getWeeklyEmotions(
            @RequestParam(defaultValue = "default-user") String userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        List<EmotionDto> emotions = emotionAnalysisService.getWeeklyEmotionSummary(userId, startDate, endDate);
        return ResponseEntity.ok(emotions);
    }

    @PostMapping
    public ResponseEntity<EmotionDto> saveEmotion(@RequestBody EmotionDto emotionDto) {
        try {
            EmotionDto savedEmotion = emotionAnalysisService.saveEmotion(emotionDto);
            return ResponseEntity.ok(savedEmotion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmotionDto> updateEmotion(@PathVariable Long id, @RequestBody EmotionDto emotionDto) {
        try {
            emotionDto.setId(id);
            EmotionDto updatedEmotion = emotionAnalysisService.updateEmotion(emotionDto);
            return ResponseEntity.ok(updatedEmotion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmotion(@PathVariable Long id, @RequestParam(defaultValue = "default-user") String userId) {
        try {
            emotionAnalysisService.deleteEmotion(id, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/weekly")
    public ResponseEntity<Void> clearWeeklyEmotions(
            @RequestParam(defaultValue = "default-user") String userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            emotionAnalysisService.clearWeeklyEmotions(userId, startDate, endDate);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/analyze-weekly")
    public ResponseEntity<List<EmotionDto>> analyzeWeeklyEmotions(
            @RequestParam(defaultValue = "default-user") String userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        try {
            // 주간 기록 조회
            List<Record> records = recordService.getWeeklyRecords(userId, startDate, endDate)
                .stream()
                .map(dto -> {
                    Record record = new Record(dto.getContent(), dto.getRecordDate(), dto.getUserId());
                    record.setId(dto.getId());
                    return record;
                })
                .toList();
            
            // 주간 감정분석 수행
            LocalDate start = startDate != null ? LocalDate.parse(startDate) : LocalDate.now().minusDays(7);
            LocalDate end = endDate != null ? LocalDate.parse(endDate) : LocalDate.now();
            
            List<EmotionDto> emotions = emotionAnalysisService.analyzeWeeklyEmotions(records, userId, start, end);
            return ResponseEntity.ok(emotions);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}