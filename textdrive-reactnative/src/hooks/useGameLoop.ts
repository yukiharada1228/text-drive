import { useEffect, useRef } from 'react';
import { updateGameState } from '../gameLogic';
import type { GameState } from '../gameLogic';

export const useGameLoop = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  keysRef: React.RefObject<{ [key: string]: boolean }>
) => {
  const gameStateRef = useRef<GameState>(gameState);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    let lastTime = Date.now();
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS;

    const gameLoop = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= frameTime) {
        const currentState = gameStateRef.current;

        if (!currentState.gameOver) {
          const newState = updateGameState(currentState, keysRef.current);
          setGameState(newState);
        }

        lastTime = currentTime - (deltaTime % frameTime);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [setGameState, keysRef]);
};
