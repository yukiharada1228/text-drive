import { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
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
      <View style={styles.courseContainer}>
        {memoizedCourseRows}
      </View>
      <Player x={playerX} row={playerRow} scale={scale} />
      <ScoreDisplay distance={distance} scale={scale} />
    </>
  );
});

const styles = StyleSheet.create({
  courseContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
});
