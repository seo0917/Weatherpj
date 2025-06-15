import React, { useState } from 'react';
import styled from 'styled-components';

const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  height: 400px;
`;

const ImageItem = styled.div`
  background: ${props => props.bg || '#e0e0e0'};
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 3px solid transparent;
  
  &.large {
    grid-row: span 2;
  }
  
  &.selected {
    border-color: #5a9fd4;
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(90, 159, 212, 0.3);
  }
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
`;

const SelectionIndicator = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: #5a9fd4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  opacity: ${props => props.selected ? 1 : 0};
  transition: opacity 0.2s ease;
`;

const WeatherLabel = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
`;

const ImageGallery = ({ onSelectionChange }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const weatherImages = [
    { 
      id: 1, 
      bg: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', 
      label: '맑음',
      large: false 
    },
    { 
      id: 2, 
      bg: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)', 
      label: '흐림',
      large: false 
    },
    { 
      id: 3, 
      bg: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)', 
      label: '비',
      large: true 
    },
    { 
      id: 4, 
      bg: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)', 
      label: '눈',
      large: false 
    },
    { 
      id: 5, 
      bg: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)', 
      label: '안개',
      large: false 
    },
    { 
      id: 6, 
      bg: 'linear-gradient(135deg, #55a3ff 0%, #003d82 100%)', 
      label: '천둥번개',
      large: false 
    }
  ];

  const handleImageClick = (id) => {
    setSelectedItems(prev => {
      const newSelectedItems = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      
      if (onSelectionChange) {
        onSelectionChange(newSelectedItems.length);
      }
      
      return newSelectedItems;
    });
  };

  return (
    <GalleryContainer>
      {weatherImages.map(image => (
        <ImageItem
          key={image.id}
          bg={image.bg}
          className={`${image.large ? 'large' : ''} ${selectedItems.includes(image.id) ? 'selected' : ''}`}
          onClick={() => handleImageClick(image.id)}
        >
          <WeatherLabel>{image.label}</WeatherLabel>
          <SelectionIndicator selected={selectedItems.includes(image.id)}>
            ✓
          </SelectionIndicator>
        </ImageItem>
      ))}
    </GalleryContainer>
  );
};

export default ImageGallery;