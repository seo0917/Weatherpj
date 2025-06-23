import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import paintIcon from '../assets/paint.svg';
import musicIcon from '../assets/music.svg';
import pictureIcon from '../assets/picture.svg';
import bgImg from '../assets/background.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { recordAPI, weatherAPI } from '../services/api';

const HomeContainer = styled.div`
  width: 440px;
  height: 956px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${bgImg});
  background-size: cover;
  background-position: center;
`;

const Overlay = styled.div`
  width: 440px;
  height: 956px;
  z-index: 200;
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.11);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CenterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;

const StyledTextarea = styled.textarea`
  background: none;
  border: none;
  color: #fff;
  font-size: 22px;
  text-align: center;
  outline: none;
  width: 90vw;
  max-width: 340px;
  margin: 0 auto 32px auto;
  padding: 16px 0;
  font-family: Pretendard;
  resize: none;
  line-height: 1.5;
  &::placeholder {
    color:rgb(244, 244, 244);
    opacity: 0.85;
    font-size: 22px;
    text-align: center;
    white-space: pre-line;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-top: 32px;
`;

const IconButton = styled.button`
  background: rgba(255,255,255,0.18);
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.36);
  }
`;

// 저장/뒤로가기 버튼 추가
const ActionButtonRow = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 16px;
`;

const ActionButton = styled.button`
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 25px;
  padding: 12px 24px;
  color: #fff;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255,255,255,0.5);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// 백엔드 필드 입력용 임시 컴포넌트들
const BackendInputContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 10px;
  font-size: 12px;
  font-family: Pretendard;
  z-index: 300;
  max-width: 200px;
`;

const BackendInput = styled.input`
  width: 100%;
  padding: 5px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 12px;
`;

const SaveStatusContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 10px;
  font-size: 12px;
  font-family: Pretendard;
  z-index: 300;
  max-width: 200px;
`;

export default function Write() {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [text, setText] = useState('');
  
  // 수정 모드 관련 상태
  const isEdit = location.state?.isEdit || false;
  const recordId = location.state?.recordId;
  
  // 백엔드 저장용 상태 (백그라운드에서만 사용)
  const [userId, setUserId] = useState('default-user');
  const [recordDate, setRecordDate] = useState(() => {
    if (location.state?.selectedDate) {
      return new Date(location.state.selectedDate).toISOString().split('T')[0];
    }
    // 한국 시간대 사용 - 정확한 방법
    const now = new Date();
    const koreaTimeOffset = 9 * 60; // 한국은 UTC+9
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const koreaTime = new Date(utc + (koreaTimeOffset * 60000));
    return koreaTime.toISOString().split('T')[0];
  });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  
  // 날씨 정보 상태 추가
  const [currentWeather, setCurrentWeather] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // 날씨 상태에 따른 아이콘 반환 함수
  const getWeatherIcon = (weatherDesc) => {
    if (!weatherDesc) return '🌤️';
    
    const desc = weatherDesc.toLowerCase();
    if (desc.includes('맑음') || desc.includes('clear')) return '☀️';
    if (desc.includes('흐림') || desc.includes('cloudy')) return '☁️';
    if (desc.includes('비') || desc.includes('rain')) return '🌧️';
    if (desc.includes('눈') || desc.includes('snow')) return '❄️';
    if (desc.includes('안개') || desc.includes('fog')) return '🌫️';
    return '🌤️';
  };

  // 현재 위치와 날씨 정보 가져오기
  const getCurrentLocationAndWeather = async () => {
    setLocationLoading(true);
    try {
      // 브라우저의 Geolocation API 사용
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log('현재 위치:', latitude, longitude);
            
            // 백엔드 API로 위치 및 날씨 정보 가져오기
            try {
              const result = await weatherAPI.getCurrentWeather(latitude, longitude);
              console.log('날씨 API 응답:', result);
              if (result && result.weather) {
                setCurrentWeather(result.weather);
                console.log('설정된 날씨 정보:', result.weather);
              } else {
                console.warn('날씨 정보가 없습니다:', result);
                setDefaultWeather();
              }
            } catch (apiError) {
              console.error('백엔드 API 호출 실패:', apiError);
              setDefaultWeather();
            }
          },
          (error) => {
            console.error('위치 정보 가져오기 실패:', error);
            setDefaultWeather();
          }
        );
      } else {
        console.warn('Geolocation이 지원되지 않습니다.');
        setDefaultWeather();
      }
    } catch (error) {
      console.error('날씨 정보 가져오기 오류:', error);
      setDefaultWeather();
    } finally {
      setLocationLoading(false);
    }
  };

  // 기본 날씨 정보 설정
  const setDefaultWeather = () => {
    const defaultWeather = {
      current_condition: [{
        weatherDesc: [{ value: '맑음' }],
        weatherIconUrl: [{ value: '☀️' }],
        temp_C: '20'
      }]
    };
    setCurrentWeather(defaultWeather);
    console.log('기본 날씨 정보 설정:', defaultWeather);
  };

  // 컴포넌트 마운트 시 날씨 정보 가져오기
  useEffect(() => {
    getCurrentLocationAndWeather();
  }, []);
  
  const loadExistingRecord = useCallback(async () => {
    try {
      if (isEdit && recordId) {
        // 수정 모드: recordId로 기존 기록 불러오기
        const record = await recordAPI.getRecordById(recordId);
        if (record) {
          setText(record.content || '');
        }
      } else {
        // 일반 모드: 날짜로 기록 불러오기
        const record = await recordAPI.getRecordByDate(recordDate, userId);
        if (record) {
          setText(record.content || '');
        }
      }
    } catch (error) {
      console.error('기존 기록 로드 실패:', error);
    }
  }, [isEdit, recordId, recordDate, userId]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    
    // 수정 모드인 경우 기존 기록 불러오기
    if (isEdit && recordId) {
      loadExistingRecord();
    }
  }, [isEdit, recordId, loadExistingRecord]);

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await handleSave();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSave = async () => {
    // 텍스트가 있을 때만 저장
    if (text.trim()) {
      await saveToBackend();
      // localStorage에도 저장 (기존 기능 유지)
      localStorage.setItem('userWeatherText', text.trim());
      localStorage.setItem('hasUserText', 'true');
    }
    // 저장된 날짜를 My 페이지로 전달
    navigate('/my', { state: { selectedDate: recordDate } });
  };

  const handleBack = () => {
    // 저장된 날짜를 My 페이지로 전달
    navigate('/my', { state: { selectedDate: recordDate } });
  };

  const saveToBackend = async () => {
    if (!text.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      console.log('백엔드 저장 시작');
      console.log('현재 날씨 정보:', currentWeather);

      // 날씨 정보 추출 및 한국어 변환
      const rawWeatherDesc = currentWeather?.current_condition?.[0]?.weatherDesc?.[0]?.value || 'Clear';
      const weatherIcon = currentWeather?.current_condition?.[0]?.weatherIconUrl?.[0]?.value || '☀️';
      const weatherTemp = currentWeather?.current_condition?.[0]?.temp_C ? Number(currentWeather.current_condition[0].temp_C) : 20;

      // 영어 날씨를 한국어로 변환
      const translateWeather = (weatherDesc) => {
        if (!weatherDesc) return '맑음';
        const desc = weatherDesc.toLowerCase();
        if (desc.includes('clear')) return '맑음';
        if (desc.includes('cloudy')) return '흐림';
        if (desc.includes('rain') || desc.includes('rainy')) return '비';
        if (desc.includes('snow') || desc.includes('snowy')) return '눈';
        if (desc.includes('fog') || desc.includes('foggy')) return '안개';
        if (desc.includes('overcast')) return '흐림';
        if (desc.includes('partly cloudy')) return '구름 조금';
        return '맑음'; // 기본값
      };

      const weatherDesc = translateWeather(rawWeatherDesc);

      console.log('추출된 날씨 정보:', { rawWeatherDesc, weatherDesc, weatherIcon, weatherTemp });
      console.log('저장할 날짜:', recordDate);

      const result = await recordAPI.saveRecord(text.trim(), recordDate, userId, weatherDesc, weatherIcon, weatherTemp);
      console.log('백엔드 저장 완료:', result);

      // 성공 시 홈으로 이동
      navigate('/my');
    } catch (error) {
      console.error('백엔드 저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <HomeContainer>
      <Overlay>
        <CenterBox>
          <StyledTextarea
            ref={inputRef}
            autoFocus
            rows={2}
            placeholder={"오늘 하루, 날씨 이야기를\n기록해주세요."}
            onKeyDown={handleKeyDown}
            value={text}
            onChange={handleTextChange}
          />
          <ButtonRow>
            <IconButton><img src={paintIcon} alt="그림" /></IconButton>
            <IconButton><img src={musicIcon} alt="음악" /></IconButton>
            <IconButton><img src={pictureIcon} alt="사진" /></IconButton>
          </ButtonRow>
          
          {/* 저장/뒤로가기 버튼 추가 */}
          <ActionButtonRow>
            <ActionButton onClick={handleBack}>
              뒤로가기
            </ActionButton>
            <ActionButton 
              onClick={handleSave}
              disabled={!text.trim() || saving}
            >
              {saving ? '저장 중...' : '저장하기'}
            </ActionButton>
          </ActionButtonRow>
        </CenterBox>
      </Overlay>
    </HomeContainer>
  );
}
