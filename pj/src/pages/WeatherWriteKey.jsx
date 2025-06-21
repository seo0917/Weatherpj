import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import writebackground from '../assets/writebackground.png';
import { useNavigate, useLocation } from 'react-router-dom';



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

const CardContainer = styled.div`
  width: 440px;
  height: 956px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
`;

const CenterInput = styled.input`
  width: 320px;
  height: 36px;
  border-radius: 18px;
  border: none;
  background: transparent;
  font-size: 28px;
  padding: 0 20px;
  text-align: center;
  outline: none;
  color: #EBEBEB;
  &::placeholder {
    color: #aaa;
    font-weight: 400;
  }
`;

const KeywordLabelContainer = styled.div`
  position: absolute;
  top: 530px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  gap: 5px;
`;

const KeywordLabel = styled.div`
  width: 62px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 20px;
  border: 0.7px solid ${props => props.active ? (props.color || '#2AD1BE') : (props.color || '#aaa')};
  background: ${props => props.active ? (props.bg || 'rgba(70, 147, 142, 0.34)') : 'transparent'};
  backdrop-filter: blur(4.2px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? (props.color || '#2AD1BE') : (props.color || '#aaa')};
  font-size: 15px;
  font-weight: 400;
  margin: 0;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
  opacity: 1;
  &:hover {
    opacity: 0.6;
  }
`;

const keywords = [
  { label: '신나는', color: '#FFB064', bg: 'rgba(255, 176, 100, 0.18)' },
  { label: '편안한', color: '#D6ECAB', bg: 'rgba(102, 222, 104, 0.18)' },
  { label: '맛있는', color: '#4E94E8', bg: 'rgba(78, 148, 232, 0.18)' },
  { label: '행복한', color: '#FF8767', bg: 'rgba(255, 135, 103, 0.18)' },
  { label: '설레는', color: '#B48CF2', bg: 'rgba(180, 140, 242, 0.18)' },
  { label: '따뜻한', color: '#F2C94C', bg: 'rgba(242, 201, 76, 0.18)' },
  { label: '상쾌한', color: '#2AD1BE', bg: 'rgba(42, 209, 190, 0.18)' },
  { label: '아쉬운', color: '#FF5E5E', bg: 'rgba(255, 94, 94, 0.18)' },
  { label: '지루한', color: '#8D8D8D', bg: 'rgba(141, 141, 141, 0.18)' },
];

const WeatherWriteKey = () => {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  // 입력값과 선택된 키워드가 바뀔 때마다 localStorage에 저장
  React.useEffect(() => {
    localStorage.setItem('placeText', inputValue);
    localStorage.setItem('placeKeyword', selectedIdx !== null ? keywords[selectedIdx].label : '');
  }, [inputValue, selectedIdx]);

  // 엔터 입력 시 텍스트/키워드만 저장하고 /weather-map으로 이동
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue && selectedIdx !== null) {
      localStorage.setItem('placeText', inputValue);
      localStorage.setItem('placeKeyword', keywords[selectedIdx].label);
      navigate('/weather-map');
    }
  };

  return (
    <Container>
      <CardContainer>
        <CenterInput
          placeholder="이곳은 어떤 장소인가요?"
          fontSize={28}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <KeywordLabelContainer>
          {keywords.map((kw, idx) => (
            <KeywordLabel
              key={kw.label + idx}
              color={kw.color}
              bg={kw.bg}
              active={selectedIdx === idx}
              onClick={() => setSelectedIdx(idx)}
            >
              {kw.label}
            </KeywordLabel>
          ))}
        </KeywordLabelContainer>
      </CardContainer>
    </Container>
  );
};

export default WeatherWriteKey;
