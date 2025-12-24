import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScoreDisplayProps {
  distance: number;
  scale: number;
}

export const ScoreDisplay = memo(({ distance, scale }: ScoreDisplayProps) => {
  const fontSize = Math.max(12, 16 * scale);
  const padding = Math.max(4, 8 * scale);
  const margin = Math.max(4, 8 * scale);

  return (
    <View
      style={[
        styles.container,
        {
          top: margin,
          left: margin,
          paddingVertical: padding / 2,
          paddingHorizontal: padding,
        }
      ]}
    >
      <Text style={{ fontSize, color: '#000' }}>
        Distance: {distance}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    zIndex: 20,
  },
});
