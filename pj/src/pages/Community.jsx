import React, { useRef } from 'react';
import styled from 'styled-components';
import photoinput from '../assets/photoinput.svg';
import Navbar from '../components/Navbar';

const cardData = [
  {
    id: 'card1',
    img: photoinput,
    bg: '#b7d8ce',
    date: '2025.05.13',
    title: '비가 오기 직전의 고요함을 즐길 때',
    tags: ['차분한', '조용한'],
    location: '안산시 상록구 | 흐림',
    likes: 41,
  },
  {
    id: 'card2',
    img: photoinput,
    bg: '#f7e6c7',
    date: '2025.05.14',
    title: '햇살이 좋은 날의 산책',
    tags: ['따뜻한', '산뜻한'],
    location: '안산시 단원구 | 맑음',
    likes: 27,
  },
  {
    id: 'card3',
    img: photoinput,
    bg: '#e6d7f7',
    date: '2025.05.15',
    title: '카페에서의 여유',
    tags: ['여유', '포근함'],
    location: '안산시 고잔동 | 맑음',
    likes: 33,
  },
];

const Container = styled.div`
  width: 440px;
  height: 956px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
`;

const CarouselWrapper = styled.div`
  width: 440px;
  height: 452px;
  overflow: hidden;
  position: relative;
  margin: 40px auto 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 800px;
`;

const getCardPosition = (idx, current, length) => {
  if (idx === current) return 'active';
  if (idx === (current + 1) % length) return 'right';
  if (idx === (current - 1 + length) % length) return 'left';
  return '';
};

const CardList = styled.div`
  position: relative;
  width: 323px;
  height: 452px;
`;

const Card = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 323px;
  height: 452px;
  border-radius: 24px;
  background: ${({ bg }) => bg || '#b7d8ce'};
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0;
  transition: box-shadow 0.3s, background 0.3s, transform 0.5s cubic-bezier(.4,1.3,.5,1), opacity 0.5s, z-index 0.5s;
  overflow: hidden;
  transform-origin: center center;
`;

const CardImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 25px 25px 0 0;
`;

const CardContent = styled.div`
  flex: 1;
  padding: 20px 20px 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  color: #b7d8ce;
  cursor: pointer;
  padding: 0 12px;
  user-select: none;
  &:hover { color: #2ad1be; }
`;

const DateText = styled.div`
  font-size: 13px;
  color: #555;
  margin-bottom: 6px;
  margin-top: 2px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin-bottom: 10px;
  text-align: left;
  width: 100%;
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const Tag = styled.div`
  border-radius: 16px;
  border: 1px solid #6ed1b7;
  background: #e6f7f1;
  color: #2ad1be;
  font-size: 13px;
  padding: 2px 12px;
  font-weight: 500;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 8px;
`;

const Location = styled.div`
  font-size: 13px;
  color: #555;
`;

const Heart = styled.span`
  color: #ff5e5e;
  font-size: 18px;
  margin-left: 6px;
  vertical-align: middle;
`;

const LikeCount = styled.span`
  color: #ff5e5e;
  font-size: 15px;
  margin-left: 2px;
`;

const IndicatorRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
  gap: 6px;
`;

const IndicatorDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ active }) => (active ? '#2ad1be' : '#d0e6e0')};
`;

const cardWidth = 323;

export default function Community() {
  const [current, setCurrent] = React.useState(0);
  const CAROUSEL_LENGTH = cardData.length - 1;
  const $carousel = useRef();
  const startX = React.useRef(null);

  const nextEvent = () => {
    setCurrent(prev => (prev === CAROUSEL_LENGTH ? 0 : prev + 1));
  };
  const prevEvent = () => {
    setCurrent(prev => (prev === 0 ? CAROUSEL_LENGTH : prev - 1));
  };

  // 마우스 드래그
  const handleMouseDown = (e) => {
    startX.current = e.clientX;
  };
  const handleMouseUp = (e) => {
    if (startX.current === null) return;
    const diff = e.clientX - startX.current;
    if (diff > 50) prevEvent();
    else if (diff < -50) nextEvent();
    startX.current = null;
  };

  // 터치 스와이프
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (startX.current === null) return;
    const diff = e.changedTouches[0].clientX - startX.current;
    if (diff > 50) prevEvent();
    else if (diff < -50) nextEvent();
    startX.current = null;
  };

  React.useEffect(() => {
    if ($carousel.current) {
      $carousel.current.style.transform = `translateX(${current * -cardWidth}px)`;
      $carousel.current.style.transition = 'transform 0.5s cubic-bezier(.4,1.3,.5,1)';
    }
  }, [current]);

  return (
    <Container>
      <div style={{width: '100%', maxWidth: 440, margin: '0 auto'}}>
        <div style={{color:'#888', fontSize:13, marginBottom:8}}>
          학연산클러스터지원센터 5층<br/>
          경기 안산시 상록구 한양대학로 55
        </div>
        <div style={{fontSize:26, fontWeight:700, color:'#141414', lineHeight:1.3, marginBottom:6}}>
          영이님과 비슷한 감정인 유저<br/>329명이 방문한 장소에요.
        </div>
        <div style={{color:'#555', fontSize:15, marginBottom:12}}>
          영이님의 경험도 공유해주세요!
        </div>
        <div style={{display:'flex', justifyContent:'flex-end', marginBottom:10}}>
          <button style={{background:'#fff', border:'none', borderRadius:18, padding:'7px 18px', fontSize:16, color:'#888', fontWeight:500, boxShadow:'0 1px 4px 0 rgba(0,0,0,0.04)', cursor:'pointer'}}>인기순 ▼</button>
        </div>
      </div>
      <CarouselWrapper
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ userSelect: 'none', touchAction: 'pan-y' }}
      >
        <ArrowButton onClick={prevEvent} aria-label="이전">&lt;</ArrowButton>
        <CardList>
          {cardData.map((card, idx) => {
            const pos = getCardPosition(idx, current, cardData.length);
            let style = {};
            if (pos === 'active') {
              style = {
                zIndex: 3,
                opacity: 1,
                pointerEvents: 'auto',
                transform: 'translateX(-50%) scale(1) rotateY(0deg)',
              };
            } else if (pos === 'left') {
              style = {
                zIndex: 2,
                opacity: 0.8,
                pointerEvents: 'auto',
                transform: 'translateX(0%) scale(0.85) rotateY(-40deg)',
              };
            } else if (pos === 'right') {
              style = {
                zIndex: 2,
                opacity: 0.8,
                pointerEvents: 'auto',
                transform: 'translateX(-100%) scale(0.85) rotateY(40deg)',
              };
            } else {
              style = {
                zIndex: 1,
                opacity: 0,
                pointerEvents: 'none',
                transform: 'translateX(-50%) scale(0.7) rotateY(0deg)',
              };
            }
            return (
              <Card key={card.id} bg={card.bg} style={style}>
                <CardImage src={card.img} alt={card.id} />
                <CardContent>
                  <DateText>{card.date}</DateText>
                  <Title>{card.title}</Title>
                  <TagRow>
                    {card.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                  </TagRow>
                  <InfoRow>
                    <Location>{card.location}</Location>
                    <div><LikeCount>{card.likes}</LikeCount><Heart>♥</Heart></div>
                  </InfoRow>
                </CardContent>
              </Card>
            );
          })}
        </CardList>
        <ArrowButton onClick={nextEvent} aria-label="다음">&gt;</ArrowButton>
      </CarouselWrapper>
      <IndicatorRow>
        {cardData.map((_, idx) => (
          <IndicatorDot key={idx} active={idx === current} />
        ))}
      </IndicatorRow>
      <Navbar />
    </Container>
  );
}
