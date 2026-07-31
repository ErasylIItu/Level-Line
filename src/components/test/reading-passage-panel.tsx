import { Card, CardContent } from "@/components/ui/card";
import type { ReadingPassage } from "@/types";

export function ReadingPassagePanel({
  passage,
  questionNumber,
  totalInPassage,
}: {
  passage: ReadingPassage;
  questionNumber: number;
  totalInPassage: number;
}) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
          Мәтін (Reading)
        </span>
        <h3 className="mb-4 text-lg font-bold text-foreground">
          {passage.title}
        </h3>
        <div className="max-h-[420px] overflow-y-auto pr-2 text-sm leading-relaxed text-muted-foreground">
          {passage.body.split("\n").map((para, i) => (
            <p key={i} className="mb-3 last:mb-0">
              {para}
            </p>
          ))}
        </div>
        <p className="mt-4 border-t border-border pt-3 text-xs font-medium text-muted-foreground">
          Осы мәтін бойынша сұрақ {questionNumber} / {totalInPassage}
        </p>
      </CardContent>
    </Card>
  );
}