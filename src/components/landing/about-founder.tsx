import Image from "next/image";

import { AnimatedSection } from "@/components/shared/animated-section";

export function AboutFounder() {
  return (
    <section id="founder" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <AnimatedSection className="order-2 lg:order-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            About the founder
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Built by someone who has lived the language journey
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Level Line was created by Uldana, an educator and English-language
            specialist who has helped hundreds of students understand exactly
            where they stand — and what to study next. Frustrated by vague,
            inaccurate placement tests, she built Level Line to give every
            student a clear, honest, CEFR-based starting point.
          </p>
          <p className="mt-4 text-sm text-muted-foreground/80 italic">
            (Bio text is a placeholder — replace with the real founder story.)
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-border card-shadow-lg">
            <Image
              src="/images/founder-uldana.png"
              alt="Uldana — Level Line founder"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 400px, 90vw"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
