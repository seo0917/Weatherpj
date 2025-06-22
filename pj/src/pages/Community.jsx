import React, { useRef } from 'react';
import styled from 'styled-components';
import photoinput from '../assets/photoinput.svg';
import backbutton from '../assets/backbutton.svg'
import dropbtn from '../assets/dropbtn.svg'
import Navbar from '../components/Navbar';
import WriteButton from '../components/WriteButton';
import { useNavigate } from 'react-router-dom';

const cardData = [
  {
    id: 'card1',
    img: photoinput,
    bg: '#b7d8ce',
    date: '2025.05.13',
    title: '아직 등록 된 장소가 없어요!',
    tags: ['차분한', '조용한'],
    location: '안산시 상록구 | 흐림',
    likes: 41,
  },
  {
    id: 'card2',
    img: photoinput,
    bg: '#f7e6c7',
    date: '2025.05.14',
    title: '아직 등록 된 장소가 없어요!',
    tags: ['따뜻한', '산뜻한'],
    location: '안산시 단원구 | 맑음',
    likes: 27,
  },
  {
    id: 'card3',
    img: photoinput,
    bg: '#e6d7f7',
    date: '2025.05.15',
    title: '아직 등록 된 장소가 없어요!',
    tags: ['여유', '포근함'],
    location: '안산시 고잔동 | 맑음',
    likes: 33,
  },
];

const Container = styled.div`
  width: 440px;
  height: 956px;
  position: relative;
  background: #FCFCFC;
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
  perspective: 1400px;
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
  border-radius: 25px;
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
  width: 90%;
  height: 300px;
  object-fit: cover;
  border-radius: 25px;
  margin-top: 5%;
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 90%;
  margin-left: 2%;
  margin-bottom: 3%;
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
  margin: 5px 0 10px 0;
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
  align-items: center;
  margin-top: 12px;
  gap: 6px;
  width: 100%;
`;

const IndicatorDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ active }) => (active ? '#B1B1B1' : '#F0F0F0')};
`;

const cardWidth = 323;

const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  margin-right: 10px;
`;

const DropdownButton = styled.button`
  min-width: 112px;
  height: 40px;
  padding: 0 24px;
  background: #F0F0F0;
  border: none;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 400;
  color: #B1B1B1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const DropdownList = styled.div`
  position: absolute;
  top: 110%;
  right: 0;
  background: #F0F0F0;
  border-radius: 22px;
  min-width: 112px;
  z-index: 10;
  padding: 8px 0;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 24px;
  background: none;
  border: none;
  text-align: left;
  font-size: 16px;
  color: #B1B1B1;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    background: #e8e8e8;
  }
`;

export default function Community() {
  const [current, setCurrent] = React.useState(0);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [sort, setSort] = React.useState('인기순');
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [currentX, setCurrentX] = React.useState(0);
  const [cardImage, setCardImage] = React.useState(null);
  const [placeKeyword, setPlaceKeyword] = React.useState('');
  const [cardBg, setCardBg] = React.useState(null);
  const [placeText, setPlaceText] = React.useState('');
  const CAROUSEL_LENGTH = cardData.length - 1;
  const $carousel = useRef();
  const navigate = useNavigate();
  const sortOptions = ['인기순', '최신순'];

  React.useEffect(() => {
    const img = localStorage.getItem('communityCardImage');
    if (img) setCardImage(img);
    const keyword = localStorage.getItem('placeKeyword');
    if (keyword) setPlaceKeyword(keyword);
    const bg = localStorage.getItem('communityCardBg');
    if (bg) setCardBg(bg);
    const text = localStorage.getItem('placeText');
    if (text) setPlaceText(text);
  }, []);

  const nextEvent = () => {
    if (current !== CAROUSEL_LENGTH) {
      setCurrent(prev => prev + 1);
    } else {
      setCurrent(0);
    }
  };

  const prevEvent = () => {
    if (current !== 0) {
      setCurrent(prev => prev - 1);
    } else {
      setCurrent(CAROUSEL_LENGTH);
    }
  };

  // 마우스 이벤트 핸들러
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50; // 드래그 임계값
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextEvent(); // 왼쪽으로 드래그하면 다음 카드
      } else {
        prevEvent(); // 오른쪽으로 드래그하면 이전 카드
      }
    }
    
    setIsDragging(false);
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50; // 드래그 임계값
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextEvent(); // 왼쪽으로 드래그하면 다음 카드
      } else {
        prevEvent(); // 오른쪽으로 드래그하면 이전 카드
      }
    }
    
    setIsDragging(false);
  };

  React.useEffect(() => {
    if ($carousel.current) {
      $carousel.current.style.transform = `translateX(${current * -cardWidth}px)`;
      $carousel.current.style.transition = 'transform 0.5s cubic-bezier(.4,1.3,.5,1)';
    }
  }, [current]);

  return (
    <Container>
      <div style={{ position: 'relative', width: '100%', maxWidth: 440, marginRight: -24, display: 'flex', alignItems: 'flex-start' }}>
        <img src={backbutton} alt="back" style={{width:10, height:20, marginRight:12, marginTop:4, flexShrink:0, cursor:'pointer', filter:'invert(62%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(90%)'}} onClick={() => navigate('/weather-map')} />
        <div style={{flex:1}}>
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
          <div style={{display:'flex', justifyContent:'flex-end', marginBottom:10, marginRight:30}}>
            <DropdownContainer>
              <DropdownButton onClick={() => setDropdownOpen(v => !v)}>
                {sort}
                <img src={dropbtn} alt="dropbtn" style={{marginLeft: 8, width: 16, height: 16}} />
              </DropdownButton>
              {dropdownOpen && (
                <DropdownList>
                  {sortOptions.map(option => (
                    <DropdownItem
                      key={option}
                      onClick={() => {
                        setSort(option);
                        setDropdownOpen(false);
                      }}
                    >
                      {option}
                    </DropdownItem>
                  ))}
                </DropdownList>
              )}
            </DropdownContainer>
          </div>
        </div>
      </div>
      <CarouselWrapper
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', position: 'relative' }}
      >
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
                transform: 'translateX(0%) scale(0.85) rotateY(60deg)',
              };
            } else if (pos === 'right') {
              style = {
                zIndex: 2,
                opacity: 0.8,
                pointerEvents: 'auto',
                transform: 'translateX(-100%) scale(0.85) rotateY(-60deg)',
              };
            } 
            return (
              <Card key={card.id} bg={idx === 0 && cardBg ? cardBg : card.bg} style={style}>
                <CardImage src={idx === 0 && cardImage ? cardImage : card.img} alt={card.id} />
                {pos === 'active' && (
                  <CardContent>
                    <DateText>{card.date}</DateText>
                    <Title>{idx === 0 && placeText ? placeText : card.title}</Title>
                    {placeKeyword && (
                      <TagRow>
                        {idx === 0
                          ? <Tag key={placeKeyword}>{placeKeyword}</Tag>
                          : card.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                      </TagRow>
                    )}
                    <InfoRow>
                      <Location>{card.location}</Location>
                      <div><LikeCount>{card.likes}</LikeCount><Heart>♥</Heart></div>
                    </InfoRow>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </CardList>
      </CarouselWrapper>
      <IndicatorRow>
        <div style={{ display: 'flex', gap: 6 }}>
          {cardData.map((_, idx) => (
            <IndicatorDot key={idx} active={idx === current} />
          ))}
        </div>
      </IndicatorRow>
      <WriteButton style={{ position: 'absolute', right: 10, bottom: 110, zIndex: 100 }} />
      <Navbar />
    </Container>
  );
}
