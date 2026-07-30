"use client";

import { useEffect, useState } from "react";
import { SpellCheck2, PenLine, BookOpen, Headphones, Users, Award, Loader2 } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatCard } from "@/components/admin/stat-card";
import {
  fetchQuestions,
  fetchPassages,
  fetchAudios,
  fetchAdminResults,
} from "@/lib/api/admin-client";

interface DashboardStats {
  vocabularyCount: number;
  grammarCount: number;
  readingQuestionCount: number;
  listeningQuestionCount: number;
  resultsCount: number;
  avgScore: number | null;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchQuestions({ type: "vocabulary" }),
      fetchQuestions({ type: "grammar" }),
      fetchPassages(),
      fetchAudios(),
      fetchAdminResults(),
    ])
      .then(([vocabulary, grammar, passages, audios, results]) => {
        const readingQuestionCount = passages.reduce(
          (sum, p) => sum + p.questions.length,
          0
        );
        const listeningQuestionCount = audios.reduce(
          (sum, a) => sum + a.questions.length,
          0
        );
        const avgScore =
          results.length > 0
            ? Math.round(
                results.reduce((sum, r) => sum + r.overallScore, 0) /
                  results.length
              )
            : null;

        setStats({
          vocabularyCount: vocabulary.length,
          grammarCount: grammar.length,
          readingQuestionCount,
          listeningQuestionCount,
          resultsCount: results.length,
          avgScore,
        });
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Could not load dashboard")
      );
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your question bank and test activity."
      />

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {!stats ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={SpellCheck2} label="Vocabulary questions" value={stats.vocabularyCount} />
          <StatCard icon={PenLine} label="Grammar questions" value={stats.grammarCount} />
          <StatCard icon={BookOpen} label="Reading questions" value={stats.readingQuestionCount} />
          <StatCard icon={Headphones} label="Listening questions" value={stats.listeningQuestionCount} />
          <StatCard icon={Users} label="Tests completed" value={stats.resultsCount} />
          <StatCard
            icon={Award}
            label="Average score"
            value={stats.avgScore !== null ? `${stats.avgScore}/40` : "—"}
          />
        </div>
      )}
    </div>
  );
}
