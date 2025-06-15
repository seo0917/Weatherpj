import React, { useState } from 'react';
import styled from 'styled-components';

const KeyboardContainer = styled.div`
  background: #3d3d3d;
  border-radius: 12px;
  padding: 16px;
  width: 300px;
  height: fit-content;
  align-self: flex-start;
  margin-top: 60px;
`;

const KeyboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  background: #2d2d2d;
  border: 1px solid #555;
  border-radius: 20px;
  padding: 8px 12px;
  color: white;
  font-size: 14px;
  width: 180px;
  outline: none;
  
  &::placeholder {
    color: #999;
  }
`;

const CloseButton = styled.button`
  background: #666;
  border: none;
  border-radius: 4px;
  color: white;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background: #777;
  }
`;

const KeyboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
  margin-bottom: 8px;
`;

const KeyboardRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.cols || 10}, 1fr);
  gap: 4px;
  margin-bottom: 4px;
`;

const Key = styled.button`
  background: #4a4a4a;
  border: none;
  border-radius: 4px;
  color: white;
  padding: 8px 4px;
  font-size: 12px;
  cursor: pointer;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #555;
  }
  
  &:active {
    background: #333;
  }
  
  &.special {
    background: #555;
    font-size: 10px;
  }
  
  &.space {
    grid-column: span 6;
  }
`;

const BottomRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const VirtualKeyboard = ({ onClose, activeCard }) => {
  const [inputValue, setInputValue] = useState('');
  const [isShift, setIsShift] = useState(false);

  const qwertyKeys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const handleKeyPress = (key) => {
    if (key === 'Shift') {
      setIsShift(!isShift);
    } else if (key === 'Space') {
      setInputValue(prev => prev + ' ');
    } else if (key === 'Backspace') {
      setInputValue(prev => prev.slice(0, -1));
    } else if (key === 'Enter') {
      console.log('입력값:', inputValue);
      onClose();
    } else {
      const finalKey = isShift ? key.toUpperCase() : key.toLowerCase();
      setInputValue(prev => prev + finalKey);
    }
  };

  return (
    <KeyboardContainer>
      <KeyboardHeader>
        <SearchInput 
          type="text" 
          placeholder="날씨를 입력해 보세요."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </KeyboardHeader>

      <KeyboardRow cols={10}>
        {qwertyKeys[0].map(key => (
          <Key key={key} onClick={() => handleKeyPress(key)}>
            {isShift ? key : key.toLowerCase()}
          </Key>
        ))}
      </KeyboardRow>

      <KeyboardRow cols={9}>
        {qwertyKeys[1].map(key => (
          <Key key={key} onClick={() => handleKeyPress(key)}>
            {isShift ? key : key.toLowerCase()}
          </Key>
        ))}
      </KeyboardRow>

      <KeyboardRow cols={7}>
        {qwertyKeys[2].map(key => (
          <Key key={key} onClick={() => handleKeyPress(key)}>
            {isShift ? key : key.toLowerCase()}
          </Key>
        ))}
      </KeyboardRow>

      <KeyboardRow cols={10}>
        <Key className="special" onClick={() => handleKeyPress('Shift')}>
          ⇧
        </Key>
        <Key className="special">123</Key>
        <Key className="space" onClick={() => handleKeyPress('Space')}>
          space
        </Key>
        <Key className="special" onClick={() => handleKeyPress('Enter')}>
          Enter
        </Key>
      </KeyboardRow>

      <BottomRow>
        <Key style={{ width: '32px', height: '32px', borderRadius: '50%' }}>
          😊
        </Key>
        <Key style={{ width: '32px', height: '32px', borderRadius: '50%' }}>
          🎤
        </Key>
        <div style={{ marginLeft: 'auto', color: '#999', fontSize: '12px' }}>
          한/A
        </div>
      </BottomRow>
    </KeyboardContainer>
  );
};

export default VirtualKeyboard;