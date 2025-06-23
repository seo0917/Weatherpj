package com.inforecord.controller;

import com.inforecord.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "false")
public class WeatherController {
    
    private static final Logger logger = LoggerFactory.getLogger(WeatherController.class);
    
    @Autowired
    private WeatherService weatherService;
    
    /**
     * 현재 위치와 날씨 정보 조회
     */
    @GetMapping("/current")
    public ResponseEntity<Map<String, Object>> getCurrentLocationAndWeather(
            @RequestParam double latitude,
            @RequestParam double longitude) {
        
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
    @GetMapping("/city/{city}")
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
} 