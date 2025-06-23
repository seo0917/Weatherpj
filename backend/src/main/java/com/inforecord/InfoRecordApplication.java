package com.inforecord;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 정보기록 애플리케이션의 메인 클래스
 * 
 * 애플리케이션 기능:
 * - 일일 정보 기록 저장 및 조회
 * - 주간 기록 조회
 * - 감정 분석 (향후 구현 예정)
 * 
 * API 문서: http://localhost:8080/swagger-ui.html
 * H2 콘솔: http://localhost:8080/h2-console (개발 환경)
 */
@SpringBootApplication
public class InfoRecordApplication {
    
    /**
     * 애플리케이션 시작점
     * 
     * @param args 명령행 인자
     */
    public static void main(String[] args) {
        SpringApplication.run(InfoRecordApplication.class, args);
    }
} 