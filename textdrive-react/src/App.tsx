import { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { createInitialGameState, updateGameState, CONFIG} from './gameLogic';
import type { GameState } from './gameLogic';

// ========================================
// カスタムフック
// ========================================

// レスポンシブスケール管理
const useResponsiveScale = () => {
  const [scale, setScale] = useState(1);
  const [availableWidth, setAvailableWidth] = useState(CONFIG.SCREEN_WIDTH);
  const [availableHeight, setAvailableHeight] = useState(CONFIG.SCREEN_HEIGHT);

  useEffect(() => {
    const updateScale = () => {
      // パディングとボタンエリアを考慮した利用可能な領域を計算
      // p-2.5 = 10px, さらにマージンを考慮
      const horizontalPadding = 20;
      const buttonAreaHeight = 120; // ボタンエリアの高さ（余裕を持たせる）
      
      const maxWidth = Math.max(200, window.innerWidth - horizontalPadding);
      const maxHeight = Math.max(300, window.innerHeight - horizontalPadding - buttonAreaHeight);
      
      // アスペクト比を維持しながらスケールを計算
      const widthScale = maxWidth / CONFIG.SCREEN_WIDTH;
      const heightScale = maxHeight / CONFIG.SCREEN_HEIGHT;
      // 小さい方のスケールを使用（画面に収まるように）
      const newScale = Math.min(widthScale, heightScale);
      
      // 最小スケールと最大スケールを設定
      // 最小0.5倍（極端に小さくならないように）
      // 最大2.5倍（極端に大きくなりすぎないように）
      const finalScale = Math.max(0.5, Math.min(2.5, newScale));
      
      setScale(finalScale);
      setAvailableWidth(CONFIG.SCREEN_WIDTH * finalScale);
      setAvailableHeight(CONFIG.SCREEN_HEIGHT * finalScale);
    };

    updateScale();
    
    // リサイズイベントに少し遅延を入れて、リサイズ完了後に計算
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(updateScale, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      window.setTimeout(updateScale, 200); // オリエンテーション変更後は少し長めに待つ
    });

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateScale);
    };
  }, []);

  return { scale, availableWidth, availableHeight };
};

// キーボード入力管理
const useKeyboardInput = (onRestart: () => void, isGameOver: boolean) => {
  const keysRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysRef.current[event.key] = true;
      
      if ((event.key === 'r' || event.key === 'R') && isGameOver) {
        onRestart();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current[event.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onRestart, isGameOver]);

  return keysRef;
};

// ゲームループ管理
const useGameLoop = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  keysRef: React.RefObject<{ [key: string]: boolean }>
) => {
  const gameStateRef = useRef<GameState>(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const gameLoop = () => {
      const currentState = gameStateRef.current;

      if (!currentState.gameOver) {
        const newState = updateGameState(currentState, keysRef.current);
        setGameState(newState);
      }

      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [setGameState, keysRef]);
};

// タッチコントロール管理
const useTouchControls = () => {
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const pressLeft = useCallback(() => {
    keysRef.current['left'] = true;
    setTimeout(() => {
      keysRef.current['left'] = false;
    }, 100);
  }, []);

  const pressRight = useCallback(() => {
    keysRef.current['right'] = true;
    setTimeout(() => {
      keysRef.current['right'] = false;
    }, 100);
  }, []);

  return { keysRef, pressLeft, pressRight };
};

// ========================================
// コンポーネント
// ========================================

// コース行コンポーネント
const CourseRow = memo(({ row, rowIndex, scale }: { row: string[], rowIndex: number, scale: number }) => {
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

// プレイヤーコンポーネント
const Player = memo(({ x, row, scale }: { x: number, row: number, scale: number }) => {
  const cellSize = CONFIG.CELL_SIZE * scale;
  const fontSize = Math.max(12, 24 * scale); // 最小フォントサイズを設定

  // プレイヤーのスタイルをメモ化
  const playerStyle = useMemo(() => ({
    left: `${x * cellSize}px`,
    top: `${row * cellSize}px`,
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    fontSize: `${fontSize}px`,
  }), [x, row, cellSize, fontSize]);

  return (
    <div
      className="absolute flex items-center justify-center font-mono text-black z-10"
      style={playerStyle}
    >
      車
    </div>
  );
});

// スコア表示コンポーネント
const ScoreDisplay = memo(({ distance, scale }: { distance: number, scale: number }) => {
  const fontSize = Math.max(12, 16 * scale);
  const padding = Math.max(4, 8 * scale);
  const margin = Math.max(4, 8 * scale);

  return (
    <div 
      className="absolute bg-white border border-black text-black font-mono z-20"
      style={{
        top: `${margin}px`,
        left: `${margin}px`,
        padding: `${padding / 2}px ${padding}px`,
        fontSize: `${fontSize}px`,
      }}
    >
      Distance: {distance}
    </div>
  );
});

// ゲームオーバー画面コンポーネント
const GameOverScreen = memo(({ 
  distance, 
  onRestart,
  scale
}: { 
  distance: number, 
  onRestart: () => void,
  scale: number
}) => {
  const titleFontSize = Math.max(16, 20 * scale);
  const baseFontSize = Math.max(12, 16 * scale);
  const smallFontSize = Math.max(10, 14 * scale);
  const padding = Math.max(8, 20 * scale);
  const margin = Math.max(8, 20 * scale);

  return (
    <div 
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-black font-mono z-30"
      style={{
        fontSize: `${baseFontSize}px`,
      }}
    >
      <div style={{ fontSize: `${titleFontSize}px`, marginBottom: `${margin}px` }}>Game Over</div>
      <div style={{ marginBottom: `${margin}px` }}>Final Distance: {distance}</div>
      <div style={{ fontSize: `${smallFontSize}px`, marginBottom: `${margin}px` }}>Press R to restart</div>
      <button
        onClick={onRestart}
        className="bg-black text-white border-none font-mono rounded cursor-pointer hover:bg-gray-800 transition-colors"
        style={{
          padding: `${padding / 2}px ${padding}px`,
          fontSize: `${baseFontSize}px`,
        }}
      >
        Restart
      </button>
    </div>
  );
});

// コントロールボタンコンポーネント
const ControlButtons = memo(({ 
  onLeftPress, 
  onRightPress,
  scale,
  maxWidth
}: { 
  onLeftPress: () => void, 
  onRightPress: () => void,
  scale: number,
  maxWidth: number
}) => {
  const buttonSize = Math.max(40, 60 * scale);
  const fontSize = Math.max(16, 24 * scale);
  const margin = Math.max(8, 20 * scale);
  const padding = Math.max(8, 20 * scale);

  return (
    <div 
      className="flex justify-between items-center w-full mb-5"
      style={{ 
        maxWidth: `${maxWidth}px`,
        marginTop: `${margin}px`,
        paddingLeft: `${padding}px`,
        paddingRight: `${padding}px`,
      }}
    >
      <button
        onClick={onLeftPress}
        className="bg-black text-white border-none rounded-full font-mono cursor-pointer flex items-center justify-center flex-shrink-0 hover:bg-gray-800 transition-colors active:scale-95"
        style={{
          width: `${buttonSize}px`,
          height: `${buttonSize}px`,
          fontSize: `${fontSize}px`,
        }}
      >
        ←
      </button>
      <button
        onClick={onRightPress}
        className="bg-black text-white border-none rounded-full font-mono cursor-pointer flex items-center justify-center flex-shrink-0 hover:bg-gray-800 transition-colors active:scale-95"
        style={{
          width: `${buttonSize}px`,
          height: `${buttonSize}px`,
          fontSize: `${fontSize}px`,
        }}
      >
        →
      </button>
    </div>
  );
});

// ゲーム画面コンポーネント
const GameScreen = memo(({ 
  courseRows, 
  playerX, 
  playerRow, 
  distance,
  scale
}: { 
  courseRows: string[][], 
  playerX: number, 
  playerRow: number, 
  distance: number,
  scale: number
}) => {

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

// ========================================
// メインアプリコンポーネント
// ========================================

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