"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * All cards in this grid render at the exact same box size
 * (aspect-[5/7] + object-cover), whether they're a photo or the video.
 */
const CARD_ASPECT = "aspect-[5/7]";

const REVIEW_IMAGES = [
  {
    src: "/images/testimonials/reviews-3.png",
    alt: "Level Line курсы — Ағылшынды бастайтын кез келді",
  },
  {
    src: "/images/testimonials/reviews-1.png",
    alt: "Level Line студенттерінің пікірлері — Байболат, Гүлзат, Айкерім, Қаракат",
  },
  {
    src: "/images/testimonials/reviews-2.png",
    alt: "Level Line студенттерінің пікірлері — Назерке, Жанель, Арман, Айдана",
  },
];

const VIDEO_CAPTION =
  "А0 (бегиннер) деңгейінен толық 4 айда В2 (upper-intermediate) деңгейге жеткен оқушымыздан отзыв 😍";

function VideoTestimonial() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "error">("idle");

  function handlePlay() {
    const video = videoRef.current;
    if (!video) return;

    video
      .play()
      .then(() => setStatus("playing"))
      .catch(() => setStatus("error"));
  }

  return (
    <div
      className={cn(
        CARD_ASPECT,
        "relative w-full overflow-hidden rounded-3xl border border-border bg-black card-shadow-lg"
      )}
    >
      <video
        ref={videoRef}
        src="/videos/testimonial-1.mp4"
        controls={status === "playing"}
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        onPause={() => setStatus("idle")}
        onError={() => setStatus("error")}
      />

      {status !== "playing" && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label="Видео-пікірді ойнату"
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center bg-black/10 transition-colors hover:bg-black/20",
            status === "error" && "bg-black/50"
          )}
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur">
            <Play className="size-7 translate-x-0.5 fill-current" />
          </span>
          {status === "error" && (
            <span className="mt-3 max-w-[200px] text-center text-xs font-medium text-white/90">
              Видео жүктелмеді. Файл орналасуын тексеріңіз.
            </span>
          )}
        </button>
      )}

      {/* Caption pinned to the TOP — bigger, bolder font so it actually gets noticed */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/75 via-black/35 to-transparent px-4 pb-10 pt-4">
        <p className="text-center text-base font-extrabold leading-snug tracking-tight text-white drop-shadow-md sm:text-lg">
          {VIDEO_CAPTION}
        </p>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 card-shadow sm:p-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Оқушылар бізге сенеді
        </h2>
        <p className="mt-3 text-muted-foreground">
          Нақты студенттер, нақты нәтижелер — деңгейді анықтаудан бастап
          еркін сөйлеуге дейін.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Video always renders first */}
        <VideoTestimonial />

        {REVIEW_IMAGES.map((img) => (
          <div
            key={img.src}
            className={cn(
              CARD_ASPECT,
              "relative w-full overflow-hidden rounded-3xl border border-border card-shadow-lg"
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover object-top"
              sizes="(min-width: 768px) 420px, 92vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}