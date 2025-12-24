import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { CONFIG } from '../gameLogic';

export const useResponsiveScale = () => {
  const [scale, setScale] = useState(1);
  const [availableWidth, setAvailableWidth] = useState(CONFIG.SCREEN_WIDTH);
  const [availableHeight, setAvailableHeight] = useState(CONFIG.SCREEN_HEIGHT);

  useEffect(() => {
    const updateScale = () => {
      const { width, height } = Dimensions.get('window');

      // Calculate available area considering padding and button area
      const horizontalPadding = 20;
      const buttonAreaHeight = 120; // Button area height (with margin)

      const maxWidth = Math.max(200, width - horizontalPadding);
      const maxHeight = Math.max(300, height - horizontalPadding - buttonAreaHeight);

      // Calculate scale while maintaining aspect ratio
      const widthScale = maxWidth / CONFIG.SCREEN_WIDTH;
      const heightScale = maxHeight / CONFIG.SCREEN_HEIGHT;
      // Use the smaller scale to fit on screen
      const newScale = Math.min(widthScale, heightScale);

      // Set minimum and maximum scale
      const finalScale = Math.max(0.5, Math.min(2.5, newScale));

      setScale(finalScale);
      setAvailableWidth(CONFIG.SCREEN_WIDTH * finalScale);
      setAvailableHeight(CONFIG.SCREEN_HEIGHT * finalScale);
    };

    updateScale();

    const subscription = Dimensions.addEventListener('change', updateScale);

    return () => {
      subscription?.remove();
    };
  }, []);

  return { scale, availableWidth, availableHeight };
};
