import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
    <View
      style={[
        styles.container,
        {
          maxWidth,
          marginTop: margin,
          paddingLeft: padding,
          paddingRight: padding,
        }
      ]}
    >
      <TouchableOpacity
        onPress={onLeftPress}
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
          }
        ]}
      >
        <Text style={{ fontSize, color: '#fff' }}>←</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onRightPress}
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
          }
        ]}
      >
        <Text style={{ fontSize, color: '#fff' }}>→</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
