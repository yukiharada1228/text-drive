import { useEffect, useRef } from 'react';

export const useKeyboardInput = (onRestart: () => void, isGameOver: boolean) => {
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
