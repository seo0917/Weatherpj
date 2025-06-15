import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import styled from 'styled-components';
import ProgressBar from './ProgressBar.jsx';
import { UNSAFE_ViewTransitionContext, useNavigate } from 'react-router-dom';

const Container = styled.div`
  background-color:rgb(255, 255, 255);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const CardWrapper = styled.div`
  background: color(display-p3 1 1 1);
  border-radius: 12px;
  width: 440px;
  height: 956px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  padding: 20px;
`;

const CardTitle = styled.h2`
  color: color(display-p3 0.0784 0.0784 0.0784);
  font-family: Pretendard;
  font-size: 26px;
  font-style: normal;
  font-weight: 600;
  line-height: 132%;
  letter-spacing: -0.84px;
  leading-trim: both;
  text-edge: cap;
`;

const CardContent = styled.div`
  padding: 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ContentText = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

const DropdownContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DropdownButton = styled.button`
  width: 112px;
  height: 40px;
  padding: 0 16px;
  background: color(display-p3 0.9423 0.9423 0.9423);
  border: none;
  border-radius: 17px;
  font-size: 14px;
  color: #333;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
  
  &:hover {
    background: #e8e8e8;
  }
`;

const DropdownLabel = styled.label`
  font-size: 14px;
  color: #333;
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin-top: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 112px;
  overflow-y: auto;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:first-child {
    border-radius: 12px 12px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 12px 12px;
  }
`;

const TextField = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TextFieldInput = styled.input`
  width: 194px;
  height: 40px;
  padding: 0 16px;
  background: color(display-p3 0.9423 0.9423 0.9423);
  border: none;
  border-radius: 17px;
  font-size: 14px;
  color: #333;
  flex-shrink: 0;
  
  &:focus {
    outline: none;
    background: #e8e8e8;
  }
  
  &::placeholder {
    color: #999;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TextFieldLabel = styled.label`
  font-size: 14px;
  color: #333;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 32px;
  left: 0;
  right: 0;
  display: flex;
  gap: 9px;
  align-items: center;
  padding: 0 40px;
  justify-content: center;
  max-width: 100%;
  box-sizing: border-box;
`;

const BottomButton = styled.button`
  width: 269px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 24px;
  background: color(display-p3 0.4732 0.6933 0.7483);
  color: color(display-p3 1 1 1);
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%;
  letter-spacing: -0.72px;
  leading-trim: both;
  text-edge: cap;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    background: #E0E0E0;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: color(display-p3 0.4232 0.6433 0.6983);
  }
`;

const CancelButton = styled.button`
  width: 114px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 24px;
  background: color(display-p3 0.9314 0.9314 0.9314);
  color: color(display-p3 1 1 1);
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%;
  letter-spacing: -0.72px;
  leading-trim: both;
  text-edge: cap;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: color(display-p3 0.9014 0.9014 0.9014);
  }
`;

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedWeather, setSelectedWeather] = useState('');
  const [weatherText, setWeatherText] = useState('');
  const [isSecondDropdownOpen, setIsSecondDropdownOpen] = useState(false);
  const [selectedSecondWeather, setSelectedSecondWeather] = useState('');
  const [secondWeatherText, setSecondWeatherText] = useState('');
  const [isFirstStepComplete, setIsFirstStepComplete] = useState(false);
  const navigate = useNavigate();

  const seasonOptions = [
    '봄', '여름', '가을', '겨울'
  ];

  const steps = [
    {
      title: "거의 다 왔어요! 영이님이 좋아하는 날씨를 알려주세요.",
      progress: isFirstStepComplete ? 90 : 80
    }
  ];

  const handleNext = () => {
    if (isLastStep) {
      navigate('/home');
    } else {
      setCurrentStep(currentStep + 1);
      setSelectedSecondWeather('');
      setSecondWeatherText('');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedSecondWeather('');
      setSecondWeatherText('');
    }
  };

  const handleWeatherSelect = (weather) => {
    setSelectedWeather(weather);
    setIsDropdownOpen(false);
  };

  const handleSecondWeatherSelect = (weather) => {
    setSelectedSecondWeather(weather);
    setIsSecondDropdownOpen(false);
  };

  // 80% 단계 완료 체크
  useEffect(() => {
    if (selectedWeather && weatherText.trim()) {
      const timer = setTimeout(() => {
        setIsFirstStepComplete(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsFirstStepComplete(false);
    }
  }, [selectedWeather, weatherText]);

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isNextDisabled = !selectedSecondWeather || !secondWeatherText.trim();
  const showNextButton = isFirstStepComplete;

  return (
    <Container>
      <CardWrapper>
        <CardHeader>
          <ProgressBar percentage={currentStepData.progress} text={`${currentStepData.progress}%`} />
          <CardTitle>
            거의 다 왔어요! 영이님이 좋아하는<br />
            날씨를 알려주세요.
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* 첫 번째 날씨 선택 (80% 단계) */}
          <div style={{ 
            opacity: isFirstStepComplete ? 0.5 : 1,
            transition: 'opacity 0.3s ease',
            pointerEvents: isFirstStepComplete ? 'none' : 'auto'
          }}>
            <DropdownContainer>
              <DropdownButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                {selectedWeather || '계절'}
                <ChevronDown size={16} className={isDropdownOpen ? 'rotate-180' : ''} />
              </DropdownButton>
              <DropdownLabel>
                을(를) 가장 좋아하고,
              </DropdownLabel>
              
              {isDropdownOpen && (
                <DropdownList>
                  {seasonOptions.map((season) => (
                    <DropdownItem
                      key={season}
                      onClick={() => handleWeatherSelect(season)}
                    >
                      {season}
                    </DropdownItem>
                  ))}
                </DropdownList>
              )}
            </DropdownContainer>

            <TextField>
              <TextFieldInput
                type="text"
                placeholder="구름한점 없이 맑은"
                value={weatherText}
                onChange={(e) => setWeatherText(e.target.value)}
                disabled={!selectedWeather}
              />
              <TextFieldLabel>
                날씨를 좋아해요.
              </TextFieldLabel>
            </TextField>
          </div>

          {/* 두 번째 날씨 선택 (90% 단계) */}
          {isFirstStepComplete && (
            <div style={{ marginTop: '20px' }}>
              <DropdownContainer>
                <DropdownButton onClick={() => setIsSecondDropdownOpen(!isSecondDropdownOpen)}>
                  {selectedSecondWeather || '계절'}
                  <ChevronDown size={16} className={isSecondDropdownOpen ? 'rotate-180' : ''} />
                </DropdownButton>
                <DropdownLabel>
                  을(를) 가장 싫어하고,
                </DropdownLabel>
                
                {isSecondDropdownOpen && (
                  <DropdownList>
                    {seasonOptions.map((season) => (
                      <DropdownItem
                        key={season}
                        onClick={() => handleSecondWeatherSelect(season)}
                      >
                        {season}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                )}
              </DropdownContainer>

              <TextField>
                <TextFieldInput
                  type="text"
                  placeholder="맑고 쌀쌀한"
                  value={secondWeatherText}
                  onChange={(e) => setSecondWeatherText(e.target.value)}
                  disabled={!selectedSecondWeather}
                />
                <TextFieldLabel>
                  날씨를 싫어해요.
                </TextFieldLabel>
              </TextField>
            </div>
          )}
          
          {showNextButton && (
            <ButtonContainer>
              <BottomButton 
                onClick={handleNext}
                disabled={isNextDisabled}
              >
                {isLastStep ? '저장하기' : '다음'}
              </BottomButton>
              <CancelButton onClick={handleBack}>
                취소
              </CancelButton>
            </ButtonContainer>
          )}
        </CardContent>
      </CardWrapper>
    </Container>
  );
};

export default OnboardingFlow;