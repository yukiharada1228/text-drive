import { useCallback, useRef } from 'react';

export const useTouchControls = () => {
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const pressLeft = useCallback(() => {
    keysRef.current['left'] = true;
    setTimeout(() => {
      keysRef.current['left'] = false;
    }, 50);
  }, []);

  const pressRight = useCallback(() => {
    keysRef.current['right'] = true;
    setTimeout(() => {
      keysRef.current['right'] = false;
    }, 50);
  }, []);

  return { keysRef, pressLeft, pressRight };
};
