import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  isValid: boolean;
  className?: string;
}

export function StatusBadge({ isValid, className }: StatusBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium",
        isValid 
          ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400"
          : "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400",
        className
      )}
    >
      {isValid ? (
        <>
          <CheckCircle2 className="w-4 h-4" />
          <span>Valid Certificate</span>
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4" />
          <span>Revoked / Invalid</span>
        </>
      )}
    </div>
  );
}
