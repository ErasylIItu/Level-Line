import Image from "next/image";

import { AnimatedSection } from "@/components/shared/animated-section";

const REVIEW_IMAGES = [
  {
    src: "/images/testimonials/reviews-1.png",
    alt: "Level Line студенттерінің пікірлері — Байболат, Гүлзат, Айкерім, Қарақат",
  },
  {
    src: "/images/testimonials/reviews-2.png",
    alt: "Level Line студенттерінің пікірлері — Назерке, Жанель, Арман, Айдана",
  },
];

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
      </div>
    </section>
  );
}