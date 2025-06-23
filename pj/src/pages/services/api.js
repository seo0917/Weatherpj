import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초 타임아웃
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data);
    return config;
  },
  (error) => {
    console.error('API 요청 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => {
    console.log(`API 응답: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API 응답 에러:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 장소 관련 API
export const placeAPI = {
  // 장소 등록 (이미지 포함)
  uploadPlace: async (formData) => {
    try {
      const response = await api.post('/places', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('장소 등록 실패:', error);
      throw error;
    }
  },

  // 장소 리스트 조회
  getAllPlaces: async () => {
    try {
      const response = await api.get('/places');
      return response.data;
    } catch (error) {
      console.error('장소 리스트 조회 실패:', error);
      throw error;
    }
  },

  // 장소 상세 조회
  getPlaceById: async (id) => {
    try {
      const response = await api.get(`/places/${id}`);
      return response.data;
    } catch (error) {
      console.error('장소 상세 조회 실패:', error);
      throw error;
    }
  },

  // 장소 삭제
  deletePlace: async (id) => {
    try {
      const response = await api.delete(`/places/${id}`);
      return response.data;
    } catch (error) {
      console.error('장소 삭제 실패:', error);
      throw error;
    }
  }
};

// 기록 관련 API
export const recordAPI = {
  // 기록 저장
  saveRecord: async (content, date, userId = 'default-user', weatherDesc, weatherIcon, weatherTemp) => {
    try {
      const response = await api.post('/records', {
        content,
        date,
        userId,
        weatherDesc,
        weatherIcon,
        weatherTemp
      });
      return response.data;
    } catch (error) {
      console.error('기록 저장 실패:', error);
      throw error;
    }
  },

  // 기록 수정
  updateRecord: async (recordId, content, date, userId = 'default-user', weatherDesc, weatherIcon, weatherTemp) => {
    try {
      const response = await api.put(`/records/${recordId}`, {
        content,
        date,
        userId,
        weatherDesc,
        weatherIcon,
        weatherTemp
      });
      return response.data;
    } catch (error) {
      console.error('기록 수정 실패:', error);
      throw error;
    }
  },

  // 특정 날짜 기록 조회
  getRecordByDate: async (date, userId = 'default-user') => {
    try {
      const response = await api.get(`/records/${date}`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('기록 조회 실패:', error);
      throw error;
    }
  },

  // ID로 기록 조회
  getRecordById: async (recordId, userId = 'default-user') => {
    try {
      const response = await api.get(`/records/id/${recordId}`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('기록 조회 실패:', error);
      throw error;
    }
  },

  // ID로 기록 삭제
  deleteRecord: async (recordId, userId = 'default-user') => {
    try {
      const response = await api.delete(`/records/${recordId}`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('기록 삭제 실패:', error);
      throw error;
    }
  },

  // 일간 기록 조회
  getDailyRecords: async (date, userId = 'default-user') => {
    try {
      const response = await api.get('/records/daily', {
        params: { date, userId }
      });
      return response.data;
    } catch (error) {
      console.error('일간 기록 조회 실패:', error);
      throw error;
    }
  },

  // 주간 기록 조회
  getWeeklyRecords: async (startDate, endDate, userId = 'default-user') => {
    try {
      const response = await api.get('/records/weekly', {
        params: { startDate, endDate, userId }
      });
      return response.data;
    } catch (error) {
      console.error('주간 기록 조회 실패:', error);
      throw error;
    }
  },

  // 공동 기록 조회
  getOurRecords: async (startDate, endDate) => {
    try {
      const response = await api.get('/records/our', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('공동 기록 조회 실패:', error);
      throw error;
    }
  },

  // 다른 사용자 기록 조회 (현재 사용자 제외)
  getOtherUsersRecords: async (currentUserId = 'default-user') => {
    try {
      const response = await api.get('/records/our/others', {
        params: { currentUserId }
      });
      return response.data;
    } catch (error) {
      console.error('다른 사용자 기록 조회 실패:', error);
      throw error;
    }
  }
};

// 감정 분석 관련 API
export const emotionAPI = {
  // 일간 감정 분석 조회
  getDailyEmotions: async (date, userId = 'default-user') => {
    try {
      const response = await api.get('/emotions/daily', {
        params: { date, userId }
      });
      return response.data;
    } catch (error) {
      console.error('일간 감정 분석 조회 실패:', error);
      throw error;
    }
  },

  // 주간 감정 분석 조회
  getWeeklyEmotions: async (startDate, endDate, userId = 'default-user') => {
    try {
      const response = await api.get('/emotions/weekly', {
        params: { startDate, endDate, userId }
      });
      return response.data;
    } catch (error) {
      console.error('감정 분석 조회 실패:', error);
      throw error;
    }
  },

  // 주간 감정분석 수행
  analyzeWeeklyEmotions: async (startDate, endDate, userId = 'default-user') => {
    try {
      const response = await api.post('/emotions/analyze-weekly', null, {
        params: { startDate, endDate, userId }
      });
      return response.data;
    } catch (error) {
      console.error('주간 감정분석 실패:', error);
      throw error;
    }
  },

  // 감정 분석 데이터 저장
  saveEmotion: async (emotionData, userId = 'default-user') => {
    try {
      const response = await api.post('/emotions', {
        ...emotionData,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('감정 분석 저장 실패:', error);
      throw error;
    }
  },

  // 주간 감정 분석 데이터 초기화
  clearWeeklyEmotions: async (userId = 'default-user', startDate, endDate) => {
    try {
      const params = { userId };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.delete('/emotions/weekly', { params });
      return response.data;
    } catch (error) {
      console.error('주간 감정 분석 초기화 실패:', error);
      throw error;
    }
  },

  // 감정 분석 데이터 저장 (기존 데이터 초기화 후)
  saveEmotionWithClear: async (emotionData, userId = 'default-user') => {
    try {
      // 먼저 주간 데이터 초기화
      await emotionAPI.clearWeeklyEmotions(userId);
      
      // 새 데이터 저장
      const response = await api.post('/emotions', {
        ...emotionData,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('감정 분석 저장 실패:', error);
      throw error;
    }
  },

  // 감정 분석 데이터 업데이트
  updateEmotion: async (emotionId, emotionData, userId = 'default-user') => {
    try {
      const response = await api.put(`/emotions/${emotionId}`, {
        ...emotionData,
        userId
      });
      return response.data;
    } catch (error) {
      console.error('감정 분석 업데이트 실패:', error);
      throw error;
    }
  },

  // 감정 분석 데이터 삭제
  deleteEmotion: async (emotionId, userId = 'default-user') => {
    try {
      const response = await api.delete(`/emotions/${emotionId}`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('감정 분석 삭제 실패:', error);
      throw error;
    }
  }
};

// AI 분석 관련 API
export const aiAnalysisAPI = {
  // 주간 AI 분석 조회
  getWeeklyAnalysis: async (startDate, endDate, userId = 'default-user') => {
    try {
      const response = await api.get('/ai-analysis/weekly', {
        params: { startDate, endDate, userId }
      });
      return response.data;
    } catch (error) {
      console.error('주간 AI 분석 조회 실패:', error);
      throw error;
    }
  }
};

// 날씨 관련 API
export const weatherAPI = {
  // 현재 위치 기반 날씨 조회 (백엔드 API 사용)
  getCurrentWeather: async (lat, lon) => {
    try {
      const response = await api.get('/weather/current', {
        params: { latitude: lat, longitude: lon }
      });
      return response.data;
    } catch (error) {
      console.error('날씨 조회 실패:', error);
      throw error;
    }
  },

  // 도시명으로 날씨 조회 (백엔드 API 사용)
  getWeatherByCity: async (city) => {
    try {
      const response = await api.get(`/weather/city/${encodeURIComponent(city)}`);
      return response.data;
    } catch (error) {
      console.error('도시별 날씨 조회 실패:', error);
      throw error;
    }
  }
};

export default api; 