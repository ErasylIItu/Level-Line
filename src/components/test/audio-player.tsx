"use client";

import { Play, Pause, Lock, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { cn } from "@/lib/utils";

export function AudioPlayer({
  sessionId,
  audioId,
  src,
  title,
  initialPlaysUsed,
}: {
  sessionId: string;
  audioId: string;
  src: string;
  title: string;
  initialPlaysUsed?: number;
}) {
  const {
    audioRef,
    isPlaying,
    progress,
    playsRemaining,
    isLocked,
    isRequesting,
    play,
    pause,
  } = useAudioPlayer({ sessionId, audioId, src, initialPlaysUsed });

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-colors",
        isLocked
          ? "border-border bg-secondary/60"
          : "border-border bg-card card-shadow"
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Volume2 className="size-4 text-primary" />
          {title}
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold",
            isLocked
              ? "bg-muted text-muted-foreground"
              : "bg-accent text-accent-foreground"
          )}
        >
          {isLocked ? "No plays left" : `${playsRemaining} play${playsRemaining === 1 ? "" : "s"} left`}
        </span>
      </div>

      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-brand-gradient transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Button
        type="button"
        size="sm"
        variant={isLocked ? "secondary" : "default"}
        disabled={isLocked || isRequesting}
        onClick={isPlaying ? pause : play}
        className="w-full"
      >
        {isLocked ? (
          <>
            <Lock className="size-4" />
            Playback disabled
          </>
        ) : isRequesting ? (
          "Starting..."
        ) : isPlaying ? (
          <>
            <Pause className="size-4" />
            Pause
          </>
        ) : (
          <>
            <Play className="size-4" />
            {progress > 0 ? "Replay" : "Play audio"}
          </>
        )}
      </Button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        You can listen to this audio a maximum of 2 times.
      </p>
    </div>
  );
}
