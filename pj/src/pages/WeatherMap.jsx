import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import weathersearchlogo from '../assets/weathersearchlogo.svg';
import WriteButton from '../components/WriteButton';
import markericon from '../assets/markericon.svg';
import photoinput from '../assets/photoinput.svg';
import custombtn from '../assets/custombtn.svg';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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

const CustomOverlay = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 396px;
  height: 160px;
  flex-shrink: 0;
  border-radius: 25px;
  background: rgba(166, 189, 187, 0.43);
  backdrop-filter: blur(2.85px);
  z-index: 20;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  padding-top: 20px;
`;

const PhotoButton = styled.button`
  width: 102px;
  height: 102px;
  border-radius: 24px;
  background: #e0e0e0;
  border: none;
  margin-top: 0;
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const OverlayTextInput = styled.input`
  width: 250px;
  height: 44px;
  margin-left: 5px;
  margin-top: 0;
  font-family: Pretendard;
  font-size: 20px; 
  font-weight: 500;
  padding: 0 16px;
  background: transparent;
  color: #141414;
  outline: none;
  border: none;
  cursor: default;
  &::placeholder {
    color: #141414;
    font-weight: 500;
  }
  &:hover {
    cursor: default;
  }
`;

const KeywordLabelContainer = styled.input`
  width: 250px;
  height: 30px;
  margin-left: 5px;
  margin-top: 10px;
  padding: 0 16px; 
  background: transparent;
  border: none;
  cursor: default;
  &:hover {
    cursor: default;
  }
`;


const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
`;

const OverlayActionButton = styled.button`
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 10px 10px;
  border-radius: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
`;

const WeatherMap = () => {
  const navigate = useNavigate();
  const [currentMarker, setCurrentMarker] = useState(null); // 현재 생성된 마커
  const [selectedFile, setSelectedFile] = useState(null);
  const mapRef = useRef(null);
  const fileInputRef = useRef(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [fixedMarkers, setFixedMarkers] = useState([]); // 고정된 마커들
  const [tempPlaceText, setTempPlaceText] = useState('');
  const [tempPlaceKeyword, setTempPlaceKeyword] = useState('');

  // WeatherWriteKey에서 선택된 키워드와 텍스트를 가져오기
  useEffect(() => {
    const savedPlaceText = localStorage.getItem('placeText');
    const savedPlaceKeyword = localStorage.getItem('placeKeyword');
    
    if (savedPlaceText) {
      setTempPlaceText(savedPlaceText);
    }
    if (savedPlaceKeyword) {
      setTempPlaceKeyword(savedPlaceKeyword);
    }
  }, []);

  const closeOverlay = () => {
    setOverlayVisible(false);
    if (currentMarker) {
      currentMarker.setMap(null);
      setCurrentMarker(null);
    }
  };

  const fixMarker = () => {
    if (currentMarker) {
      const position = currentMarker.getPosition();
      const newFixedMarker = {
        id: Date.now(),
        lat: position.getLat(),
        lng: position.getLng(),
        text: tempPlaceText,
        keyword: tempPlaceKeyword,
      };
      setFixedMarkers(prev => [...prev, newFixedMarker]);
      closeOverlay();
    }
  };

  const handleSearchClick = () => {
    console.log('Search button clicked');
  };

  // 카카오 맵 초기화
  useEffect(() => {
    const initializeMap = () => {
      const container = document.getElementById('map');
      if (!container) return;
  
      const options = {
        center: new window.kakao.maps.LatLng(37.296442644565175, 126.83532389153223),
        level: 3,
      };
  
      const map = new window.kakao.maps.Map(container, options);
      mapRef.current = map;
      setMapLoaded(true);
    };
  
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initializeMap);
    } else {
      const script = document.createElement('script');
      script.id = 'kakao-map-script';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=236caf5234baf8221c0e94c739ba6412&autoload=false`;
      script.async = true;
  
      script.onload = () => {
        window.kakao.maps.load(initializeMap);
      };
  
      script.onerror = (error) => {
        console.error('Kakao map script load error:', error);
      };
  
      document.head.appendChild(script);
    }
  }, []);
  
  useEffect(() => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) return;
  
    const map = mapRef.current;
  
    const handleClick = (mouseEvent) => {
      const latlng = mouseEvent.latLng;
      const lat = latlng.getLat();
      const lng = latlng.getLng();
  
      if (currentMarker) {
        const currentPos = currentMarker.getPosition();
        const distance = Math.sqrt(
          Math.pow(currentPos.getLat() - lat, 2) + Math.pow(currentPos.getLng() - lng, 2)
        );
        if (distance < 0.0001) {
          currentMarker.setMap(null);
          setCurrentMarker(null);
          setOverlayVisible(false);
          return;
        }
        currentMarker.setMap(null);
      }
  
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(lat, lng),
        image: new window.kakao.maps.MarkerImage(
          markericon,
          new window.kakao.maps.Size(44, 44),
          { offset: new window.kakao.maps.Point(22, 44) }
        )
      });
  
      marker.setMap(map);
      setCurrentMarker(marker);
      setOverlayVisible(true);
      setTempPlaceText('');
      setTempPlaceKeyword('');
    };
  
    window.kakao.maps.event.addListener(map, 'click', handleClick);
    return () => {
      window.kakao.maps.event.removeListener(map, 'click', handleClick);
    };
  }, [currentMarker]);
  
  useEffect(() => {
    if (!currentMarker || !window.kakao || !window.kakao.maps) return;
  
    const handleMarkerClick = () => {
      if (!overlayVisible) {
        setOverlayVisible(true);
        setTempPlaceText('');
        setTempPlaceKeyword('');
      }
    };
  
    window.kakao.maps.event.addListener(currentMarker, 'click', handleMarkerClick);
    return () => {
      if (currentMarker) {
        window.kakao.maps.event.removeListener(currentMarker, 'click', handleMarkerClick);
      }
    };
  }, [currentMarker, overlayVisible]);
  
  useEffect(() => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps || !mapLoaded) return;
  
    fixedMarkers.forEach(markerData => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(markerData.lat, markerData.lng),
        image: new window.kakao.maps.MarkerImage(
          markericon,
          new window.kakao.maps.Size(44, 44),
          { offset: new window.kakao.maps.Point(22, 44) }
        )
      });
  
      marker.setMap(mapRef.current);
  
      const onClick = () => {
        setOverlayVisible(true);
        setTempPlaceText(markerData.text);
        setTempPlaceKeyword(markerData.keyword);
      };
  
      window.kakao.maps.event.addListener(marker, 'click', onClick);
    });
  }, [fixedMarkers, mapLoaded]);
  

  return (
    <Container>
      <CardContainer>
        <MapContainer>
          <MapDiv id="map" />
          {overlayVisible && (
            <CustomOverlay>
              <PhotoButton onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                <img src={photoinput} alt="photoinput" style={{width:102,height:102}} />
              </PhotoButton>
              <div style={{ width: 250, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                <OverlayTextInput
                  value={tempPlaceText}
                  onChange={(e) => setTempPlaceText(e.target.value)}
                  placeholder="아직 등록 된 장소가 없어요!"
                  readOnly
                />
                <KeywordLabelContainer
                  value={tempPlaceKeyword}
                  onChange={(e) => setTempPlaceKeyword(e.target.value)}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
              <OverlayActionButton onClick={() => navigate('/community')}>
                <img src={custombtn} alt="custombtn" style={{width:10,height:20}} />
              </OverlayActionButton>
              <CloseButton onClick={closeOverlay}>
                ×
              </CloseButton>
            </CustomOverlay>
          )}
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
            <WriteButton onClick={() => navigate('/weather-write')} />
        </SearchBarRow>
        <Navbar />
      </CardContainer>
    </Container>
  );
};

export default WeatherMap;