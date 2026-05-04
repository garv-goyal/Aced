import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
  colorClass?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  label,
  className,
  colorClass = "text-primary",
}: CircularProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedValue / max) * circumference;

  return (
    <div
      className={cn("relative flex flex-col items-center justify-center", className)}
      style={{ width: size, height: size }}
      data-testid={`circular-progress-${label?.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted/20"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn("transition-all duration-1000 ease-out", colorClass)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-mono tracking-tighter">
          {Math.round(animatedValue)}
        </span>
        {label && (
          <span className="text-xs text-muted-foreground font-mono tracking-tight uppercase">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
