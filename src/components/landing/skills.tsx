import { BookOpen, SpellCheck2, Headphones, PenLine } from "lucide-react";

import { AnimatedSection } from "@/components/shared/animated-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SKILLS = [
  {
    icon: SpellCheck2,
    title: "Vocabulary (Сөздік қор)",
    description:
      "Күнделікті сөздерден бастап, күрделірек тілдік құрылымдарға дейін сөздік қорыңыздың кеңдігі мен дәлдігі тексеріледі.",
  },
  {
    icon: PenLine,
    title: "Grammar (Грамматика)",
    description:
      "Ағылшын тілінің құрылымын — етістік шақтарын, сөйлем құрылысын және грамматикалық ережелерді меңгеру деңгейіңіз бағаланады.",
  },
  {
    icon: BookOpen,
    title: "Reading (Оқылым)",
    description:
      "Нақты мәтіндерді оқып, оларды жаттап алу емес, шынымен түсінгеніңізді тексеретін сұрақтарға жауап бересіз.",
  },
  {
    icon: Headphones,
    title: "Listening (Тыңдалым)",
    description:
      "Қысқа аудиожазбалар мен контекстке негізделген сұрақтар арқылы табиғи ағылшын сөйлеуін түсіну деңгейіңіз анықталады.",
  },
];

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <AnimatedSection className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Төрт дағды. Бір нақты нәтиже.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Level Line сіздің шынайы деңгейіңізді көрсететін нәтиже алу үшін
          ағылшын тілін меңгерудің негізгі дағдыларын бағалайды.
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