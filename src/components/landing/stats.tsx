import { Clock, ListChecks, Zap, BadgeCheck } from "lucide-react";

import { AnimatedSection } from "@/components/shared/animated-section";

const STATS = [
  { icon: ListChecks, value: "40", label: "Сұрақ" },
  { icon: Clock, value: "40", label: "Минут" },
  { icon: Zap, value: "Лезде", label: "Нәтиже" },
  { icon: BadgeCheck, value: "CEFR", label: "негізінде" },
];

export function Stats() {
  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
          {STATS.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.06}>
              <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground">
                  <stat.icon className="size-4.5" />
                </span>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-lg font-extrabold leading-none text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}