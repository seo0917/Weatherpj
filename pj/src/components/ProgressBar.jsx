import React from 'react';
import styled from 'styled-components';

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const ProgressBarWrapper = styled.div`
  flex: 1;
  height: 4px;
  background-color: #A0BEC5;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #AAD7E2;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
  border-radius: 2px;
`;

const ProgressText = styled.span`
  color: color(display-p3 0.6258 0.7446 0.7724);
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 155%;
  letter-spacing: -0.36px;
  min-width: 40px;
  text-align: center;
  leading-trim: both;
  text-edge: cap;
`;

const ProgressBar = ({ percentage = 60, text = "60%" }) => {
  return (
    <ProgressContainer>
      <ProgressBarWrapper>
        <ProgressFill percentage={percentage} />
      </ProgressBarWrapper>
      <ProgressText>{text}</ProgressText>
    </ProgressContainer>
  );
};

export default ProgressBar;