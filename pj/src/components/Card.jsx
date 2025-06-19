import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SearchBar from './SearchBar.jsx';
import ProgressBar from './ProgressBar.jsx';
import photo from '../assets/photo.svg';

const CardWrapper = styled.div`
  background: white;
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

const CardTitle = styled.h3`
  color: color(display-p3 0.0784 0.0784 0.0784);
  font-family: Pretendard;
  font-size: 26px;
  font-style: normal;
  font-weight: 600;
  line-height: 132%;
  letter-spacing: -0.84px;
  leading-trim: both;
  text-edge: cap;
  margin: 0 0 16px 0;
`;

const CardContent = styled.div`
  flex: 1;
  padding: 20px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
`;

const ContentText = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

const GallerySection = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  color: #888;
  margin: 0 0 12px 0;
  font-weight: 500;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: rgba(42, 42, 42, 0.81);
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  color: white;
  max-width: 280px;
`;

const ModalIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(42, 42, 42, 0.81);
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const ModalText = styled.div`
  margin-bottom: 20px;
  
  .main-text {
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  .sub-text {
    font-size: 14px;
    color: #ccc;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  
  button {
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    leading-trim: both;
    text-edge: cap;
    font-family: Pretendard;
    font-style: normal;
    font-weight: 600;
    line-height: 155%; /* 24.8px */
    letter-spacing: -0.48px;

    
    &.primary {
      background: rgba(42, 42, 42, 0.81);
      color: white;
    }
    
    &.secondary {
      background: rgba(42, 42, 42, 0.81);
      color: white;
    }
  }
`;

const SearchBarWrapper = styled.div`
  width: 100%;
  position: static;
  margin: 0;
  padding: 0;
`;

const ImageUploadButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #F5F5F5;
  color: #666;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 16px;
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const SelectedImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
`;

const SelectedImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
`;

const SelectedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const Card = ({ onSearchFocus }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.slice(0, 10 - selectedImages.length);
    
    newImages.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (id) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleUploadClick = () => {
    if (selectedImages.length >= 10) {
      alert('최대 10개의 이미지만 선택할 수 있습니다.');
      return;
    }
    setShowModal(true);
  };

  const handleSearchSubmit = () => {
    if (selectedImages.length === 0) {
      alert('최소 1개 이상의 이미지를 선택해주세요.');
      return;
    }
    navigate('/onboarding');
  };

  return (
    <>
      <CardWrapper>
        <CardHeader>
          <ProgressBar percentage={60} text="60%" />
          <CardTitle>
            거의 다 왔어요! 영이님이 좋아하는<br />
            날씨를 알려주세요.
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ContentText>
            최대 10개까지 등록할 수 있어요.
          </ContentText>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            multiple
            style={{ display: 'none' }}
          />
          
          <ImageUploadButton 
            onClick={handleUploadClick}
            disabled={selectedImages.length >= 10}
          >
            사진 선택하기 ({selectedImages.length}/10)
          </ImageUploadButton>
          
          <SelectedImagesGrid>
            {selectedImages.map(image => (
              <SelectedImageWrapper key={image.id}>
                <SelectedImage src={image.url} alt="Selected" />
                <RemoveButton onClick={() => handleRemoveImage(image.id)}>
                  ×
                </RemoveButton>
              </SelectedImageWrapper>
            ))}
          </SelectedImagesGrid>
          
          <SearchBarWrapper>
            <SearchBar 
              onFocus={onSearchFocus}
              onSubmit={handleSearchSubmit}
              selectedCount={selectedImages.length} />
          </SearchBarWrapper>
        </CardContent>
      </CardWrapper>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalIcon>
              <img src={photo} alt="photo" />
            </ModalIcon>
            <ModalText>
              <div className="main-text">
              <span style={{fontWeight:650}}>기분청</span>에서 기기의 사진에<br />
              액세스 하도록 허용하시겠습니까?
              </div>
            </ModalText>
            <ModalButtons>
              <button className="primary" onClick={() => {
                setShowModal(false);
                fileInputRef.current.click();
              }}>사진 선택</button>
              <button className="secondary" onClick={() => setShowModal(false)}>허용 안함</button>
            </ModalButtons>
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
};

export default Card;