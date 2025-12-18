import { memo } from 'react';

interface ScoreDisplayProps {
  distance: number;
  scale: number;
}

export const ScoreDisplay = memo(({ distance, scale }: ScoreDisplayProps) => {
  const fontSize = Math.max(12, 16 * scale);
  const padding = Math.max(4, 8 * scale);
  const margin = Math.max(4, 8 * scale);

  return (
    <div
      className="absolute bg-white border border-black text-black font-mono z-20"
      style={{
        top: `${margin}px`,
        left: `${margin}px`,
        padding: `${padding / 2}px ${padding}px`,
        fontSize: `${fontSize}px`,
      }}
    >
      Distance: {distance}
    </div>
  );
});
