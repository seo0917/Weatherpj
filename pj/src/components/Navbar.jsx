import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home.svg';
import homeActiveIcon from '../assets/home_act.svg';
import mapIcon from '../assets/map.svg';
import mapActiveIcon from '../assets/map_act.svg';
import myIcon from '../assets/my.svg';
import myActiveIcon from '../assets/my_act.svg';

const NavBarContainer = styled.div`
  width: 440px;
  height: 50px;
  flex-shrink: 0;
  background: #80C9E2;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 24px 0 16px 0;
  position: fixed; 
  bottom: 0;      
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const NavIcon = styled.img`
  width: 40px;
  height: 40px;
  margin-bottom: 1px;
`;

const NavText = styled.div`
  margin-top: 10px;
  color: ${props => props.active ? '#DAEDFF' : '#75ACC5'};
  text-align: center;
  leading-trim: both;
  text-edge: cap;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 125%;
  text-transform: uppercase;
`;

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleNavigation = (path) => {
    navigate(path);
  };
  
  return (
    <NavBarContainer>
      <NavItem onClick={() => handleNavigation('/home')}>
        <NavIcon 
          src={location.pathname === '/home' ? homeActiveIcon : homeIcon} 
          alt="home" 
          active={location.pathname === '/home'} 
        />
        <NavText active={location.pathname === '/home'}>HOME</NavText>
      </NavItem>
      
      {/* WEATHER MAP 현재 경로가 /weather-map일 때 활성화 */}
      <NavItem onClick={() => handleNavigation('/weather-map')}>
        <NavIcon 
          src={location.pathname === '/weather-map' ? mapActiveIcon : mapIcon} 
          alt="map" 
          active={location.pathname === '/weather-map'} 
        />
        <NavText active={location.pathname === '/weather-map'}>WEATHER MAP</NavText>
      </NavItem>
      
      {/* MY 메뉴는 현재 경로가 /my일 때 활성화 */}
      <NavItem onClick={() => handleNavigation('/my')}>
        <NavIcon 
          src={location.pathname === '/my' ? myActiveIcon : myIcon} 
          alt="my" 
          active={location.pathname === '/my'} 
        />
        <NavText active={location.pathname === '/my'}>MY</NavText>
      </NavItem>
    </NavBarContainer>
  );
}