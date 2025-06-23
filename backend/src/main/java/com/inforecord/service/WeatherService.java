package com.inforecord.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class WeatherService {
    
    private final WebClient webClient;
    
    public WeatherService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.open-meteo.com/v1").build();
    }
    
    public Map<String, Object> getCurrentLocationAndWeather(double latitude, double longitude) {
        return this.webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/forecast")
                        .queryParam("latitude", latitude)
                        .queryParam("longitude", longitude)
                        .queryParam("current_weather", "true")
                        .queryParam("daily", "temperature_2m_max,temperature_2m_min")
                        .queryParam("hourly", "temperature_2m,relativehumidity_2m,apparent_temperature,precipitation")
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> processWeatherData(response, latitude, longitude))
                .block();
    }
    
    public Map<String, Object> getWeatherByCity(String city) {
        // 도시명을 좌표로 변환하는 로직 (간단한 예시)
        Map<String, Double> coordinates = getCityCoordinates(city);
        return getCurrentLocationAndWeather(coordinates.get("latitude"), coordinates.get("longitude"));
    }
    
    private Map<String, Object> processWeatherData(Map<String, Object> weatherApiResponse, double latitude, double longitude) {
        Map<String, Object> currentWeather = (Map<String, Object>) weatherApiResponse.get("current_weather");
        Map<String, Object> hourlyData = (Map<String, Object>) weatherApiResponse.get("hourly");
        Map<String, Object> dailyData = (Map<String, Object>) weatherApiResponse.get("daily");
        
        int nowIndex = 0; // 가장 최근 시간 데이터 사용

        // 현재 온도
        Object tempObj = currentWeather.get("temperature");
        double temperature;
        if (tempObj instanceof Integer) {
            temperature = ((Integer) tempObj).doubleValue();
        } else {
            temperature = (Double) tempObj;
        }

        // 날씨 코드
        Object codeObj = currentWeather.get("weathercode");
        int weatherCode;
        if (codeObj instanceof Integer) {
            weatherCode = (Integer) codeObj;
        } else {
            weatherCode = ((Double) codeObj).intValue();
        }

        // 실제 최저/최고 온도
        double maxTemperature = ((java.util.List<Number>)dailyData.get("temperature_2m_max")).get(0).doubleValue();
        double minTemperature = ((java.util.List<Number>)dailyData.get("temperature_2m_min")).get(0).doubleValue();

        // 습도, 체감온도, 강수량
        double humidity = ((java.util.List<Number>)hourlyData.get("relativehumidity_2m")).get(nowIndex).doubleValue();
        double feelsLike = ((java.util.List<Double>)hourlyData.get("apparent_temperature")).get(nowIndex);
        double precipitation = ((java.util.List<Double>)hourlyData.get("precipitation")).get(nowIndex);

        // 체감온도 보정 (Open-Meteo API의 apparent_temperature가 부정확할 수 있음)
        // 습도가 높으면 체감온도가 높아지고, 습도가 낮으면 체감온도가 낮아지는 경향
        if (humidity > 70) {
            // 습도가 높을 때는 체감온도를 현재 온도보다 약간 높게 조정
            feelsLike = Math.max(feelsLike, temperature + 1);
        } else if (humidity < 40) {
            // 습도가 낮을 때는 체감온도를 현재 온도보다 약간 낮게 조정
            feelsLike = Math.min(feelsLike, temperature - 1);
        } else {
            // 보통 습도일 때는 현재 온도와 비슷하게
            feelsLike = temperature;
        }

        String weatherCondition = getWeatherCondition(weatherCode);
        String positiveMessage = getPositiveMessage(weatherCode);

        Map<String, Object> weatherData = new HashMap<>();
        weatherData.put("temperature", temperature);
        weatherData.put("minTemperature", minTemperature);
        weatherData.put("maxTemperature", maxTemperature);
        weatherData.put("weatherCondition", weatherCondition);
        weatherData.put("location", getLocationName(latitude, longitude));

        Map<String, Object> details = new HashMap<>();
        details.put("precipitation", precipitation);
        details.put("feelsLike", feelsLike);
        details.put("humidity", (int)humidity);
        details.put("precipitationLevel", precipitation > 0 ? "있음" : "없음");
        details.put("humidityLevel", humidity > 70 ? "높음" : "보통");
        details.put("comfortLevel", feelsLike > 25 ? "더움" : "쾌적");

        weatherData.put("details", details);

        Map<String, Object> message = new HashMap<>();
        message.put("mainText", positiveMessage);
        message.put("subText", "오늘도 좋은 하루 보내세요!");
        weatherData.put("message", message);

        return weatherData;
    }
    
    private Map<String, Double> getCityCoordinates(String city) {
        Map<String, Double> coordinates = new HashMap<>();
        switch (city.toLowerCase()) {
            case "서울":
                coordinates.put("latitude", 37.5665);
                coordinates.put("longitude", 126.9780);
                break;
            case "부산":
                coordinates.put("latitude", 35.1796);
                coordinates.put("longitude", 129.0756);
                break;
            case "대구":
                coordinates.put("latitude", 35.8714);
                coordinates.put("longitude", 128.6014);
                break;
            case "인천":
                coordinates.put("latitude", 37.4563);
                coordinates.put("longitude", 126.7052);
                break;
            case "광주":
                coordinates.put("latitude", 35.1595);
                coordinates.put("longitude", 126.8526);
                break;
            case "대전":
                coordinates.put("latitude", 36.3504);
                coordinates.put("longitude", 127.3845);
                break;
            case "울산":
                coordinates.put("latitude", 35.5384);
                coordinates.put("longitude", 129.3114);
                break;
            default:
                // 기본값: 서울
                coordinates.put("latitude", 37.5665);
                coordinates.put("longitude", 126.9780);
                break;
        }
        return coordinates;
    }
    
    private String getLocationName(double latitude, double longitude) {
        // 간단한 위치 매핑
        if (Math.abs(latitude - 37.5665) < 0.1 && Math.abs(longitude - 126.9780) < 0.1) {
            return "서울";
        } else if (Math.abs(latitude - 35.1796) < 0.1 && Math.abs(longitude - 129.0756) < 0.1) {
            return "부산";
        } else if (Math.abs(latitude - 35.8714) < 0.1 && Math.abs(longitude - 128.6014) < 0.1) {
            return "대구";
        } else {
            return "현재 위치";
        }
    }
    
    private String getWeatherCondition(int weatherCode) {
        switch (weatherCode) {
            case 0: return "맑음";
            case 1: case 2: case 3: return "부분적으로 흐림";
            case 45: case 48: return "안개";
            case 51: case 53: case 55: return "이슬비";
            case 56: case 57: return "서리 내리는 이슬비";
            case 61: case 63: case 65: return "비";
            case 66: case 67: return "서리 내리는 비";
            case 71: case 73: case 75: return "눈";
            case 77: return "진눈깨비";
            case 80: case 81: case 82: return "소나기";
            case 85: case 86: return "강한 눈";
            case 95: return "천둥번개";
            case 96: case 99: return "천둥번개와 우박";
            default: return "알 수 없음";
        }
    }
    
    private String getPositiveMessage(int weatherCode) {
        if (weatherCode == 0) return "오늘은 맑은 날이에요! 기분 좋은 하루 보내세요.";
        if (weatherCode >= 1 && weatherCode <= 3) return "구름이 조금 있지만, 산책하기 좋은 날씨네요.";
        if (weatherCode >= 45 && weatherCode <= 48) return "안개가 낀 하루, 차분하게 보내기 좋아요.";
        if (weatherCode >= 51 && weatherCode <= 57) return "이슬비가 내려요. 촉촉한 하루 보내세요.";
        if (weatherCode >= 61 && weatherCode <= 67) return "비가 오네요! 비 오는 날엔 느긋하게 쉬어도 괜찮아요.";
        if (weatherCode >= 71 && weatherCode <= 77) return "눈이 내려요! 포근한 하루 보내세요.";
        if (weatherCode >= 80 && weatherCode <= 82) return "소나기가 내릴 수 있어요. 우산 챙기면 든든해요!";
        if (weatherCode >= 95 && weatherCode <= 99) return "뇌우가 예상돼요. 실내에서 안전하게 보내세요.";
        return "오늘도 긍정적인 하루 보내세요!";
    }
} 