import React, { useState } from 'react';
import styled from 'styled-components';
import searchicon from '../assets/searchicon.svg';

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  background: none;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 276px;
  height: 40px;
  flex-shrink: 0;
  padding: 10px 40px 10px 15px;
  border-radius: 54px;
  border: 0.7px solid #CCC;
  border: 0.7px solid color(display-p3 0.7987 0.7987 0.7987);
  background: rgba(131, 131, 131, 0.30);
  background: color(display-p3 0.5149 0.5149 0.5149 / 0.30);
  backdrop-filter: blur(12.699999809265137px);
  font-size: 18px;
  outline: none;
  color: white;
  
  &:focus {
    border-color: #CCC;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #1D1D1D;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  backdrop-filter: blur(12.7px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const SubmitButton = styled.button`
  padding: 8px 10px;
  height: 40px;
  border: none;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  color: #1D1D1D;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(12.7px);
  white-space: nowrap;
  margin-left: auto;
  margin-right: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(29, 29, 29, 0.5);
    cursor: not-allowed;
  }
`;

const SearchBar = ({ onFocus, onSubmit, selectedCount }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleFocus = () => {
    if (onFocus) onFocus();
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(searchValue.trim());
    }
  };

  const isDisabled = selectedCount < 1 || selectedCount > 10;

  return (
    <SearchContainer>
      <SearchInputWrapper>
        <SearchInput
          type="text"
          placeholder="날씨를 입력해 보세요."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={handleFocus}
        />
        <SearchButton type="button">
          <img src={searchicon} alt="search" />
        </SearchButton>
      </SearchInputWrapper>
      <SubmitButton onClick={handleSubmit} disabled={isDisabled}>
        다음
      </SubmitButton>
    </SearchContainer>
  );
};

export default SearchBar;