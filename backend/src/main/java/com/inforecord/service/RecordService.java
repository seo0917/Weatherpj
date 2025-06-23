package com.inforecord.service;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.inforecord.Entity.Record;
import com.inforecord.dto.RecordDto;
import com.inforecord.repository.RecordRepository;
import com.inforecord.repository.EmotionRepository;

import lombok.RequiredArgsConstructor;

/**
 * 정보 기록 관련 비즈니스 로직을 처리하는 서비스
 * 기록의 생성, 조회, 수정 기능을 제공합니다.
 */
@Service
@RequiredArgsConstructor
public class RecordService {
    
    private static final Logger log = LoggerFactory.getLogger(RecordService.class);
    private final RecordRepository recordRepository;
    private final EmotionAnalysisService emotionAnalysisService;
    private final EmotionRepository emotionRepository;
    
    /**
     * 기록을 저장합니다. 같은 날짜에 기존 기록이 있으면 업데이트하고,
     * 없으면 새로운 기록을 생성합니다.
     * 
     * @param content 기록 내용
     * @param date 기록 날짜
     * @param userId 사용자 ID
     * @param weatherDesc 날씨 설명
     * @param weatherIcon 날씨 아이콘
     * @param weatherTemp 날씨 온도
     * @return 저장된 기록 DTO
     * @throws IllegalArgumentException 입력값이 유효하지 않은 경우
     */
    public RecordDto saveRecord(String content, LocalDate date, String userId, String weatherDesc, String weatherIcon, Double weatherTemp) {
        log.debug("기록 저장 시작 - 사용자: {}, 날짜: {}", userId, date);
        
        // 입력값 검증
        validateInput(content, date, userId);
        
        try {
            // 기존 기록 조회 (같은 날짜, 같은 사용자)
            Optional<Record> existingRecord = recordRepository.findByRecordDateAndUserId(date, userId);
            
            Record record;
            if (existingRecord.isPresent()) {
                // 기존 기록 업데이트
                record = existingRecord.get();
                String oldContent = record.getContent();
                record.setContent(content);
                record.setWeatherDesc(weatherDesc);
                record.setWeatherIcon(weatherIcon);
                record.setWeatherTemp(weatherTemp);
                log.info("기존 기록 업데이트 - ID: {}, 사용자: {}, 날짜: {}", 
                        record.getId(), userId, date);
                log.debug("내용 변경: [{}] -> [{}]", 
                         oldContent.length() > 50 ? oldContent.substring(0, 50) + "..." : oldContent,
                         content.length() > 50 ? content.substring(0, 50) + "..." : content);
            } else {
                // 새로운 기록 생성
                record = new Record(content, date, userId);
                record.setWeatherDesc(weatherDesc);
                record.setWeatherIcon(weatherIcon);
                record.setWeatherTemp(weatherTemp);
                log.info("새로운 기록 생성 - 사용자: {}, 날짜: {}", userId, date);
            }
            
            // 기록 저장
            record = recordRepository.save(record);
            log.debug("기록 저장 완료 - ID: {}", record.getId());
            
            // 감정분석 자동 실행
            try {
                emotionAnalysisService.analyzeAndSaveEmotions(record);
                log.debug("감정분석 완료 - 기록 ID: {}", record.getId());
            } catch (Exception e) {
                log.error("감정분석 실패 - 기록 ID: {}", record.getId(), e);
                // 감정분석 실패해도 기록 저장은 성공으로 처리
            }
            
            return convertToDto(record);
                
        } catch (Exception e) {
            log.error("기록 저장 중 오류 발생 - 사용자: {}, 날짜: {}", userId, date, e);
            throw new RuntimeException("기록 저장에 실패했습니다", e);
        }
    }
    
    /**
     * 특정 ID의 기록을 수정합니다.
     * 
     * @param recordId 수정할 기록의 ID
     * @param content 새로운 기록 내용
     * @param date 기록 날짜
     * @param userId 사용자 ID
     * @param weatherDesc 날씨 설명
     * @param weatherIcon 날씨 아이콘
     * @param weatherTemp 날씨 온도
     * @return 수정된 기록 DTO
     * @throws IllegalArgumentException 입력값이 유효하지 않은 경우
     * @throws RuntimeException 기록을 찾을 수 없는 경우
     */
    public RecordDto updateRecord(Long recordId, String content, LocalDate date, String userId, String weatherDesc, String weatherIcon, Double weatherTemp) {
        log.debug("기록 수정 시작 - ID: {}, 사용자: {}, 날짜: {}", recordId, userId, date);
        
        // 입력값 검증
        validateInput(content, date, userId);
        
        try {
            // 기존 기록 조회
            Optional<Record> existingRecord = recordRepository.findById(recordId);
            
            if (existingRecord.isEmpty()) {
                log.error("수정할 기록을 찾을 수 없음 - ID: {}", recordId);
                throw new RuntimeException("수정할 기록을 찾을 수 없습니다");
            }
            
            Record record = existingRecord.get();
            
            // 사용자 확인
            if (!record.getUserId().equals(userId)) {
                log.error("기록 수정 권한 없음 - ID: {}, 요청 사용자: {}, 기록 소유자: {}", 
                         recordId, userId, record.getUserId());
                throw new RuntimeException("해당 기록을 수정할 권한이 없습니다");
            }
            
            // 내용 업데이트
            String oldContent = record.getContent();
            record.setContent(content);
            record.setRecordDate(date);
            record.setWeatherDesc(weatherDesc);
            record.setWeatherIcon(weatherIcon);
            record.setWeatherTemp(weatherTemp);
            
            log.info("기록 수정 - ID: {}, 사용자: {}, 날짜: {}", recordId, userId, date);
            log.debug("내용 변경: [{}] -> [{}]", 
                     oldContent.length() > 50 ? oldContent.substring(0, 50) + "..." : oldContent,
                     content.length() > 50 ? content.substring(0, 50) + "..." : content);
            
            // 기록 저장
            record = recordRepository.save(record);
            log.debug("기록 수정 완료 - ID: {}", record.getId());
            
            // 이전 감정 데이터 삭제 후 새로운 감정분석 실행
            try {
                // 이전 감정 데이터 삭제
                emotionRepository.deleteByRecordId(record.getId());
                log.debug("이전 감정 데이터 삭제 완료 - 기록 ID: {}", record.getId());
                
                // 새로운 감정분석 실행
                emotionAnalysisService.analyzeAndSaveEmotions(record);
                log.debug("감정분석 완료 - 기록 ID: {}", record.getId());
            } catch (Exception e) {
                log.error("감정분석 실패 - 기록 ID: {}", record.getId(), e);
                // 감정분석 실패해도 기록 수정은 성공으로 처리
            }
            
            return convertToDto(record);
            
        } catch (Exception e) {
            log.error("기록 수정 중 오류 발생 - ID: {}, 사용자: {}, 날짜: {}", recordId, userId, date, e);
            throw new RuntimeException("기록 수정에 실패했습니다", e);
        }
    }
    
    /**
     * 특정 날짜의 기록을 조회합니다.
     * 
     * @param date 조회할 날짜
     * @param userId 사용자 ID
     * @return 기록 DTO (없으면 empty)
     */
    public Optional<RecordDto> getRecordByDate(LocalDate date, String userId) {
        return recordRepository.findByRecordDateAndUserId(date, userId)
            .map(this::convertToDto);
    }
    
    /**
     * 특정 ID의 기록을 조회합니다.
     * 
     * @param recordId 조회할 기록의 ID
     * @param userId 사용자 ID
     * @return 기록 DTO (없으면 empty)
     */
    public Optional<RecordDto> getRecordById(Long recordId, String userId) {
        return recordRepository.findById(recordId)
            .filter(record -> record.getUserId().equals(userId))
            .map(this::convertToDto);
    }
    
    /**
     * 특정 ID의 기록을 삭제합니다.
     * 
     * @param recordId 삭제할 기록의 ID
     * @param userId 사용자 ID
     * @return 삭제 성공 여부
     */
    public boolean deleteRecord(Long recordId, String userId) {
        log.debug("기록 삭제 시작 - ID: {}, 사용자: {}", recordId, userId);
        
        try {
            // 기존 기록 조회
            Optional<Record> existingRecord = recordRepository.findById(recordId);
            
            if (existingRecord.isEmpty()) {
                log.info("삭제할 기록을 찾을 수 없음 - ID: {}", recordId);
                return false;
            }
            
            Record record = existingRecord.get();
            
            // 사용자 확인
            if (!record.getUserId().equals(userId)) {
                log.error("기록 삭제 권한 없음 - ID: {}, 요청 사용자: {}, 기록 소유자: {}", 
                         recordId, userId, record.getUserId());
                return false;
            }
            
            // 기록 삭제 전에 감정 데이터도 함께 삭제
            try {
                emotionRepository.deleteByRecordId(recordId);
                log.debug("감정 데이터 삭제 완료 - 기록 ID: {}", recordId);
            } catch (Exception e) {
                log.error("감정 데이터 삭제 실패 - 기록 ID: {}", recordId, e);
                // 감정 데이터 삭제 실패해도 기록 삭제는 계속 진행
            }
            
            // 기록 삭제
            recordRepository.deleteById(recordId);
            log.info("기록 삭제 완료 - ID: {}, 사용자: {}", recordId, userId);
            return true;
            
        } catch (Exception e) {
            log.error("기록 삭제 중 오류 발생 - ID: {}, 사용자: {}", recordId, userId, e);
            return false;
        }
    }
    
    /**
     * 현재 주의 모든 기록을 조회합니다.
     * 한국 기준으로 월요일부터 일요일까지의 기록을 반환합니다.
     * 
     * @param userId 사용자 ID
     * @param startDate 시작 날짜 (선택사항)
     * @param endDate 종료 날짜 (선택사항)
     * @return 주간 기록 목록 (날짜 순 정렬)
     */
    public List<RecordDto> getWeeklyRecords(String userId, String startDate, String endDate) {
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : LocalDate.now().minusDays(7);
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : LocalDate.now();
        
        return recordRepository.findByUserIdAndDateRange(userId, start, end)
            .stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * 오늘 날짜의 기록을 조회합니다.
     * 
     * @param userId 사용자 ID
     * @return 오늘의 기록 목록
     */
    public List<RecordDto> getDailyRecords(String userId) {
        LocalDate today = LocalDate.now();
        
        return recordRepository.findByUserIdAndDateRange(userId, today, today)
            .stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * 모든 기록을 반환 (Our Record용)
     */
    public List<RecordDto> getAllRecords() {
        return recordRepository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * 현재 사용자를 제외한 모든 기록을 반환 (Our Record용)
     * 
     * @param currentUserId 제외할 현재 사용자 ID
     * @return 현재 사용자를 제외한 모든 기록 목록
     */
    public List<RecordDto> getAllRecordsExceptUser(String currentUserId) {
        return recordRepository.findAll().stream()
            .filter(record -> !record.getUserId().equals(currentUserId))
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }
    
    /**
     * Record 엔티티를 RecordDto로 변환합니다.
     * 
     * @param record 변환할 Record 엔티티
     * @return RecordDto
     */
    private RecordDto convertToDto(Record record) {
        RecordDto dto = new RecordDto();
        dto.setId(record.getId());
        dto.setContent(record.getContent());
        dto.setRecordDate(record.getRecordDate());
        dto.setUserId(record.getUserId());
        dto.setWeatherDesc(record.getWeatherDesc());
        dto.setWeatherIcon(record.getWeatherIcon());
        dto.setWeatherTemp(record.getWeatherTemp());
        return dto;
    }
    
    /**
     * 입력값의 유효성을 검증합니다.
     * 
     * @param content 기록 내용
     * @param date 기록 날짜
     * @param userId 사용자 ID
     * @throws IllegalArgumentException 입력값이 유효하지 않은 경우
     */
    private void validateInput(String content, LocalDate date, String userId) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("기록 내용은 필수입니다");
        }
        if (date == null) {
            throw new IllegalArgumentException("기록 날짜는 필수입니다");
        }
        if (userId == null || userId.trim().isEmpty()) {
            throw new IllegalArgumentException("사용자 ID는 필수입니다");
        }
    }
}