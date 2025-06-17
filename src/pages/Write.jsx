import React, { useRef } from 'react';
import styled from 'styled-components';

const StyledTextarea = styled.textarea`
  background: none;
  border: none;
  border-bottom: 2px solid #fff;
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
    color: #fff;
    opacity: 0.9;
    font-size: 22px;
    text-align: center;
    white-space: pre-line;
  }
`;

const Write = () => {
  const inputRef = useRef(null);

  return (
    <StyledTextarea
      ref={inputRef}
      autoFocus
      rows={2}
      placeholder={"오늘 하루, 날씨 이야기를\n기록해주세요."}
    />
  );
};

export default Write; 