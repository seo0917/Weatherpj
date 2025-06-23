import styled from 'styled-components';
import bgImg from '../assets/background.png';
import locationIcon from '../assets/locationIcon.svg';
import React, { useState, useEffect } from 'react';
import rain from '../assets/rain.svg';
import temper from '../assets/temper.svg';
import humidity from '../assets/humidity.svg';
import { weatherAPI } from '../services/api';

const HomeContainer = styled.div`
  width: 440px;
  height: 956px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  @media (max-width: 480px) {
    width: 100vw;
    height: 100vh;
    min-width: 0;
    min-height: 0;
    border-radius: 0;
    padding: 0;
  }
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
  @media (max-width: 480px) {
    width: 100vw;
    height: 100vh;
    min-width: 0;
    min-height: 0;
    border-radius: 0;
  }
`;

const BackgroundImage = styled.div`
  width: 440px;
  height: 956px;
  z-index: 0;
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
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
  transition: backdrop-filter 0.3s;
  backdrop-filter: ${({ blur }) => (blur ? 'blur(8px)' : 'none')};
  pointer-events: ${({ blur }) => (blur ? 'none' : 'auto')};
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

const InfoRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
`;

const InfoBox = styled.div`
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 11px 11px;
  color: #222;
  font-size: 14px;
  font-family: Pretendard;
  font-weight: 400;
`;

const StatusBox = styled(InfoBox)`
  color: #4ecdc4;
  background: rgba(76,205,196,0.12);
`;

const Message = styled.div`
  color: #234E83;
  font-family: Pretendard;
  font-size: 36px;
  font-weight: 250;
  line-height: 140%;
  letter-spacing: -1.08px;
  margin: 38px 0 24px 0;
  text-align: left;
  width: 100%;
`;

const WeatherSection = styled.div`
  position: absolute;
  right: 0;
  bottom: 190px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 1;
  padding-bottom: 27px;
`;

const LocationTempWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-right: 22px;
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
`;

const LocationIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 12px;
`;

const TempRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: -28px;
  margin-left: -18px;
`;

const Temp = styled.div`
  font-size: 128px;
  color: #141414;
  line-height: 135%;
  margin-bottom: -44px;
`;

const TempRange = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #113956;
  font-style: normal;
  font-weight: 400;
  line-height: 135%;
  letter-spacing: -0.6px;
  margin-top: 0;
  margin-right: 0;
`;

const MinTemp = styled.span`
  margin-right: 10px;
`;

const RangeLine = styled.span`
  width: 80px;
  height: 2px;
  background: #557CA1;
  display: block;
`;

const MaxTemp = styled.span`
  margin-left: 10px;
`;

const Location = styled.div`
  color: #113956;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; 
  letter-spacing: -0.48px;
`;

const BottomButton = styled.button`
  position: absolute;
  left: 50%;
  bottom: 140px;
  transform: translateX(-50%);
  width: 292px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 54px;
  background: rgba(78, 148, 232, 0.50);
  backdrop-filter: blur(2px);
  color: #FFF;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 135%;
  letter-spacing: -0.48px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(78, 148, 232, 0.7);
  }
`;

const BottomSheetBackdrop = styled.div`
  position: fixed;
  width: 440px;
  height: 956px;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: 80;
  display: ${({ open }) => (open ? 'block' : 'none')};
  opacity: ${({ open }) => (open ? 1 : 0)};
  transition: all 0.3s ease;
  cursor: pointer;
`;

const BottomSheetContainer = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0px;
  transform: translateX(-50%) translateY(${({ open }) => (open ? '0' : '75%')});
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.3s;
  width: 100vw;
  max-width: 440px;
  height: 509px;
  background: ${({ open }) => open ? 'rgba(12, 63, 78, 0.50)' : 'color(display-p3 0.4817 0.6919 0.8058)'};
  border-top-left-radius: 48px;
  border-top-right-radius: 48px;
  z-index: 99;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  @media (max-width: 480px) {
    width: 100vw;
    max-width: 100vw;
    height: 50vh;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
  }
`;

const BottomSheetHandle = styled.div`
  width: 72px;
  height: 3px;
  background: #E6F0F7;
  border-radius: 6px;
  margin: 18px 0 18px 0;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #D1E7F5;
  }
`;

const BottomSheetContent = styled.div`
  width: 100%;
  padding: 39px 8px 39px 8px;
  color: #fff;
  font-family: Pretendard;
  font-style: normal;
  flex: 1;
  overflow-y: auto;
`;

const SheetTitle = styled.div`
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 8px;
  margin-left: 24px;
  color: #fff;
`;

const SheetDesc = styled.div`
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 24px;
  color: #fff;
`;

const SheetRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const SheetLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 400;
  margin-left: 24px;
`;

const SheetValue = styled.div`
  font-size: 32px;
  font-weight: 600;
  display: flex;
  align-items: flex-end;
  margin-right: 24px;
`;

const SheetBadge = styled.span`
  border-radius: 12px;
  border: 1px solid ${({ color }) => color || '#97FE76'};
  font-size: 13px;
  color: ${({ color }) => color || '#97FE76'};
  font-weight: 500;
  padding: 2px 12px;
  margin-left: 10px;
`;

const SheetDivider = styled.div`
  width: 389px;
  height: 0;
  border-bottom: 0.7px solid #CCC;
  margin: 16px auto 24px auto;
`;

export default function Home({ setBottomSheetOpen }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (setBottomSheetOpen) setBottomSheetOpen(sheetOpen);
  }, [sheetOpen, setBottomSheetOpen]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        // 기본 위치로 서울 사용 (실제로는 사용자 위치 또는 저장된 위치 사용)
        const data = await weatherAPI.getCurrentWeather(37.5665, 126.9780);
        setWeatherData(data);
      } catch (error) {
        console.error('날씨 데이터 조회 실패:', error);
        // 기본 데이터 설정
        setWeatherData({
          temperature: 17,
          minTemperature: 16,
          maxTemperature: 20,
          weatherCondition: '비',
          location: '서울',
          details: {
            precipitation: 12,
            feelsLike: 15,
            humidity: 81,
            precipitationLevel: '보통',
            humidityLevel: '매우 높음',
            comfortLevel: '불쾌'
          },
          message: {
            mainText: '비가 먼저 나가서 기다리고 있어요.',
            subText: '우산 꼭 챙겨서 만나요!'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  // 바텀시트 핸들 클릭 시만 토글
  const handleToggleSheet = () => {
    setSheetOpen(!sheetOpen);
  };

  // 바텀시트 컨테이너 클릭 시 이벤트 전파 방지
  const handleSheetContainerClick = (e) => {
    e.stopPropagation();
  };

  if (loading) {
    return (
      <HomeContainer>
        <CardContainer>
          <BackgroundImage bg={bgImg} />
          <Content>
            <TopText>날씨 정보를 불러오는 중...</TopText>
          </Content>
        </CardContainer>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <CardContainer>
        <BackgroundImage bg={bgImg} />
        <Content blur={sheetOpen}>
          <TopText>
            햇살이 반가운 날도 있지만,<br />
            비 오는 날엔 느긋해도 괜찮아요.
          </TopText>
          <InfoRow>
            <InfoBox>{new Date().toLocaleDateString('ko-KR', { 
              year: '2-digit', 
              month: '2-digit', 
              day: '2-digit' 
            }).replace(/\./g, '.').replace(/ /g, '')}</InfoBox>
            <InfoBox>{new Date().toLocaleTimeString('ko-KR', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            }).toUpperCase()}</InfoBox>
            <StatusBox>{weatherData?.details?.comfortLevel || '보통'}</StatusBox>
          </InfoRow>
          <Message>
            {weatherData?.message?.mainText || '오늘도 좋은 하루 보내세요!'}<br />
            <span style={{fontWeight:400}}>{weatherData?.message?.subText || '기분 좋은 하루 되세요!'}</span>
          </Message>
          <WeatherSection>
            <LocationTempWrapper>
              <LocationRow>
                <LocationIcon src={locationIcon} />
                <Location>{weatherData?.location || '서울'} | {weatherData?.weatherCondition || '맑음'}</Location>
              </LocationRow>
              <TempRow>
                <Temp>
                  {Math.round(weatherData?.temperature || 17)}
                  <span style={{
                    fontSize: 80,
                    position: 'relative',
                    top: '-34px'
                  }}>°</span>
                </Temp>
                <TempRange>
                  <MinTemp>{Math.round(weatherData?.minTemperature || 16)}</MinTemp>
                  <RangeLine />
                  <MaxTemp>{Math.round(weatherData?.maxTemperature || 20)}</MaxTemp>
                </TempRange>
              </TempRow>
            </LocationTempWrapper>
          </WeatherSection>
          {/* 바텀 버튼은 바텀시트와 연결하지 않음 */}
          <BottomButton>
            오늘의 마음의 색상을 등록해주세요.
          </BottomButton>
        </Content>
        {/* 바텀시트 백드롭 - 클릭 시 토글 */}
        <BottomSheetBackdrop open={sheetOpen} onClick={handleToggleSheet} />
        {/* 바텀시트 - 핸들로만 열고 닫기, 컨테이너 클릭 시 이벤트 전파 방지 */}
        <BottomSheetContainer open={sheetOpen} onClick={handleSheetContainerClick}>
          <BottomSheetHandle onClick={handleToggleSheet} />
          <BottomSheetContent>
            <SheetTitle>남은 하루 동안<br/>{weatherData?.weatherCondition || '맑음'}이 계속 이어질 예정이에요.</SheetTitle>
            <SheetDesc></SheetDesc>
            <SheetRow>
              <SheetLabel><img src={rain} alt="rain" style={{width:24,height:24,marginRight:8}} />강수량 <SheetBadge color="#97FE76">{weatherData?.details?.precipitationLevel || '보통'}</SheetBadge></SheetLabel>
              <SheetValue>{Math.round(weatherData?.details?.precipitation || 0)}<span style={{fontSize:18,marginLeft:4,marginBottom:2}}>mm</span></SheetValue>
            </SheetRow>
            <SheetDivider />
            <SheetRow>
              <SheetLabel><img src={temper} alt="temper" style={{width:24,height:24,marginRight:8}} />체감온도</SheetLabel>
              <SheetValue>{Math.round(weatherData?.details?.feelsLike || 17)}<span style={{fontSize:22,marginLeft:4,marginBottom:8}}>°</span></SheetValue>
            </SheetRow>
            <SheetDivider />
            <SheetRow>
              <SheetLabel><img src={humidity} alt="humidity" style={{width:24,height:24,marginRight:8}} />습도 <SheetBadge color="#FF8767">{weatherData?.details?.humidityLevel || '보통'}</SheetBadge> <SheetBadge color="#FFB064">{weatherData?.details?.comfortLevel || '쾌적'}</SheetBadge></SheetLabel>
              <SheetValue>{Math.round(weatherData?.details?.humidity || 50)}<span style={{fontSize:18,marginLeft:4,marginBottom:4}}>%</span></SheetValue>
            </SheetRow>
            <SheetDivider />
          </BottomSheetContent>
        </BottomSheetContainer>
      </CardContainer>
    </HomeContainer>
  );
}