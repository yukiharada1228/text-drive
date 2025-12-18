import { memo } from 'react';

interface GameOverScreenProps {
  distance: number;
  onRestart: () => void;
  scale: number;
}

export const GameOverScreen = memo(({
  distance,
  onRestart,
  scale
}: GameOverScreenProps) => {
  const titleFontSize = Math.max(16, 20 * scale);
  const baseFontSize = Math.max(12, 16 * scale);
  const smallFontSize = Math.max(10, 14 * scale);
  const padding = Math.max(8, 20 * scale);
  const margin = Math.max(8, 20 * scale);

  return (
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-black font-mono z-30"
      style={{
        fontSize: `${baseFontSize}px`,
      }}
    >
      <div style={{ fontSize: `${titleFontSize}px`, marginBottom: `${margin}px` }}>Game Over</div>
      <div style={{ marginBottom: `${margin}px` }}>Final Distance: {distance}</div>
      <div style={{ fontSize: `${smallFontSize}px`, marginBottom: `${margin}px` }}>Press R to restart</div>
      <button
        onClick={onRestart}
        className="bg-black text-white border-none font-mono rounded cursor-pointer hover:bg-gray-800 transition-colors"
        style={{
          padding: `${padding / 2}px ${padding}px`,
          fontSize: `${baseFontSize}px`,
        }}
      >
        Restart
      </button>
    </div>
  );
});
