package com.inforecord.controller;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.inforecord.dto.RecordDto;
import com.inforecord.service.RecordService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;

/**
 * 정보 기록 관련 REST API 컨트롤러
 * 기록 생성, 조회, 수정 기능을 제공합니다.
 */
@RestController
@RequestMapping("/api/records")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "false")
@RequiredArgsConstructor
@Validated
public class RecordController {
    
    private static final Logger log = LoggerFactory.getLogger(RecordController.class);
    private final RecordService recordService;
    
    /**
     * 새로운 기록을 저장하거나 기존 기록을 수정합니다.
     * 같은 날짜에 이미 기록이 있으면 내용을 업데이트합니다.
     * 
     * @param request 기록 저장 요청 데이터
     * @return 저장된 기록 정보
     */
    @PostMapping
    public ResponseEntity<RecordDto> saveRecord(@Valid @RequestBody RecordSaveRequest request) {
        log.info("기록 저장 요청 - 날짜: {}, 사용자: {}, 내용 길이: {}", 
                request.getDate(), request.getUserId(), 
                request.getContent() != null ? request.getContent().length() : 0);
        
        try {
            LocalDate date = LocalDate.parse(request.getDate());
            RecordDto savedRecord = recordService.saveRecord(
                request.getContent(), 
                date, 
                request.getUserId(),
                request.getWeatherDesc(),
                request.getWeatherIcon(),
                request.getWeatherTemp()
            );
            
            log.info("기록 저장 완료 - ID: {}", savedRecord.getId());
            return ResponseEntity.ok(savedRecord);
            
        } catch (DateTimeParseException e) {
            log.error("잘못된 날짜 형식: {}", request.getDate());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("기록 저장 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 특정 날짜의 기록을 조회합니다.
     * 
     * @param date 조회할 날짜 (yyyy-MM-dd 형식)
     * @param userId 사용자 ID
     * @return 해당 날짜의 기록 또는 404
     */
    @GetMapping("/{date}")
    public ResponseEntity<RecordDto> getRecordByDate(
            @PathVariable 
            @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "날짜는 yyyy-MM-dd 형식이어야 합니다")
            String date,
            @RequestParam(defaultValue = "default-user") 
            @NotBlank(message = "사용자 ID는 필수입니다")
            String userId) {
        
        log.info("기록 조회 요청 - 날짜: {}, 사용자: {}", date, userId);
        
        try {
            LocalDate recordDate = LocalDate.parse(date);
            return recordService.getRecordByDate(recordDate, userId)
                    .map(record -> {
                        log.info("기록 조회 성공 - ID: {}", record.getId());
                        return ResponseEntity.ok(record);
                    })
                    .orElseGet(() -> {
                        log.info("해당 날짜에 기록이 없음 - 날짜: {}, 사용자: {}", date, userId);
                        return ResponseEntity.notFound().build();
                    });
                    
        } catch (DateTimeParseException e) {
            log.error("잘못된 날짜 형식: {}", date);
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 특정 ID의 기록을 조회합니다.
     * 
     * @param recordId 조회할 기록의 ID
     * @param userId 사용자 ID
     * @return 해당 ID의 기록 또는 404
     */
    @GetMapping("/id/{recordId}")
    public ResponseEntity<RecordDto> getRecordById(
            @PathVariable Long recordId,
            @RequestParam(defaultValue = "default-user") 
            @NotBlank(message = "사용자 ID는 필수입니다")
            String userId) {
        
        log.info("기록 조회 요청 - ID: {}, 사용자: {}", recordId, userId);
        
        try {
            return recordService.getRecordById(recordId, userId)
                    .map(record -> {
                        log.info("기록 조회 성공 - ID: {}", record.getId());
                        return ResponseEntity.ok(record);
                    })
                    .orElseGet(() -> {
                        log.info("해당 ID의 기록이 없음 - ID: {}, 사용자: {}", recordId, userId);
                        return ResponseEntity.notFound().build();
                    });
                    
        } catch (Exception e) {
            log.error("기록 조회 중 오류 발생 - ID: {}", recordId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 현재 주의 모든 기록을 조회합니다.
     * 월요일부터 일요일까지의 기록을 반환합니다.
     * 
     * @param userId 사용자 ID
     * @param startDate 시작 날짜 (선택사항)
     * @param endDate 종료 날짜 (선택사항)
     * @return 주간 기록 목록
     */
    @GetMapping("/weekly")
    public ResponseEntity<List<RecordDto>> getWeeklyRecords(
            @RequestParam(defaultValue = "default-user") 
            @NotBlank(message = "사용자 ID는 필수입니다")
            String userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        log.info("주간 기록 조회 요청 - 사용자: {}", userId);
        
        try {
            List<RecordDto> weeklyRecords = recordService.getWeeklyRecords(userId, startDate, endDate);
            log.info("주간 기록 조회 완료 - 사용자: {}, 기록 수: {}", userId, weeklyRecords.size());
            return ResponseEntity.ok(weeklyRecords);
            
        } catch (Exception e) {
            log.error("주간 기록 조회 중 오류 발생 - 사용자: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 오늘 날짜의 기록을 조회합니다.
     * 
     * @param userId 사용자 ID
     * @return 오늘의 기록 목록
     */
    @GetMapping("/daily")
    public ResponseEntity<List<RecordDto>> getDailyRecords(
            @RequestParam(defaultValue = "default-user") 
            @NotBlank(message = "사용자 ID는 필수입니다")
            String userId) {
        
        log.info("일간 기록 조회 요청 - 사용자: {}", userId);
        
        try {
            List<RecordDto> dailyRecords = recordService.getDailyRecords(userId);
            log.info("일간 기록 조회 완료 - 사용자: {}, 기록 수: {}", userId, dailyRecords.size());
            return ResponseEntity.ok(dailyRecords);
            
        } catch (Exception e) {
            log.error("일간 기록 조회 중 오류 발생 - 사용자: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 모든 기록(공동 기록) 전체 조회
     */
    @GetMapping("/our")
    public ResponseEntity<List<RecordDto>> getAllRecords() {
        List<RecordDto> allRecords = recordService.getAllRecords();
        return ResponseEntity.ok(allRecords);
    }
    
    /**
     * 현재 사용자를 제외한 모든 기록 조회 (Our Record용)
     * 
     * @param currentUserId 제외할 현재 사용자 ID
     * @return 현재 사용자를 제외한 모든 기록 목록
     */
    @GetMapping("/our/others")
    public ResponseEntity<List<RecordDto>> getAllRecordsExceptUser(
            @RequestParam(defaultValue = "default-user") 
            @NotBlank(message = "현재 사용자 ID는 필수입니다")
            String currentUserId) {
        
        log.info("다른 사용자 기록 조회 요청 - 현재 사용자: {}", currentUserId);
        
        try {
            List<RecordDto> otherRecords = recordService.getAllRecordsExceptUser(currentUserId);
            log.info("다른 사용자 기록 조회 완료 - 조회된 기록 수: {}", otherRecords.size());
            return ResponseEntity.ok(otherRecords);
        } catch (Exception e) {
            log.error("다른 사용자 기록 조회 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 특정 ID의 기록을 수정합니다.
     * 
     * @param recordId 수정할 기록의 ID
     * @param request 수정할 기록 데이터
     * @return 수정된 기록 정보
     */
    @PutMapping("/{recordId}")
    public ResponseEntity<RecordDto> updateRecord(
            @PathVariable Long recordId,
            @Valid @RequestBody RecordSaveRequest request) {
        
        log.info("기록 수정 요청 - ID: {}, 날짜: {}, 사용자: {}, 내용 길이: {}", 
                recordId, request.getDate(), request.getUserId(), 
                request.getContent() != null ? request.getContent().length() : 0);
        
        try {
            LocalDate date = LocalDate.parse(request.getDate());
            RecordDto updatedRecord = recordService.updateRecord(
                recordId,
                request.getContent(), 
                date, 
                request.getUserId(),
                request.getWeatherDesc(),
                request.getWeatherIcon(),
                request.getWeatherTemp()
            );
            
            log.info("기록 수정 완료 - ID: {}", updatedRecord.getId());
            return ResponseEntity.ok(updatedRecord);
            
        } catch (DateTimeParseException e) {
            log.error("잘못된 날짜 형식: {}", request.getDate());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("기록 수정 중 오류 발생 - ID: {}", recordId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 특정 ID의 기록을 삭제합니다.
     * 
     * @param recordId 삭제할 기록의 ID
     * @param userId 사용자 ID
     * @return 삭제 성공 여부
     */
    @DeleteMapping("/{recordId}")
    public ResponseEntity<Void> deleteRecord(
            @PathVariable Long recordId,
            @RequestParam(defaultValue = "default-user") 
            @NotBlank(message = "사용자 ID는 필수입니다")
            String userId) {
        
        log.info("기록 삭제 요청 - ID: {}, 사용자: {}", recordId, userId);
        
        try {
            boolean deleted = recordService.deleteRecord(recordId, userId);
            if (deleted) {
                log.info("기록 삭제 완료 - ID: {}", recordId);
                return ResponseEntity.ok().build();
            } else {
                log.info("삭제할 기록이 없음 - ID: {}, 사용자: {}", recordId, userId);
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            log.error("기록 삭제 중 오류 발생 - ID: {}", recordId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 기록 저장 요청 DTO
     */
    public static class RecordSaveRequest {
        @NotBlank(message = "기록 내용은 필수입니다")
        private String content;
        
        @NotBlank(message = "날짜는 필수입니다")
        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "날짜는 yyyy-MM-dd 형식이어야 합니다")
        private String date;
        
        @NotBlank(message = "사용자 ID는 필수입니다")
        private String userId = "default-user";
        
        private String weatherDesc;
        private String weatherIcon;
        private Double weatherTemp;
        
        // getters and setters
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        
        public String getWeatherDesc() { return weatherDesc; }
        public void setWeatherDesc(String weatherDesc) { this.weatherDesc = weatherDesc; }
        public String getWeatherIcon() { return weatherIcon; }
        public void setWeatherIcon(String weatherIcon) { this.weatherIcon = weatherIcon; }
        public Double getWeatherTemp() { return weatherTemp; }
        public void setWeatherTemp(Double weatherTemp) { this.weatherTemp = weatherTemp; }
    }
}