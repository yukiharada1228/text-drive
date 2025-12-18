import { memo } from 'react';

interface ControlButtonsProps {
  onLeftPress: () => void;
  onRightPress: () => void;
  scale: number;
  maxWidth: number;
}

export const ControlButtons = memo(({
  onLeftPress,
  onRightPress,
  scale,
  maxWidth
}: ControlButtonsProps) => {
  const buttonSize = Math.max(40, 60 * scale);
  const fontSize = Math.max(16, 24 * scale);
  const margin = Math.max(8, 20 * scale);
  const padding = Math.max(8, 20 * scale);

  return (
    <div
      className="flex justify-between items-center w-full mb-5"
      style={{
        maxWidth: `${maxWidth}px`,
        marginTop: `${margin}px`,
        paddingLeft: `${padding}px`,
        paddingRight: `${padding}px`,
      }}
    >
      <button
        onClick={onLeftPress}
        className="bg-black text-white border-none rounded-full font-mono cursor-pointer flex items-center justify-center flex-shrink-0 hover:bg-gray-800 transition-colors active:scale-95"
        style={{
          width: `${buttonSize}px`,
          height: `${buttonSize}px`,
          fontSize: `${fontSize}px`,
        }}
      >
        ←
      </button>
      <button
        onClick={onRightPress}
        className="bg-black text-white border-none rounded-full font-mono cursor-pointer flex items-center justify-center flex-shrink-0 hover:bg-gray-800 transition-colors active:scale-95"
        style={{
          width: `${buttonSize}px`,
          height: `${buttonSize}px`,
          fontSize: `${fontSize}px`,
        }}
      >
        →
      </button>
    </div>
  );
});
