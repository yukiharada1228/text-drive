import { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CONFIG } from '../gameLogic';

interface CourseRowProps {
  row: string[];
  rowIndex: number;
  scale: number;
}

export const CourseRow = memo(({ row, rowIndex, scale }: CourseRowProps) => {
  const cellSize = CONFIG.CELL_SIZE * scale;
  const fontSize = Math.max(16, 40 * scale);

  // Memoize cell elements
  const cells = useMemo(() =>
    row.map((char, colIndex) => (
      <View
        key={`${rowIndex}-${colIndex}`}
        style={[
          styles.cell,
          {
            width: cellSize,
            height: cellSize,
          }
        ]}
      >
        <Text
          style={{
            fontSize,
            color: char === "■" ? '#000' : '#fff',
          }}
        >
          {char === "■" ? "■" : "　"}
        </Text>
      </View>
    )), [row, rowIndex, cellSize, fontSize]
  );

  // Memoize row style
  const rowStyle = useMemo(() => ({
    top: rowIndex * cellSize,
    height: cellSize,
  }), [rowIndex, cellSize]);

  return (
    <View style={[styles.row, rowStyle]}>
      {cells}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    left: 0,
    width: '100%',
    flexDirection: 'row',
  },
  cell: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
