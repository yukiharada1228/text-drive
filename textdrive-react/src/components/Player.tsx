import { memo, useMemo } from 'react';
import { CONFIG } from '../gameLogic';

interface PlayerProps {
  x: number;
  row: number;
  scale: number;
}

export const Player = memo(({ x, row, scale }: PlayerProps) => {
  const cellSize = CONFIG.CELL_SIZE * scale;
  const fontSize = Math.max(12, 24 * scale); // Set minimum font size

  // Memoize player style
  const playerStyle = useMemo(() => ({
    left: `${x * cellSize}px`,
    top: `${row * cellSize}px`,
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    fontSize: `${fontSize}px`,
  }), [x, row, cellSize, fontSize]);

  return (
    <div
      className="absolute flex items-center justify-center font-mono text-black z-10"
      style={playerStyle}
    >
      車
    </div>
  );
});
