import { useEffect, useRef } from 'react';
import { updateGameState } from '../gameLogic';
import type { GameState } from '../gameLogic';

export const useGameLoop = (
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
