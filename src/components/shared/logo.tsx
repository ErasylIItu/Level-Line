import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-0.5 font-extrabold tracking-tight text-lg",
        className
      )}
    >
      <span className="text-foreground">Level</span>
      <span className="text-brand-gradient">Line</span>
    </span>
  );
}
