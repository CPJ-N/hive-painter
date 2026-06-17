"use client";

import { MAX_VARIATION_COUNT } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

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
        "inline-flex h-11 items-center rounded-md border border-gray-100/10 bg-gray-400/80 text-gray-100 shadow-none",
        className,
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="flex size-9 items-center justify-center text-gray-200 transition hover:bg-gray-350/50 hover:text-honey-300 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Decrease count"
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <span className="min-w-[2.75rem] border-x border-gray-100/10 px-2 text-center text-sm font-semibold text-honey-300">
        {value}x
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="flex size-9 items-center justify-center text-gray-200 transition hover:bg-gray-350/50 hover:text-honey-300 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Increase count"
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
