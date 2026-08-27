'use client';

import { useState, useEffect, useCallback } from 'react';

export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const start = useCallback(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  return { seconds, isActive: seconds > 0, start };
}