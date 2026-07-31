"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play, Sparkles } from "lucide-react";

import { AnimatedSection } from "@/components/shared/animated-section";
import { cn } from "@/lib/utils";

const REVIEW_IMAGES = [
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
    <AnimatedSection delay={0.2} className="flex flex-col items-center">
      {/* Caption pill, matching the hero's badge style */}
      <div className="mb-5 inline-flex max-w-md items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 text-center text-xs font-semibold leading-relaxed text-secondary-foreground">
        <Sparkles className="size-3.5 shrink-0 text-primary" />
        {VIDEO_CAPTION}
      </div>

      <div className="relative mx-auto aspect-[9/16] w-full max-w-xs overflow-hidden rounded-3xl border border-border bg-black card-shadow-lg">
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
              "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/20 transition-colors hover:bg-black/30",
              status === "error" && "bg-black/50"
            )}
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur">
              <Play className="size-7 translate-x-0.5 fill-current" />
            </span>
            {status === "error" && (
              <span className="max-w-[200px] text-center text-xs font-medium text-white/90">
                Видео жүктелмеді. Файл орналасуын тексеріңіз.
              </span>
            )}
          </button>
        )}
      </div>
    </AnimatedSection>
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

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {REVIEW_IMAGES.map((img, i) => (
            <AnimatedSection key={img.src} delay={i * 0.1}>
              <div className="relative overflow-hidden rounded-3xl border border-border card-shadow-lg">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={1320}
                  height={1840}
                  className="h-auto w-full"
                  sizes="(min-width: 768px) 560px, 92vw"
                />
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-12">
          <VideoTestimonial />
        </div>
      </div>
    </section>
  );
}