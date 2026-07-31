"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

import { AnimatedSection } from "@/components/shared/animated-section";
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
            "absolute inset-0 flex flex-col items-center justify-center bg-black/20 transition-colors hover:bg-black/30",
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

      {/* Caption overlay — stays inside the card so the box size never changes */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-10">
        <p className="text-xs font-semibold leading-snug text-white">
          {VIDEO_CAPTION}
        </p>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Оқушылар бізге сенеді
          </h2>
          <p className="mt-4 text-muted-foreground">
            Нақты студенттер, нақты нәтижелер — деңгейді анықтаудан бастап
            еркін сөйлеуге дейін.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Video always renders first */}
          <AnimatedSection>
            <VideoTestimonial />
          </AnimatedSection>

          {REVIEW_IMAGES.map((img, i) => (
            <AnimatedSection key={img.src} delay={(i + 1) * 0.08}>
              <div
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
                  sizes="(min-width: 640px) 480px, 92vw"
                />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}