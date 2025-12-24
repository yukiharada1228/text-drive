import { memo, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CONFIG } from '../gameLogic';

interface PlayerProps {
  x: number;
  row: number;
  scale: number;
}

export const Player = memo(({ x, row, scale }: PlayerProps) => {
  const cellSize = CONFIG.CELL_SIZE * scale;
  const fontSize = Math.max(12, 24 * scale);

  // Memoize player style
  const playerStyle = useMemo(() => ({
    left: x * cellSize,
    top: row * cellSize,
    width: cellSize,
    height: cellSize,
    fontSize,
  }), [x, row, cellSize, fontSize]);

  return (
    <View style={[styles.player, playerStyle]}>
      <Text style={{ fontSize: playerStyle.fontSize, color: '#000' }}>
        車
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  player: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
