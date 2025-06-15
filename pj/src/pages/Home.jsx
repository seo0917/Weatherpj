import styled from 'styled-components';
import bgImg from '../assets/background.png';
import locationIcon from '../assets/locationIcon.svg';

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

const InfoRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
`;

const InfoBox = styled.div`
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 11px 11px;
  color: #222;
  font-size: 14px;
  font-family: Pretendard;
  font-weight: 400;
`;

const StatusBox = styled(InfoBox)`
  color: #4ecdc4;
  background: rgba(76,205,196,0.12);
`;


const Message = styled.div`
  color: #234E83;
  font-family: Pretendard;
  font-size: 36px;
  font-weight: 250;
  line-height: 140%;
  letter-spacing: -1.08px;
  margin: 38px 0 24px 0;
  text-align: left;
  width: 100%;
`;

const WeatherSection = styled.div`
  position: absolute;
  right: 0;
  bottom: 167px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 1;
  padding-bottom: 27px;
`;

const LocationTempWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-right: 22px;
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
`;

const LocationIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 12px;
`;

const TempRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: -28px;
  margin-left: -18px;
`;

const Temp = styled.div`
  font-size: 128px;
  color: #141414;
  line-height: 135%;
  margin-bottom: -44px;
`;

const TempRange = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #113956;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 27px */
  letter-spacing: -0.6px;
  margin-top: 0;
  margin-right: 0;
`;

const MinTemp = styled.span`
  margin-right: 10px;
`;

const RangeLine = styled.span`
  width: 80px;
  height: 2px;
  background: #557CA1;
  display: block;
`;

const MaxTemp = styled.span`
  margin-left: 10px;
`;

const Location = styled.div`
  color: #113956;
  color: color(display-p3 0.1118 0.2216 0.3264);
  leading-trim: both;
  text-edge: cap;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; 
  letter-spacing: -0.48px;
`;


const BottomButton = styled.button`
  position: absolute;
  left: 50%;
  bottom: 140px;
  transform: translateX(-50%);
  width: 292px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 54px;
  background: rgba(78, 148, 232, 0.50);
  backdrop-filter: blur(2px);
  color: #FFF;
  leading-trim: both;
  text-edge: cap;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 135%; /* 21.6px */
  letter-spacing: -0.48px;
  border: none;
  cursor: pointer;
`;

export default function Home() {
  return (
    <HomeContainer>
      <CardContainer>
        <BackgroundImage bg={bgImg} />
        <Content>
          <TopText>
            햇살이 반가운 날도 있지만,<br />
            비 오는 날엔 느긋해도 괜찮아요.
          </TopText>
          <InfoRow>
            <InfoBox>25.05.15</InfoBox>
            <InfoBox>AM 11:00</InfoBox>
            <StatusBox>보통</StatusBox>
          </InfoRow>
          <Message>
            비가 먼저 나가서<br />
            기다리고 있어요.<br />
            <span style={{fontWeight:400}}>우산 꼭 챙겨서 만나요!</span>
          </Message>
          <WeatherSection>
          <LocationTempWrapper>
            <LocationRow>
              <LocationIcon src={locationIcon} />
              <Location>안산시 상록구 | 비</Location>
            </LocationRow>
            <TempRow>
              <Temp>
                17
                <span style={{
                  fontSize: 80,
                  position: 'relative',
                  top: '-34px'
                }}>°</span>
              </Temp>
              <TempRange>
                <MinTemp>16</MinTemp>
                <RangeLine />
                <MaxTemp>20</MaxTemp>
              </TempRange>
            </TempRow>
          </LocationTempWrapper>
          </WeatherSection>
          <BottomButton>
            오늘의 마음의 색상을 등록해주세요.
          </BottomButton>
        </Content>
      </CardContainer>
    </HomeContainer>
  );
}
