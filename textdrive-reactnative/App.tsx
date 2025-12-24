import { useState, useCallback, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createInitialGameState } from './src/gameLogic';
import type { GameState } from './src/gameLogic';
import { useResponsiveScale } from './src/hooks/useResponsiveScale';
import { useGameLoop } from './src/hooks/useGameLoop';
import { useTouchControls } from './src/hooks/useTouchControls';
import { GameScreen } from './src/components/GameScreen';
import { GameOverScreen } from './src/components/GameOverScreen';
import { ControlButtons } from './src/components/ControlButtons';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialState = createInitialGameState();
    initialState.courseRows = [];
    return initialState;
  });

  // Get responsive scale
  const { scale, availableWidth, availableHeight } = useResponsiveScale();

  const handleRestart = useCallback(() => {
    const newState = createInitialGameState();
    newState.courseRows = [];
    setGameState(newState);
  }, []);

  // Touch control management
  const { keysRef: touchKeysRef, pressLeft, pressRight } = useTouchControls();

  // Combined input ref
  const combinedKeysRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    Object.assign(combinedKeysRef.current, touchKeysRef.current);
  });

  // Game loop
  useGameLoop(gameState, setGameState, combinedKeysRef);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View
            style={[
              styles.gameContainer,
              {
                width: availableWidth,
                height: availableHeight,
              }
            ]}
          >
            {!gameState.gameOver ? (
              <GameScreen
                courseRows={gameState.courseRows}
                playerX={gameState.playerX}
                playerRow={gameState.playerRow}
                distance={gameState.scrollOffset}
                scale={scale}
              />
            ) : (
              <GameOverScreen
                distance={gameState.scrollOffset}
                onRestart={handleRestart}
                scale={scale}
              />
            )}
          </View>

          <ControlButtons
            onLeftPress={pressLeft}
            onRightPress={pressRight}
            scale={scale}
            maxWidth={availableWidth}
          />

          <StatusBar style="auto" />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  gameContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  },
});
