import { memo, useMemo } from 'react';
import { CONFIG } from '../gameLogic';

interface CourseRowProps {
  row: string[];
  rowIndex: number;
  scale: number;
}

export const CourseRow = memo(({ row, rowIndex, scale }: CourseRowProps) => {
  const cellSize = CONFIG.CELL_SIZE * scale;
  const fontSize = Math.max(16, 40 * scale); // 最小フォントサイズを設定

  // セル要素をメモ化
  const cells = useMemo(() =>
    row.map((char, colIndex) => (
      <div
        key={`${rowIndex}-${colIndex}`}
        className="bg-white flex items-center justify-center font-mono"
        style={{
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          fontSize: `${fontSize}px`,
          color: char === "■" ? '#000' : '#fff',
        }}
      >
        {char === "■" ? "■" : "　"}
      </div>
    )), [row, rowIndex, cellSize, fontSize]
  );

  // 行のスタイルをメモ化
  const rowStyle = useMemo(() => ({
    top: `${rowIndex * cellSize}px`,
    height: `${cellSize}px`,
  }), [rowIndex, cellSize]);

  return (
    <div
      className="absolute left-0 w-full flex"
      style={rowStyle}
    >
      {cells}
    </div>
  );
});
