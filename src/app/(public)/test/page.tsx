"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListChecks, Clock, Headphones, ShieldCheck, Loader2 } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TOTAL_QUESTIONS, TEST_DURATION_MINUTES } from "@/lib/constants";
import { startTestSession } from "@/lib/api/test-client";

const NOTES = [
  {
    icon: ListChecks,
    text: `${TOTAL_QUESTIONS} questions covering vocabulary, grammar, reading, and listening.`,
  },
  {
    icon: Clock,
    text: `You'll have ${TEST_DURATION_MINUTES} minutes. The test auto-submits when time runs out.`,
  },
  {
    icon: Headphones,
    text: "Each listening audio can be played a maximum of two times.",
  },
  {
    icon: ShieldCheck,
    text: "No account needed. Your result is calculated instantly at the end.",
  },
];

export default function TestIntroPage() {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBegin() {
    setError(null);
    setStarting(true);
    try {
      const { sessionId } = await startTestSession();
      router.push(`/test/${sessionId}`);
    } catch {
      setError("Couldn't start the test. Please try again.");
      setStarting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="mb-10">
        <Logo />
      </Link>

      <Card className="w-full max-w-lg">
        <CardContent className="pt-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Before you begin
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A few quick things to know about the Level Line placement test.
          </p>

          <ul className="mt-7 flex flex-col gap-4">
            {NOTES.map((note, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <note.icon className="size-4" />
                </span>
                <span className="text-sm leading-relaxed text-foreground/90">
                  {note.text}
                </span>
              </li>
            ))}
          </ul>

          {error && (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          )}

          <Button
            size="lg"
            className="mt-8 w-full"
            disabled={starting}
            onClick={handleBegin}
          >
            {starting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Preparing your test...
              </>
            ) : (
              "Begin Test"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
