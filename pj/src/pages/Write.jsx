import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import paintIcon from '../assets/paint.svg';
import musicIcon from '../assets/music.svg';
import pictureIcon from '../assets/picture.svg';
import bgImg from '../assets/background.png';
import { useNavigate } from 'react-router-dom';

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

export default function Write() {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [text, setText] = useState('');
  
  useEffect(() => {
    const savedText = localStorage.getItem('userWeatherText');
    const savedDate = localStorage.getItem('userWeatherTextDate');
    const today = new Date().toISOString().split('T')[0];

    if (savedDate && savedDate !== today) {
      localStorage.removeItem('userWeatherText');
      localStorage.removeItem('userWeatherTextDate');
      localStorage.removeItem('hasUserText');
    } else if (savedText) {
      setText(savedText);
    }
    
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const trimmedText = text.trim();
      if (trimmedText) {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('userWeatherText', trimmedText);
        localStorage.setItem('userWeatherTextDate', today);
        localStorage.setItem('hasUserText', 'true');
      } else {
        localStorage.removeItem('userWeatherText');
        localStorage.removeItem('userWeatherTextDate');
        localStorage.removeItem('hasUserText');
      }
      navigate('/my');
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
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
        </CenterBox>
      </Overlay>
    </HomeContainer>
  );
}
