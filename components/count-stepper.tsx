"use client";

import { MAX_VARIATION_COUNT } from "@/lib/config";
import { cn } from "@/lib/utils";

type CountStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

export default function CountStepper({
  value,
  onChange,
  min = 1,
  max = MAX_VARIATION_COUNT,
  className,
}: CountStepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-gray-350/80 bg-gray-400/50",
        className,
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="px-2 py-1.5 text-gray-200 transition hover:bg-gray-400/60 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Decrease count"
      >
        −
      </button>
      <span className="min-w-[2.5rem] px-2 text-center text-sm text-emerald-400/90">
        {value}x
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="px-2 py-1.5 text-gray-200 transition hover:bg-gray-400/60 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Increase count"
      >
        +
      </button>
    </div>
  );
}
