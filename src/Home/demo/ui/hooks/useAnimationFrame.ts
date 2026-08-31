import { useCallback, useEffect, useRef } from "react";

export function useAnimationFrame(isRunning: boolean, callback: () => void) {
  const reqIdRef = useRef<number | null>(null);
  const loop = useCallback(() => {
    // Loop only while isRunning is true
    if (isRunning) {
      reqIdRef.current = requestAnimationFrame(loop);
      callback();
    }
  }, [isRunning, callback]);

  useEffect(() => {
    reqIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqIdRef.current !== null) {
        cancelAnimationFrame(reqIdRef.current);
      }
    };
  }, [loop]);
}
