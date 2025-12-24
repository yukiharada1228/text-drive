import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
    <View style={styles.container}>
      <Text style={{ fontSize: titleFontSize, marginBottom: margin, color: '#000' }}>
        Game Over
      </Text>
      <Text style={{ fontSize: baseFontSize, marginBottom: margin, color: '#000' }}>
        Final Distance: {distance}
      </Text>
      <Text style={{ fontSize: smallFontSize, marginBottom: margin, color: '#000' }}>
        Tap to restart
      </Text>
      <TouchableOpacity
        onPress={onRestart}
        style={[
          styles.button,
          {
            paddingVertical: padding / 2,
            paddingHorizontal: padding,
          }
        ]}
      >
        <Text style={{ fontSize: baseFontSize, color: '#fff' }}>
          Restart
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 4,
  },
});
