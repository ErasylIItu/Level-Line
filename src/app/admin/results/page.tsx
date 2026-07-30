"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ResultsTable } from "@/components/admin/results-table";
import { fetchAdminResults } from "@/lib/api/admin-client";
import type { TestResult } from "@/types";

export default function ResultsAdminPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminResults()
      .then(setResults)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Could not load results")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Results"
        description="All completed placement tests."
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ResultsTable results={results} />
      )}
    </div>
  );
}
