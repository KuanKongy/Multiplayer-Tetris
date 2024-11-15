import { useRef, useEffect } from 'react';

export function useInterval(callback: () => void, delay: number | null): void {
  const callbackRef = useRef(callback); //store callback

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay == null) return; //if delay null, no interval

    const intervalID = setInterval(() => callbackRef.current(), delay); //create a new interval
    return () => clearInterval(intervalID); //on cleanup clear interval to stop running
  }, [delay]); //whenever delay changes
}