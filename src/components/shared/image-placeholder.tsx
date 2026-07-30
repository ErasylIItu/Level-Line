import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImagePlaceholder({
  className,
  rounded = "rounded-full",
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-secondary text-muted-foreground/50",
        rounded,
        className
      )}
    >
      <User className="size-1/3" strokeWidth={1.5} />
    </div>
  );
}
