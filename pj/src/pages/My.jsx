import styled from 'styled-components';
import bgImg from '../assets/background.png';
import Navbar from '../components/Navbar';
import calendar from '../assets/calendar.svg';
import locationIcon from '../assets/locationIcon.svg';
import plus from '../assets/plus.svg';
import writeIcon from '../assets/writeicon.svg';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recordAPI, weatherAPI } from '../services/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const HomeContainer = styled.div`
  width: 440px;
  height: 956px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
`;

const CardContainer = styled.div`
  position: relative;
  width: 440px;
  height: 956px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  background: #fff;
  display: flex;
  flex-direction: column;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 40px 32px 22px 22px;
  box-sizing: border-box;
`;

const InfoRow = styled.div`
  
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
`;

const InfoBox = styled.div`
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 6px 16px;
  color: #222;
  font-size: 14px;
  font-family: Pretendard;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TopText = styled.div`
  color: #222;
  font-family: Pretendard;
  font-size: 28px;
  font-style: normal;
  font-weight: 600;
  letter-spacing: -0.84px;
  line-height: 140%;
  text-align: left;
  margin-top: 110px;
  margin-bottom: 15px;
  width: 100%;
  position: relative;
`;

const DropdownButton = styled.button`
  position: absolute;
  top: 10px;
  right: 0;
  width: 116px;
  height: 44.903px;
  flex-shrink: 0;
  border-radius: 24.946px;
  background: color(display-p3 0.3725 0.5725 0.8863);
  color: color(display-p3 0.9553 0.9553 0.9553);
  leading-trim: both;
  text-edge: cap;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%;
  letter-spacing: -0.6px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 52px;
  right: 0;
  width: 116px;
  background: rgba(255,255,255,0.5);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  z-index: 3;
`;

const DropdownItem = styled.button`
  padding: 12px 0;
  background: none;
  border: none;
  color: #FFF;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%;
  letter-spacing: -0.6px;
  cursor: pointer;
  border-radius: 20px;
  transition: background 0.15s;
  &:hover {
    background: #f0f4fa;
  }
`;

const MessageRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 105%;
  margin-bottom: 10%;
`;

const ButtonIcon = styled.img`
  width: 60px;
  height: 60px;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const AddButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: absolute;
  bottom: 100px;
  right: 20px;
`;

const EditButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: absolute;
  bottom: 100px;
  right: 20px;
`;

const Message = styled.div`
  color: #234E83;
  font-family: Pretendard;
  font-size: 36px;
  font-weight: 250;
  line-height: 140%;
  letter-spacing: -1.08px;
  margin: 400px 0 24px 0;
  text-align: left;
  width: 100%;
`;

const WeeklyReportButton = styled.button`
  position: absolute;
  top: 10px;
  right: 0;
  width: 116px;
  height: 44.903px;
  flex-shrink: 0;
  border-radius: 24.946px;
  background: color(display-p3 0.3725 0.5725 0.8863);
  color: color(display-p3 0.9553 0.9553 0.9553);
  leading-trim: both;
  text-edge: cap;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%;
  letter-spacing: -0.6px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const CalendarWrapper = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  z-index: 100;

  .react-calendar {
    width: 220px;
    border: none;
    border-radius: 12px;
    background: white;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    font-family: 'Pretendard', sans-serif;
    padding: 8px;
  }

  .react-calendar__navigation {
    margin-bottom: 0.5em;
    display: flex;
    align-items: center;
    height: 30px;
  }

  .react-calendar__navigation button {
    min-width: 30px;
    font-size: 14px;
    font-weight: 600;
    color: #234E83;
  }
  
  .react-calendar__navigation button:hover,
  .react-calendar__navigation button:focus {
    background-color: #f0f4fa;
    border-radius: 6px;
  }

  .react-calendar__month-view__weekdays {
    text-align: center;
    font-weight: 500;
    color: #999;
  }
  
  .react-calendar__month-view__weekdays__weekday {
    font-size: 11px;
    padding: 0.4em;
  }
  
  .react-calendar__tile {
    font-size: 12px;
    padding: 0.3em 0.4em;
    border-radius: 6px;
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #f0f4fa;
  }

  .react-calendar__tile--now {
    background: #e6f0ff;
    font-weight: bold;
    color: #234E83;
  }

  .react-calendar__tile--active {
    background: #234E83;
    color: white;
  }
  
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #1b3d6a;
  }
`;

const RecordCardContainer = styled.div`
  background: rgba(39, 97, 172, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  max-width: 300px;
  min-width: 120px;
  width: fit-content;
  min-height: 120px;
  position: absolute;
  right: 20px;
  top: 35%;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RecordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
  color: #fff;
  text-align: right;
`;

const RecordContent = styled.div`
  color: #fff;
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 20px;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  word-break: break-word;
  max-height: 96px;
`;

const MusicPlayer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 12px;
  justify-content: flex-end;
`;

const PlayButton = styled.div`
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  margin-right: 10px;
  position: relative;
  flex-shrink: 0;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 55%;
    transform: translate(-50%, -50%);
    border-left: 6px solid #000;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
  }
`;

const MusicInfo = styled.div`
  text-align: right;
  overflow: hidden;
  flex: 1;
`;

const MusicTitle = styled.div`
  font-weight: bold;
  color: #fff;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MusicArtist = styled.div`
  color: #ccc;
  font-size: 10px;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RecordCard = ({ record }) => {
  // 안전한 날짜 포맷팅 함수
  const formatRecordDate = (dateString) => {
    try {
      if (!dateString) return '';
      // 날짜가 배열인 경우 처리
      if (Array.isArray(dateString)) {
        const [year, month, day] = dateString;
        return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  // 날씨 정보 표시 함수
  const getWeatherDisplay = () => {
    console.log('RecordCard 날씨 정보:', record);
    
    // 영어 날씨를 한국어로 변환하는 함수
    const translateWeather = (weatherDesc) => {
      if (!weatherDesc) return '맑음';
      
      const desc = weatherDesc.toLowerCase();
      if (desc.includes('clear') || desc.includes('맑음')) return '맑음';
      if (desc.includes('cloudy') || desc.includes('흐림')) return '흐림';
      if (desc.includes('rain') || desc.includes('비')) return '비';
      if (desc.includes('snow') || desc.includes('눈')) return '눈';
      if (desc.includes('fog') || desc.includes('안개')) return '안개';
      return weatherDesc; // 변환할 수 없으면 원본 반환
    };
    
    // 날씨 아이콘 매핑
    const getWeatherIcon = (weatherDesc) => {
      if (!weatherDesc) return '🌤️';
      
      const desc = weatherDesc.toLowerCase();
      if (desc.includes('clear') || desc.includes('맑음')) return '☀️';
      if (desc.includes('cloudy') || desc.includes('흐림')) return '☁️';
      if (desc.includes('rain') || desc.includes('비')) return '🌧️';
      if (desc.includes('snow') || desc.includes('눈')) return '❄️';
      if (desc.includes('fog') || desc.includes('안개')) return '🌫️';
      return '🌤️';
    };
    
    if (record.weatherDesc) {
      const koreanWeather = translateWeather(record.weatherDesc);
      const weatherIcon = getWeatherIcon(record.weatherDesc);
      return `${weatherIcon} ${koreanWeather}`;
    } else {
      // 날씨 정보가 없으면 기본값 표시
      return '🌤️ 맑음';
    }
  };

  return (
    <RecordCardContainer>
      <RecordHeader>
        <span>{formatRecordDate(record.recordDate)}</span>
        <span>{getWeatherDisplay()}</span>
      </RecordHeader>
      
      <RecordContent>
        {record.content}
      </RecordContent>
      
      {record.musicTitle && (
        <MusicPlayer>
          <PlayButton>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '55%',
              transform: 'translate(-50%, -50%)',
              borderLeft: '6px solid #000',
              borderTop: '4px solid transparent',
              borderBottom: '4px solid transparent'
            }}></div>
          </PlayButton>
          <MusicInfo>
            <MusicTitle>{record.musicTitle}</MusicTitle>
            <MusicArtist>{record.artist}</MusicArtist>
          </MusicInfo>
        </MusicPlayer>
      )}
    </RecordCardContainer>
  );
};

export default function My() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('DAY');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('default-user');
  const [currentLocation, setCurrentLocation] = useState('안산시');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  
  // localStorage에서 저장된 날짜 가져오기, 없으면 오늘 날짜
  const getInitialDate = () => {
    const savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
      const date = new Date(savedDate);
      if (!isNaN(date.getTime())) {
        // 한국 시간대로 변환
        return new Date(date.getTime() + (9 * 60 * 60 * 1000));
      }
    }
    // 오늘 날짜를 한국 시간대로 반환
    const now = new Date();
    return new Date(now.getTime() + (9 * 60 * 60 * 1000));
  };
  
  const [selectedDate, setSelectedDate] = useState(getInitialDate);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 해당 날짜의 기록 불러오기
    loadRecordForDate(selectedDate);
    // 현재 위치와 날씨 정보 가져오기
    getCurrentLocationAndWeather();
  }, [selectedDate, userId]);

  // Write 페이지에서 돌아올 때 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      loadRecordForDate(selectedDate);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [selectedDate]);

  const loadRecordForDate = async (date) => {
    setLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      console.log('기록 조회 시도:', dateStr, userId);
      const data = await recordAPI.getRecordByDate(dateStr, userId);
      console.log('기록 조회 결과:', data);
      
      // 데이터가 있으면 selectedRecord 설정, 없으면 null
      if (data && data.id) {
        console.log('기록 발견:', data);
        setSelectedRecord(data);
      } else {
        console.log('기록 없음');
        setSelectedRecord(null);
      }
    } catch (error) {
      console.error('기록 로드 실패:', error);
      setSelectedRecord(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownClick = () => setDropdownOpen(v => !v);
  
  const handleSelect = (type) => {
    setSelectedType(type);
    setDropdownOpen(false);
  };

  const handleDateChange = async (date) => {
    // date가 Date 객체인지 확인하고 변환
    const newDate = date instanceof Date ? date : new Date(date);
    
    // 캘린더에서 선택한 날짜를 그대로 사용 (이미 한국 시간대)
    setSelectedDate(newDate);
    
    // localStorage에 날짜 저장 (ISO 문자열로)
    localStorage.setItem('selectedDate', newDate.toISOString());
    
    // 캘린더 닫기
    setCalendarOpen(false);
    
    // 해당 날짜의 기록 불러오기 (YYYY-MM-DD 형식)
    const dateStr = newDate.toISOString().split('T')[0];
    await loadRecordForDate(dateStr);
  };

  const formatDate = (date) => {
    try {
      // date가 Date 객체인지 확인
      if (!date || typeof date !== 'object' || !date.getFullYear) {
        console.warn('Invalid date object passed to formatDate:', date);
        const now = new Date();
        const koreanNow = new Date(now.getTime() + (9 * 60 * 60 * 1000));
        return `${koreanNow.getFullYear()}.${String(koreanNow.getMonth() + 1).padStart(2, '0')}.${String(koreanNow.getDate()).padStart(2, '0')}`;
      }
      
      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        console.warn('Invalid date value:', date);
        const now = new Date();
        const koreanNow = new Date(now.getTime() + (9 * 60 * 60 * 1000));
        return `${koreanNow.getFullYear()}.${String(koreanNow.getMonth() + 1).padStart(2, '0')}.${String(koreanNow.getDate()).padStart(2, '0')}`;
      }
      
      // 한국 시간대로 변환
      const koreanDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
      
      const year = koreanDate.getFullYear();
      const month = String(koreanDate.getMonth() + 1).padStart(2, '0');
      const day = String(koreanDate.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    } catch (error) {
      console.error('Error in formatDate:', error);
      const now = new Date();
      const koreanNow = new Date(now.getTime() + (9 * 60 * 60 * 1000));
      return `${koreanNow.getFullYear()}.${String(koreanNow.getMonth() + 1).padStart(2, '0')}.${String(koreanNow.getDate()).padStart(2, '0')}`;
    }
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
              setCurrentLocation(result.city || '안산시');
              setCurrentWeather(result.weather);
              console.log('위치 및 날씨 정보:', result);
            } catch (apiError) {
              console.error('백엔드 API 호출 실패:', apiError);
              setCurrentLocation('안산시');
            }
          },
          (error) => {
            console.error('위치 정보 가져오기 실패:', error);
            setCurrentLocation('안산시');
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5분
          }
        );
      } else {
        console.log('Geolocation이 지원되지 않습니다.');
        setCurrentLocation('안산시');
      }
    } catch (error) {
      console.error('위치 및 날씨 정보 가져오기 실패:', error);
      setCurrentLocation('안산시');
    } finally {
      setLocationLoading(false);
    }
  };

  // 날씨 상태에 따른 아이콘 반환
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

  return (
    <HomeContainer>
      <CardContainer>
        <BackgroundImage bg={bgImg} />
        <Content>
          <TopText>
            오늘 하루 영이님의<br />
            날씨 이야기를 기록해요.
            <DropdownButton onClick={handleDropdownClick}>{selectedType}</DropdownButton>
            {dropdownOpen && (
              <DropdownMenu>
                <DropdownItem onClick={() => handleSelect('DAY')}>DAY</DropdownItem>
                <DropdownItem onClick={() => handleSelect('Week')}>Week</DropdownItem>
              </DropdownMenu>
            )}
            <WeeklyReportButton onClick={() => {
              console.log('주간리포트 버튼 클릭됨');
              navigate('/weekly-report');
            }}>주간리포트</WeeklyReportButton>
          </TopText>
          <InfoRow>
            <div style={{ position: 'relative' }}>
              <InfoBox>
                <img 
                  src={calendar} 
                  alt="calendar icon" 
                  style={{ width: 16, height: 16, marginRight: 8, cursor: 'pointer' }} 
                  onClick={() => setCalendarOpen(!calendarOpen)}
                />
                <span>{formatDate(selectedDate)}</span>
              </InfoBox>
              {calendarOpen && (
                <CalendarWrapper>
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    formatDay={(locale, date) => date.toLocaleString('en', {day: 'numeric'})}
                  />
                </CalendarWrapper>
              )}
            </div>
            <InfoBox>
              <img src={locationIcon} alt="location icon" style={{ width: 16, height: 16, marginRight: 8 }} />
              <span>
                {locationLoading ? '위치 확인 중...' : currentLocation}
                {currentWeather && (
                  <span style={{ marginLeft: 8, fontSize: '12px', opacity: 0.8 }}>
                    {getWeatherIcon(currentWeather.current_condition?.[0]?.weatherDesc?.[0]?.value)}
                    {' '}
                    {currentWeather.current_condition?.[0]?.temp_C}°C
                  </span>
                )}
              </span>
            </InfoBox>
          </InfoRow>
          <MessageRow>
            {loading ? (
              <Message>기록을 불러오는 중...</Message>
            ) : selectedRecord ? (
              <RecordCard record={selectedRecord} />
            ) : (
              <Message>
                오늘의 나에게<br/>
                기록을 남겨주세요
              </Message>
            )}
            {selectedRecord && selectedRecord.id ? (
              <EditButton onClick={() => {
                console.log('수정 버튼 클릭:', selectedRecord);
                navigate('/write', { state: { selectedDate: selectedDate.toISOString(), isEdit: true, recordId: selectedRecord.id } });
              }}>
                <ButtonIcon src={writeIcon} alt="edit record" />
              </EditButton>
            ) : (
              <AddButton onClick={() => {
                console.log('추가 버튼 클릭');
                navigate('/write', { state: { selectedDate: selectedDate.toISOString() } });
              }}>
                <ButtonIcon src={plus} alt="add record" />
              </AddButton>
            )}
          </MessageRow>
        </Content>
        <Navbar />
      </CardContainer>
    </HomeContainer>
  );
}
