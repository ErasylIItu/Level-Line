import { BookOpen, SpellCheck2, Headphones, PenLine } from "lucide-react";

import { AnimatedSection } from "@/components/shared/animated-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SKILLS = [
  {
    icon: SpellCheck2,
    title: "Vocabulary",
    description:
      "Test how wide and precise your word knowledge is, from everyday terms to nuanced usage.",
  },
  {
    icon: PenLine,
    title: "Grammar",
    description:
      "Measure your command of English structure — tenses, agreement, and sentence construction.",
  },
  {
    icon: BookOpen,
    title: "Reading",
    description:
      "Comprehend real passages and answer questions that test depth of understanding, not memorization.",
  },
  {
    icon: Headphones,
    title: "Listening",
    description:
      "Understand natural spoken English through short audio clips and contextual questions.",
  },
];

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <AnimatedSection className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Four skills. One accurate score.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Level Line evaluates the core pillars of English proficiency to
          give you a result that actually reflects your ability.
        </p>
      </AnimatedSection>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SKILLS.map((skill, i) => (
          <AnimatedSection key={skill.title} delay={i * 0.08}>
            <Card className="h-full transition-transform duration-300 hover:-translate-y-1">
              <CardHeader>
                <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <skill.icon className="size-5" />
                </span>
                <CardTitle>{skill.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {skill.description}
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
