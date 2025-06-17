import styled from 'styled-components';
import bgImg from '../assets/background.png';
import Navbar from '../components/Navbar';
import homeIcon from '../assets/home.svg';
import homeActiveIcon from '../assets/home_act.svg';
import mapIcon from '../assets/map.svg';
import mapActiveIcon from '../assets/map_act.svg';
import myIcon from '../assets/my.svg';
import myActiveIcon from '../assets/my_act.svg';
import calendar from '../assets/calendar.svg';
import locationIcon from '../assets/locationIcon.svg';
import plus from '../assets/plus.svg';
import React, { useState } from 'react';
import { AlignCenter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


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
  text-align: center;
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
  margin-bottom:10%;
`;

const MessageButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
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

function MyNavBar() {
  const navigate = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };
  return (
    <div style={{position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'440px',height:'70px',background:'color(display-p3 0.5654 0.78 0.8732)',display:'flex',justifyContent:'space-around',alignItems:'center',zIndex:100}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer'}} onClick={()=>navigate('/home')}>
        <img src={homeIcon} alt="home" style={{width:40,height:40,marginBottom:4}} />
        <div style={{marginTop:13,color:'#75ACC5',fontFamily:'Pretendard',fontSize:12,fontWeight:500,textTransform:'uppercase'}}>HOME</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer'}} onClick={()=>navigate('/map')}>
        <img src={mapIcon} alt="map" style={{width:40,height:40,marginBottom:4,filter:'grayscale(1)'}} />
        <div style={{marginTop:13,color:'#75ACC5',fontFamily:'Pretendard',fontSize:12,fontWeight:500,textTransform:'uppercase'}}>WEATHER MAP</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer'}} onClick={()=>navigate('/my')}>
        <img src={myActiveIcon} alt="my" style={{width:40,height:40,marginBottom:4}} />
        <div style={{marginTop:13,color:'#DAEDFF',fontFamily:'Pretendard',fontSize:12,fontWeight:500,textTransform:'uppercase'}}>MY</div>
      </div>
    </div>
  );
}

export default function My() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('DAY');

  const handleDropdownClick = () => setDropdownOpen(v => !v);
  const handleSelect = (type) => {
    setSelectedType(type);
    setDropdownOpen(false);
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
          </TopText>
          <InfoRow>
            <InfoBox><img src={calendar} alt="calendar" style={{width:14,height:14,marginRight:4}} />25.05.15</InfoBox>
            <InfoBox><img src={locationIcon} alt="locationIcon" style={{width:13,height:14,marginRight:4}} />안산시 상록구 | 비</InfoBox>
          </InfoRow>
          <MessageRow>
            <Message>
              비가 먼저 나가서<br />
              기다리고 있어요.<br />
              <span style={{fontWeight:400}}>우산 꼭 챙겨서 만나요!</span>
            </Message>
            <MessageButton onClick={() => navigate('/write')}>
              <img src={plus} alt="plus" style={{width:52,height:52, marginBottom: 30}} />
            </MessageButton>
          </MessageRow>
        </Content>
        <Navbar />
      </CardContainer>
    </HomeContainer>
  );
}
