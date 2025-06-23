package com.inforecord.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.HashMap;

@Service
public class WeatherService {
    
    private static final Logger logger = LoggerFactory.getLogger(WeatherService.class);
    
    @Autowired
    private RestTemplate restTemplate;
    
    /**
     * 위도/경도로 주소 정보 가져오기
     */
    public String getLocationFromCoordinates(double latitude, double longitude) {
        try {
            String url = String.format(
                "https://nominatim.openstreetmap.org/reverse?format=json&lat=%f&lon=%f&zoom=10&accept-language=ko",
                latitude, longitude
            );
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            Map<String, Object> address = (Map<String, Object>) response.get("address");
            
            // 주소에서 시/도 정보 추출
            String city = (String) address.get("city");
            if (city == null) {
                city = (String) address.get("town");
            }
            if (city == null) {
                city = (String) address.get("village");
            }
            if (city == null) {
                city = (String) address.get("state");
            }
            if (city == null) {
                city = "안산시";
            }
            
            logger.info("위치 정보 조회 완료 - 위도: {}, 경도: {}, 도시: {}", latitude, longitude, city);
            return city;
            
        } catch (Exception e) {
            logger.error("위치 정보 조회 실패", e);
            return "서울시";
        }
    }
    
    /**
     * 도시명으로 날씨 정보 가져오기
     */
    public Map<String, Object> getWeatherByCity(String city) {
        try {
            String url = String.format("https://wttr.in/%s?format=j1", city);
            Map<String, Object> weatherData = restTemplate.getForObject(url, Map.class);
            
            logger.info("날씨 정보 조회 완료 - 도시: {}", city);
            return weatherData;
            
        } catch (Exception e) {
            logger.error("날씨 정보 조회 실패 - 도시: {}", city, e);
            return new HashMap<>();
        }
    }
    
    /**
     * 현재 위치와 날씨 정보를 함께 가져오기
     */
    public Map<String, Object> getCurrentLocationAndWeather(double latitude, double longitude) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 위치 정보 가져오기
            String city = getLocationFromCoordinates(latitude, longitude);
            result.put("city", city);
            
            // 날씨 정보 가져오기
            Map<String, Object> weatherData = getWeatherByCity(city);
            result.put("weather", weatherData);
            
            logger.info("위치 및 날씨 정보 조회 완료 - 도시: {}", city);
            
        } catch (Exception e) {
            logger.error("위치 및 날씨 정보 조회 실패", e);
            result.put("city", "서울시");
            result.put("weather", new HashMap<>());
        }
        
        return result;
    }
} 