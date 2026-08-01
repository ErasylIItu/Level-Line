import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, ArrowRight, Camera } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Testimonials } from "@/components/landing/testimonials";
import { createServiceClient } from "@/lib/supabase/service";
import { mapResultRow } from "@/lib/api/mappers";

const SECTION_LABELS: Record<string, string> = {
  vocabulary: "Лексика (Vocabulary)",
  grammar: "Грамматика (Grammar)",
  reading: "Оқылым (Reading)",
  listening: "Тыңдалым (Listening)",
};

// Жалпы балл бойынша деңгей мен түсіндірме (0-40 ұпай шкаласы)
const OVERALL_BANDS = [
  {
    min: 0,
    max: 10,
    level: "A1",
    label: "A1 (Beginner)",
    explanation:
      "Сіз ағылшын тілін енді үйреніп жатырсыз. Қарапайым сөздер мен сөйлемдерді түсіне аласыз, бірақ сөздік қорыңызды, грамматикаңызды, оқу және тыңдау дағдыларыңызды әлі де дамыту қажет.",
  },
  {
    min: 11,
    max: 20,
    level: "A2",
    label: "A2 (Elementary)",
    explanation:
      "Сіз күнделікті тақырыптарда қарапайым сөйлесе аласыз. Дегенмен, еркін сөйлеу үшін сөздік қорыңызды көбейтіп, грамматика, оқу және тыңдау дағдыларыңызды дамыту қажет.",
  },
  {
    min: 21,
    max: 30,
    level: "A2+",
    label: "A2+ (Pre-Intermediate)",
    explanation:
      "Сіз ағылшын тілін жақсы деңгейде қолдана бастадыңыз. Көптеген жағдайларда өз ойыңызды жеткізе аласыз, бірақ әлі де сөздік қорды, грамматиканы және сөйлеу дағдыларын жетілдіргеніңіз дұрыс.",
  },
  {
    min: 31,
    max: 37,
    level: "B1",
    label: "B1 (Intermediate)",
    explanation:
      "Сіздің деңгейіңіз жақсы. Сіз көптеген тақырыптарда сөйлесіп, мәтіндерді түсіне аласыз. Енді тілді еркінірек қолдану үшін сөздік қорды кеңейтіп, күрделірек грамматиканы меңгеруге көңіл бөлгеніңіз жөн.",
  },
  {
    min: 38,
    max: 40,
    level: "B2",
    label: "B2 (Upper-Intermediate)",
    explanation:
      "Құттықтаймыз! Сіздің ағылшын тіліңіз жақсы деңгейде. Сіз өз ойыңызды еркін жеткізе аласыз. Осы деңгейіңізді сақтап, сөздік қорыңызды байытып, тәжірибені жалғастырсаңыз, C1 деңгейіне жете аласыз.",
  },
];

// Бөлім бойынша балл (10 ұпайдан) — деңгейге сәйкестендіру
const SECTION_BANDS = [
  { min: 0, max: 2, label: "A1 (Beginner)" },
  { min: 3, max: 5, label: "A2 (Elementary)" },
  { min: 6, max: 7, label: "A2+ (Pre-Intermediate)" },
  { min: 8, max: 9, label: "B1 (Intermediate)" },
  { min: 10, max: 10, label: "B2 (Upper-Intermediate)" },
];

function getOverallBand(score: number) {
  return (
    OVERALL_BANDS.find((b) => score >= b.min && score <= b.max) ??
    OVERALL_BANDS[0]
  );
}

function getSectionBand(score: number) {
  return (
    SECTION_BANDS.find((b) => score >= b.min && score <= b.max) ??
    SECTION_BANDS[0]
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m} мин ${s} сек`;
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ resultId: string }>;
}) {
  const { resultId } = await params;

  const service = createServiceClient();
  const { data: row, error } = await service
    .from("test_results")
    .select("*")
    .eq("id", resultId)
    .maybeSingle();

  if (error || !row) {
    notFound();
  }

  const result = mapResultRow(row);
  const overallBand = getOverallBand(result.overallScore);

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-16">
      <Link href="/" className="mb-10">
        <Logo />
      </Link>

      <div className="w-full max-w-2xl">
        {/* Headline card */}
        <Card className="text-center">
          <CardContent className="flex flex-col items-center gap-3 pt-10 pb-8">
            <span className="flex size-14 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground">
              <Award className="size-7" />
            </span>
            <p className="text-sm font-semibold text-muted-foreground">
              Сіздің шамамен деңгейіңіз
            </p>
            <h1 className="text-5xl font-extrabold tracking-tight text-brand-gradient">
              {overallBand.level}
            </h1>
            <p className="text-base font-medium text-foreground/80">
              {overallBand.label}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.overallScore} / {result.totalQuestions} дұрыс жауап
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/80">
              {overallBand.explanation}
            </p>
          </CardContent>
        </Card>

        {/* Testimonials — moved here from the landing page */}
        <div className="mt-6">
          <Testimonials />
        </div>

        {/* Overall bands reference table */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Жалпы балл бойынша деңгей кестесі
            </h2>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Ұпай</th>
                    <th className="px-4 py-2.5 font-semibold">Деңгей</th>
                    <th className="px-4 py-2.5 font-semibold">Түсіндірме</th>
                  </tr>
                </thead>
                <tbody>
                  {OVERALL_BANDS.map((b) => (
                    <tr
                      key={b.label}
                      className={`border-t border-border ${
                        b.label === overallBand.label ? "bg-accent/50" : ""
                      }`}
                    >
                      <td className="px-4 py-2.5 font-medium text-foreground whitespace-nowrap">
                        {b.min}–{b.max}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-foreground whitespace-nowrap">
                        {b.label}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {b.explanation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Section breakdown */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Бөлімдер бойынша нәтиже
            </h2>
            <div className="flex flex-col gap-4">
              {result.sectionScores.map((s) => {
                const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                const sectionBand = getSectionBand(s.correct);
                return (
                  <div key={s.section}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {SECTION_LABELS[s.section] ?? s.section}
                      </span>
                      <span className="text-muted-foreground">
                        {s.correct}/{s.total} · {sectionBand.label}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-brand-gradient transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Per-section bands reference table */}
            <div className="mt-6 border-t border-border pt-5">
              <p className="mb-3 text-sm text-muted-foreground">
                Ал әр бөлімнің (Vocabulary, Grammar, Reading, Listening)
                нәтижесі бойынша бағалау:
              </p>
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">
                        Ұпай (10-нан)
                      </th>
                      <th className="px-4 py-2.5 font-semibold">Деңгей</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SECTION_BANDS.map((b) => (
                      <tr key={b.label} className="border-t border-border">
                        <td className="px-4 py-2.5 font-medium text-foreground whitespace-nowrap">
                          {b.min === b.max ? b.min : `${b.min}–${b.max}`}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {b.label}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended course + timing */}
        <Card className="mt-6">
          <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Ұсынылған курс
              </h3>
              <p className="mt-2 text-sm font-medium text-foreground">
                {result.recommendedCourse}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center sm:text-left">
              <div>
                <p className="text-xs text-muted-foreground">Басталды</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatTime(result.startedAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Аяқталды</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatTime(result.finishedAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ұзақтығы</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatDuration(result.durationSeconds)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Screenshot & send to manager callout */}
        <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl border border-primary/20 bg-accent/60 px-6 py-5 text-center">
          <Camera className="size-5 shrink-0 text-primary" />
          <p className="text-base font-semibold text-foreground">
            Тест нәтижесін скриндап менеджерге жіберіңіз
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <Button asChild size="lg">
            <Link href="/">
              Басты бетке оралу
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}