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
  // True while the current playback is merely paused (not ended, not never
  // started) — resuming it is free and must NOT consume another play.
  const [canFreeResume, setCanFreeResume] = useState(false);

  const playsRemaining = Math.max(0, MAX_AUDIO_PLAYS - playsUsed);
  // Locked only blocks starting a *fresh* play — a paused, unfinished
  // playback can always be resumed for free even at 0 plays remaining.
  const isLocked = playsRemaining === 0 && !canFreeResume;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => {
      setIsPlaying(false);
      setCanFreeResume(!audio.ended && audio.currentTime > 0);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCanFreeResume(false);
    };
    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || isRequesting) return;

    // Resuming a paused-but-unfinished playback — free, no server call,
    // no reset to the beginning.
    if (canFreeResume) {
      await audio.play().catch(() => {});
      return;
    }

    // Starting fresh (first time, or restarting after it ended) — this is
    // what actually consumes one of the two allowed plays.
    if (playsRemaining <= 0) return;

    setIsRequesting(true);
    try {
      // The server is the source of truth for play counts — students can't
      // bypass the two-play limit via page reloads.
      const result = await registerListeningPlay(sessionId, audioId);
      setPlaysUsed(result.playsUsed);
      if (result.locked) return;

      audio.currentTime = 0;
      await audio.play().catch(() => {
        // Ignore playback errors from placeholder/missing audio sources.
      });
    } catch {
      // If the request fails, don't let the student play for free.
    } finally {
      setIsRequesting(false);
    }
  }, [audioId, canFreeResume, isRequesting, playsRemaining, sessionId]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
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
    canFreeResume,
    play,
    pause,
  };
}