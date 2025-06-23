package com.inforecord.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.inforecord.model.UserPreferences;
import com.inforecord.service.WeatherService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "false")
public class WeatherController {

    private static final Logger logger = LoggerFactory.getLogger(WeatherController.class);
    
    // 임시로 메모리에 사용자 선호도 저장 (실제로는 데이터베이스 사용)
    private static UserPreferences currentUserPreferences = new UserPreferences();

    @Autowired
    private WeatherService weatherService;
    
    /**
     * 현재 위치와 날씨 정보 조회
     */
    @GetMapping("/weather/current")
    public ResponseEntity<Map<String, Object>> getCurrentLocationAndWeather(
            @RequestParam(defaultValue = "37.5665") double latitude,
            @RequestParam(defaultValue = "126.9780") double longitude) {
        
        logger.info("현재 위치 및 날씨 조회 요청 - 위도: {}, 경도: {}", latitude, longitude);
        
        try {
            Map<String, Object> result = weatherService.getCurrentLocationAndWeather(latitude, longitude);
            logger.info("현재 위치 및 날씨 조회 완료");
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            logger.error("현재 위치 및 날씨 조회 실패", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 도시명으로 날씨 정보 조회
     */
    @GetMapping("/weather/city/{city}")
    public ResponseEntity<Map<String, Object>> getWeatherByCity(@PathVariable String city) {
        
        logger.info("도시별 날씨 조회 요청 - 도시: {}", city);
        
        try {
            Map<String, Object> weatherData = weatherService.getWeatherByCity(city);
            logger.info("도시별 날씨 조회 완료 - 도시: {}", city);
            return ResponseEntity.ok(weatherData);
            
        } catch (Exception e) {
            logger.error("도시별 날씨 조회 실패 - 도시: {}", city, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/user/preferences")
    public ResponseEntity<Map<String, Object>> saveUserPreferences(@RequestBody UserPreferences preferences) {
        // 사용자 선호도 저장
        currentUserPreferences = preferences;
        logger.info("사용자 선호도 저장: {}", preferences);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "사용자 선호도가 성공적으로 저장되었습니다.");
        response.put("data", preferences);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user/preferences")
    public ResponseEntity<UserPreferences> getUserPreferences() {
        return ResponseEntity.ok(currentUserPreferences);
    }
} 