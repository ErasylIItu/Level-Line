"use client";

import { useRef, useState, useCallback, useEffect } from "react";

import { MAX_AUDIO_PLAYS } from "@/lib/constants";
import { registerListeningPlay } from "@/lib/api/test-client";

export function useAudioPlayer({
  sessionId,
  audioId,
  src,
  initialPlaysUsed = 0,
}: {
  sessionId: string;
  audioId: string;
  src: string;
  initialPlaysUsed?: number;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playsUsed, setPlaysUsed] = useState(initialPlaysUsed);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);

  const playsRemaining = Math.max(0, MAX_AUDIO_PLAYS - playsUsed);
  const isLocked = playsRemaining === 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  const play = useCallback(async () => {
    if (isLocked || isRequesting || !audioRef.current) return;
    if (isPlaying) return;

    setIsRequesting(true);
    try {
      // The server is the source of truth for play counts — students can't
      // bypass the two-play limit via page reloads.
      const result = await registerListeningPlay(sessionId, audioId);
      setPlaysUsed(result.playsUsed);
      if (result.locked) return;

      audioRef.current.currentTime = 0;
      await audioRef.current.play().catch(() => {
        // Ignore playback errors from placeholder/missing audio sources.
      });
      setIsPlaying(true);
    } catch {
      // If the request fails, don't let the student play for free.
    } finally {
      setIsRequesting(false);
    }
  }, [audioId, isLocked, isPlaying, isRequesting, sessionId]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  return {
    audioRef,
    src,
    isPlaying,
    progress,
    playsUsed,
    playsRemaining,
    isLocked,
    isRequesting,
    play,
    pause,
  };
}
