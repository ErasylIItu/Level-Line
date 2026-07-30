"use client";

import { useEffect, useRef, useState } from "react";

interface UseTimerOptions {
  durationSeconds: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

export function useTimer({
  durationSeconds,
  onExpire,
  autoStart = true,
}: UseTimerOptions) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [running, setRunning] = useState(autoStart);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) {
      onExpireRef.current?.();
      return;
    }
    const id = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return {
    secondsLeft,
    formatted,
    running,
    pause: () => setRunning(false),
    resume: () => setRunning(true),
    isLow: secondsLeft <= 60,
  };
}
