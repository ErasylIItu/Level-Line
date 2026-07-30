import { TestRunner } from "@/components/test/test-runner";

export default async function TestSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return <TestRunner sessionId={sessionId} />;
}
