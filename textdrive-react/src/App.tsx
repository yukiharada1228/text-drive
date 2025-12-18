import { useState, useEffect, useCallback, useRef } from 'react';
import { createInitialGameState } from './gameLogic';
import type { GameState } from './gameLogic';
import { useResponsiveScale } from './hooks/useResponsiveScale';
import { useKeyboardInput } from './hooks/useKeyboardInput';
import { useGameLoop } from './hooks/useGameLoop';
import { useTouchControls } from './hooks/useTouchControls';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { ControlButtons } from './components/ControlButtons';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialState = createInitialGameState();
    initialState.courseRows = [];
    return initialState;
  });

  // レスポンシブスケールを取得
  const { scale, availableWidth, availableHeight } = useResponsiveScale();

  const handleRestart = useCallback(() => {
    const newState = createInitialGameState();
    newState.courseRows = [];
    setGameState(newState);
  }, []);

  // キーボード入力管理
  const keyboardKeysRef = useKeyboardInput(handleRestart, gameState.gameOver);

  // タッチコントロール管理
  const { keysRef: touchKeysRef, pressLeft, pressRight } = useTouchControls();

  // 両方の入力を統合
  const combinedKeysRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    Object.assign(combinedKeysRef.current, keyboardKeysRef.current, touchKeysRef.current);
  });

  // ゲームループ
  useGameLoop(gameState, setGameState, combinedKeysRef);

  return (
    <div className="flex flex-col justify-start items-center min-h-screen h-screen p-2.5 bg-white font-mono box-border">
      <div
        className="bg-white border border-black relative overflow-hidden"
        style={{
          width: `${availableWidth}px`,
          height: `${availableHeight}px`,
          maxWidth: '100%',
        }}
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
      </div>

      <ControlButtons
        onLeftPress={pressLeft}
        onRightPress={pressRight}
        scale={scale}
        maxWidth={availableWidth}
      />
    </div>
  );
}

export default App;
