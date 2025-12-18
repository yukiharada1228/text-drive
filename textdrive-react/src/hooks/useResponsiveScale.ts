import { useState, useEffect } from 'react';
import { CONFIG } from '../gameLogic';

export const useResponsiveScale = () => {
  const [scale, setScale] = useState(1);
  const [availableWidth, setAvailableWidth] = useState(CONFIG.SCREEN_WIDTH);
  const [availableHeight, setAvailableHeight] = useState(CONFIG.SCREEN_HEIGHT);

  useEffect(() => {
    const updateScale = () => {
      // Calculate available area considering padding and button area
      // p-2.5 = 10px, plus additional margin
      const horizontalPadding = 20;
      const buttonAreaHeight = 120; // Button area height (with margin)

      const maxWidth = Math.max(200, window.innerWidth - horizontalPadding);
      const maxHeight = Math.max(300, window.innerHeight - horizontalPadding - buttonAreaHeight);

      // Calculate scale while maintaining aspect ratio
      const widthScale = maxWidth / CONFIG.SCREEN_WIDTH;
      const heightScale = maxHeight / CONFIG.SCREEN_HEIGHT;
      // Use the smaller scale to fit on screen
      const newScale = Math.min(widthScale, heightScale);

      // Set minimum and maximum scale
      // Minimum 0.5x (prevent too small)
      // Maximum 2.5x (prevent too large)
      const finalScale = Math.max(0.5, Math.min(2.5, newScale));

      setScale(finalScale);
      setAvailableWidth(CONFIG.SCREEN_WIDTH * finalScale);
      setAvailableHeight(CONFIG.SCREEN_HEIGHT * finalScale);
    };

    updateScale();

    // Add delay to resize event to calculate after resize is complete
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(updateScale, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      window.setTimeout(updateScale, 200); // Wait a bit longer after orientation change
    });

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, []);

  return { scale, availableWidth, availableHeight };
};
