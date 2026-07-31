import { AnimatedSection } from "@/components/shared/animated-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Тестті тапсыру үшін тіркелу керек пе?",
    a: "Жоқ. Level Line тіркелуді немесе аккаунт ашуды талап етпейді — жай ғана «Start Test» түймесін басып, бірден бастай аласыз.",
  },
  {
    q: "Тест қанша уақыт алады?",
    a: "Тест 40 сұрақтан тұрады және оқылым мен тыңдалым бөлімдерін қоса алғанда, толығымен өту үшін шамамен 40 минут кетеді.",
  },
  {
    q: "Менің деңгейім қалай анықталады?",
    a: "Сөздік қор, грамматика, оқылым және тыңдалым бойынша жауаптарыңыз бағаланып, CEFR шкаласына (A1-ден B2-ге дейін) сәйкестендіріледі — осылайша ағылшын деңгейіңіздің дәл бағасы шығады.",
  },
  {
    q: "Аудионы екі реттен көп тыңдай аламын ба?",
    a: "Әр аудио жазбаны ең көбі екі рет тыңдауға болады — бұл нақты тыңдалым тестінің шартына сәйкес келеді. Одан кейін плеер өшіріледі және сіз сұрақтарға өте аласыз.",
  },
  {
    q: "Нәтиже шынымен бірден шыға ма?",
    a: "Иә. Тестті аяқтасымен жалпы балл, бөлімдер бойынша нәтиже және CEFR деңгейіңіз бірден есептеліп, экранда көрсетіледі.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <AnimatedSection className="mb-12 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Жиі қойылатын сұрақтар
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