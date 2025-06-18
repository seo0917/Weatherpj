import React, { useEffect } from 'react';
import styled from 'styled-components';

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
      script.src = `//https:dapi.kakao.com/v2/maps/sdk.js?appkey=c117953be801da7bbfcfd49ff9c30485&autoload=false`;
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

  return (
    <Container>
      <CardContainer>
        <MapContainer>
          <MapDiv id="map" />
        </MapContainer>
      </CardContainer>
    </Container>
  );
};

export default WeatherMap;

