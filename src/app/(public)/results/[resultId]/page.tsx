import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, ArrowRight } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCefrBand } from "@/lib/constants";
import { createServiceClient } from "@/lib/supabase/service";
import { mapResultRow } from "@/lib/api/mappers";

const SECTION_LABELS: Record<string, string> = {
  vocabulary: "Vocabulary",
  grammar: "Grammar",
  reading: "Reading",
  listening: "Listening",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
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
  const band = getCefrBand(result.overallScore);

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
              Your estimated level
            </p>
            <h1 className="text-5xl font-extrabold tracking-tight text-brand-gradient">
              {band.level}
            </h1>
            <p className="text-base font-medium text-foreground/80">
              {band.label}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.overallScore} / {result.totalQuestions} correct answers
            </p>
          </CardContent>
        </Card>

        {/* Section breakdown */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Section breakdown
            </h2>
            <div className="flex flex-col gap-4">
              {result.sectionScores.map((s) => {
                const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                return (
                  <div key={s.section}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {SECTION_LABELS[s.section] ?? s.section}
                      </span>
                      <span className="text-muted-foreground">
                        {s.correct}/{s.total}
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
          </CardContent>
        </Card>

        {/* Recommended course + timing */}
        <Card className="mt-6">
          <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Recommended course
              </h3>
              <p className="mt-2 text-sm font-medium text-foreground">
                {result.recommendedCourse}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center sm:text-left">
              <div>
                <p className="text-xs text-muted-foreground">Started</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatTime(result.startedAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Finished</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatTime(result.finishedAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatDuration(result.durationSeconds)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href="/">
              Back to homepage
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
