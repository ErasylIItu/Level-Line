import { AnimatedSection } from "@/components/shared/animated-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Do I need to create an account to take the test?",
    a: "No. Level Line requires no signup or registration — just click Start Test and begin immediately.",
  },
  {
    q: "How long does the test take?",
    a: "The test consists of 40 questions and typically takes about 40 minutes to complete, including reading and listening sections.",
  },
  {
    q: "How is my level determined?",
    a: "Your answers across vocabulary, grammar, reading, and listening are scored and mapped to the CEFR framework (A1 through B2) to give you an accurate estimate of your English level.",
  },
  {
    q: "Can I listen to the audio more than twice?",
    a: "Each listening clip can be played a maximum of two times, matching real-world listening test conditions. After that, the player is disabled and you can proceed to the questions.",
  },
  {
    q: "Is the result really instant?",
    a: "Yes. As soon as you finish the test, your overall score, section breakdown, and CEFR level are calculated and displayed immediately.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <AnimatedSection className="mb-12 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Frequently asked questions
        </h2>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-6 card-shadow">
          {FAQS.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </AnimatedSection>
    </section>
  );
}
