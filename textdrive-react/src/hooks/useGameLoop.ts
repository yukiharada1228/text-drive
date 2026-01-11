import { useEffect, useRef } from 'react';
import { updateGameState } from '../gameLogic';
import type { GameState } from '../gameLogic';

export const useGameLoop = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  keysRef: React.RefObject<{ [key: string]: boolean }>
) => {
  const gameStateRef = useRef<GameState>(gameState);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const currentState = gameStateRef.current;

      if (!currentState.gameOver) {
        const newState = updateGameState(currentState, keysRef.current, deltaTime);
        setGameState(newState);
      }

      requestAnimationFrame(gameLoop);
    };

    lastTimeRef.current = performance.now();
    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [setGameState, keysRef]);
};
