import { memo, useMemo } from 'react';
import { CourseRow } from './CourseRow';
import { Player } from './Player';
import { ScoreDisplay } from './ScoreDisplay';

interface GameScreenProps {
  courseRows: string[][];
  playerX: number;
  playerRow: number;
  distance: number;
  scale: number;
}

export const GameScreen = memo(({
  courseRows,
  playerX,
  playerRow,
  distance,
  scale
}: GameScreenProps) => {

  const memoizedCourseRows = useMemo(() =>
    courseRows.map((row, index) => (
      <CourseRow
        key={index}
        row={row}
        rowIndex={index}
        scale={scale}
      />
    )), [courseRows, scale]
  );

  return (
    <>
      <div className="relative w-full h-full">
        {memoizedCourseRows}
      </div>
      <Player x={playerX} row={playerRow} scale={scale} />
      <ScoreDisplay distance={distance} scale={scale} />
    </>
  );
});
