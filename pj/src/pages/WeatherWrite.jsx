import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import writebackground from '../assets/writebackground.png';
import WriteButton from '../components/WriteButton';
import { useNavigate, useLocation } from 'react-router-dom';
import backbutton from '../assets/backbutton.svg';

const Container = styled.div`
  width: 440px;
  height: 956px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${writebackground});
  background-size: cover;
  background-position: center;
`;

const Card = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

const BottomSheet = styled.div`
  width: 440px;
  height: ${props => props.showOnlyTop ? '30px' : '413px'};
  background: rgba(155, 155, 155, 0.39);
  flex-shrink: 0;
  box-shadow: 0px -1px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 45px 45px 0px 0px;
  backdrop-filter: blur(15.6px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  overflow: hidden;
  transition: height 0.3s;
`;

const BottomSheetHandle = styled.div`
  width: 72px;
  height: 3px;
  position: absolute;
  top: 0;
  background: rgba(255, 255, 255, 0.57);
  border-radius: 6px;
  margin: 14px 0 14px 0;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #D1E7F5;
  }
`;

const ColorPickerContainer = styled.div`
  width: 387px;
  height: 273px;
  flex-shrink: 0;
  background: transparent;
  border-radius: 27px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const GradientPicker = styled.div`
  width: 100%;
  height: 250px;
  position: relative;
  border-radius: 27px;
  cursor: crosshair;
  background: linear-gradient(to right, #fff, hsl(${props => props.hue}, 100%, 50%)),
              linear-gradient(to top, #000, transparent);
  overflow: hidden;
`;

const ColorIndicator = styled.div`
  width: 25px;
  height: 25px;
  border: 5px solid;
  border-color: rgba(255, 255, 255, 0.57);
  border-radius: 50%;
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, -50%);
  left: ${props => props.x}%;
  top: ${props => props.y}%;
`;

const HueSlider = styled.div`
  width: 100%;
  height: 20px;
  margin-top: 16px;
  border-radius: 10px;
  background: linear-gradient(to right, 
    #ff0000 0%, 
    #ffff00 17%, 
    #00ff00 33%, 
    #00ffff 50%, 
    #0000ff 67%, 
    #ff00ff 83%, 
    #ff0000 100%
  );
  cursor: pointer;
  position: relative;
`;

const HueIndicator = styled.div`
  width: 4px;
  height: 24px;
  background: white;
  border-radius: 2px;
  position: absolute;
  top: -2px;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.3);
  transform: translateX(-50%);
  left: ${props => props.position}%;
`;

const SaveButton = styled.button`
  width: 388px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 20px;
  background: color(display-p3 0.9864 0.9864 0.9864);
  border: none;
  font-size: 22px;
  font-weight: 400;
  color: #222;
  margin-top: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  transition: background 0.2s;
  &:hover {
    background: #f0f0f0;
  }
`;

const TopLeftButton = styled.button`
  position: absolute;
  top: 32px;
  left: 24px;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherWrite = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [indicatorPos, setIndicatorPos] = useState({ x: 100, y: 50 });
  const [huePos, setHuePos] = useState(0);
  
  const gradientRef = useRef(null);
  const hueRef = useRef(null);

  const handleCardClick = (e) => {
    if (
      e.target.closest('[data-top-left-button]') ||
      e.target.closest('[data-bottom-sheet]')
    ) {
      return;
    }
    navigate('/weatherwritekey');
  };

  const handleSheetToggle = () => setSheetOpen(open => !open);

  const handleGradientClick = (e) => {
    if (!gradientRef.current) return;
    
    const rect = gradientRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setIndicatorPos({ x, y });
    setSaturation(x);
    setLightness(100 - y);
  };

  const handleHueClick = (e) => {
    if (!hueRef.current) return;
    
    const rect = hueRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const newHue = (x / 100) * 360;
    
    setHue(newHue);
    setHuePos(x);
  };

  const handleSave = () => {
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    localStorage.setItem('communityCardBg', color);
  };

  return (
    <Container>
      <Card style={{ position: 'relative' }} onClick={handleCardClick}>
        <TopLeftButton data-top-left-button onClick={e => { e.stopPropagation(); navigate('/weather-map'); }}>
          <img src={backbutton} alt="뒤로가기" style={{ width: 15, height: 25 }} />
        </TopLeftButton>
        <BottomSheet data-bottom-sheet showOnlyTop={!sheetOpen}>
          <BottomSheetHandle onClick={handleSheetToggle} />
          {sheetOpen && (
            <ColorPickerContainer>
              <div style={{ width: '100%' }}>
                <GradientPicker 
                  ref={gradientRef}
                  hue={hue}
                  onClick={handleGradientClick}
                >
                  <ColorIndicator x={indicatorPos.x} y={indicatorPos.y} />
                </GradientPicker>
                
                <HueSlider ref={hueRef} onClick={handleHueClick}>
                  <HueIndicator position={huePos} />
                </HueSlider>
                
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <SaveButton onClick={handleSave}>등록하기</SaveButton>
                </div>
              </div>
            </ColorPickerContainer>
          )}
        </BottomSheet>
      </Card>
    </Container>
  );
};

export default WeatherWrite;