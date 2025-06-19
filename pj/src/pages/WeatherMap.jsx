import React, { useEffect } from 'react';
import styled from 'styled-components';
import weathersearchlogo from '../assets/weathersearchlogo.svg';
import WriteButton from '../components/WriteButton';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Pretendard', sans-serif;
`;

const CardContainer = styled.div`
  width: 440px;
  height: 956px;
  border-radius: 5px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const MapContainer = styled.div`
  flex: 1;
  width: 100%;
  min-height: 400px;
  position: relative;
`;

const MapDiv = styled.div`
  width: 100%;
  height: 956px; 
  min-height: 400px;
`;

const SearchBarRow = styled.div`
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 29px;
`;

const SearchBarContainer = styled.div`
`;

const SearchBar = styled.div`
  border-radius: 54px;
  background: rgba(27, 83, 35, 0.30);
  background: color(display-p3 0.1702 0.3208 0.1595 / 0.30);
  backdrop-filter: blur(10.100000381469727px);
  width: 310px;
  height: 56px;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px 0 15px;
  box-sizing: border-box;
`;

const SearchText = styled.span`
  color: #fff;
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
`;

const CircularButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
  }
`;

const ButtonIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 300;
`;

const WeatherMap = () => {
  useEffect(() => {
    const initializeMap = () => {
      const container = document.getElementById('map');
      if (!container) {
        console.error('Map container not found');
        return;
      }

      const options = {
        center: new window.kakao.maps.LatLng(37.296442644565175, 126.83532389153223),
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);

      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(33.450701, 126.570667),
      });

      marker.setMap(map);
    };

    const loadKakaoMapScript = () => {
      if (window.kakao && window.kakao.maps) {
        initializeMap();
        return;
      }

      if (document.getElementById('kakao-map-script')) {
        return;
      }

      const script = document.createElement('script');
      script.id = 'kakao-map-script';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=236caf5234baf8221c0e94c739ba6412&autoload=false`;
      script.async = true;

      script.onload = () => {
        window.kakao.maps.load(() => {
          initializeMap();
        });
      };

      script.onerror = (error) => {
        console.error('Kakao map script load error:', error);
      };

      document.head.appendChild(script);
    };

    const timer = setTimeout(loadKakaoMapScript, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchClick = () => {
    console.log('Search button clicked from WeatherMap');
  };

  return (
    <Container>
      <CardContainer>
        <MapContainer>
          <MapDiv id="map" />
        </MapContainer>
        <SearchBarRow>
            <SearchBarContainer>
                <SearchBar>
                <SearchText>장소를 검색해 보세요.</SearchText>
                <CircularButton onClick={handleSearchClick}>
                    <ButtonIcon><img src={weathersearchlogo} alt="weatersearch" style={{width:44,height:44,marginRight:5}} /></ButtonIcon>
                </CircularButton>
                </SearchBar>
            </SearchBarContainer>
            <WriteButton onClick={() => console.log('Write button clicked')}>✏️</WriteButton>
        </SearchBarRow>
      </CardContainer>
    </Container>
  );
};

export default WeatherMap; 