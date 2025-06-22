import React from 'react';
import styled from 'styled-components';
import writeicon from '../assets/writeicon.svg';
import { useNavigate } from 'react-router-dom';

const StyledWriteButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  transition: all 0.2s ease;
`;

const IconImg = styled.img`
  width: 56px;
  height: 56px;
  display: block;
`;

const WriteButton = (props) => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    if (props.onClick) props.onClick(e);
    navigate('/weather-write');
  };
  return (
    <StyledWriteButton {...props} onClick={handleClick}>
      <IconImg src={writeicon} alt="write icon" />
    </StyledWriteButton>
  );
};

export default WriteButton; 