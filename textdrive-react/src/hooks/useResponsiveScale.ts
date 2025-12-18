import { useState, useEffect } from 'react';
import { CONFIG } from '../gameLogic';

export const useResponsiveScale = () => {
  const [scale, setScale] = useState(1);
  const [availableWidth, setAvailableWidth] = useState(CONFIG.SCREEN_WIDTH);
  const [availableHeight, setAvailableHeight] = useState(CONFIG.SCREEN_HEIGHT);

  useEffect(() => {
    const updateScale = () => {
      // パディングとボタンエリアを考慮した利用可能な領域を計算
      // p-2.5 = 10px, さらにマージンを考慮
      const horizontalPadding = 20;
      const buttonAreaHeight = 120; // ボタンエリアの高さ（余裕を持たせる）

      const maxWidth = Math.max(200, window.innerWidth - horizontalPadding);
      const maxHeight = Math.max(300, window.innerHeight - horizontalPadding - buttonAreaHeight);

      // アスペクト比を維持しながらスケールを計算
      const widthScale = maxWidth / CONFIG.SCREEN_WIDTH;
      const heightScale = maxHeight / CONFIG.SCREEN_HEIGHT;
      // 小さい方のスケールを使用（画面に収まるように）
      const newScale = Math.min(widthScale, heightScale);

      // 最小スケールと最大スケールを設定
      // 最小0.5倍（極端に小さくならないように）
      // 最大2.5倍（極端に大きくなりすぎないように）
      const finalScale = Math.max(0.5, Math.min(2.5, newScale));

      setScale(finalScale);
      setAvailableWidth(CONFIG.SCREEN_WIDTH * finalScale);
      setAvailableHeight(CONFIG.SCREEN_HEIGHT * finalScale);
    };

    updateScale();

    // リサイズイベントに少し遅延を入れて、リサイズ完了後に計算
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(updateScale, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      window.setTimeout(updateScale, 200); // オリエンテーション変更後は少し長めに待つ
    });

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, []);

  return { scale, availableWidth, availableHeight };
};
