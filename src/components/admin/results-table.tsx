import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { TestResult } from "@/types";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export function ResultsTable({ results }: { results: TestResult[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card card-shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Session</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Recommended course</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {r.sessionId}
              </TableCell>
              <TableCell className="font-semibold">
                {r.overallScore}/{r.totalQuestions}
              </TableCell>
              <TableCell>
                <Badge>{r.cefrLevel}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {r.recommendedCourse}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateTime(r.startedAt)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDuration(r.durationSeconds)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
