"use client";

import ResultTile from "@/components/result-tile";
import type { GenerationTile } from "@/hooks/useBulkGeneration";

type ResultGridProps = {
  tiles: GenerationTile[];
  prompt: string;
  onRetry?: (tileId: string) => void;
};

export default function ResultGrid({
  tiles,
  prompt,
  onRetry,
}: ResultGridProps) {
  const doneCount = tiles.filter((tile) => tile.status === "done").length;
  const errorCount = tiles.filter((tile) => tile.status === "error").length;

  if (tiles.length === 0) {
    return null;
  }

  return (
    <section className="min-h-[640px] overflow-hidden rounded-md border border-gray-100/10 bg-gray-500/70 shadow-panel">
      <div className="flex flex-col gap-3 border-b border-gray-100/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-gray-100">Results</h2>
          {prompt && (
            <p className="mt-0.5 truncate text-sm text-gray-300">{prompt}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs font-medium">
          <span className="rounded-md border border-moss-300/25 bg-moss-500/20 px-2.5 py-1 text-moss-300">
            {doneCount}/{tiles.length} done
          </span>
          {errorCount > 0 && (
            <span className="rounded-md border border-rose-400/30 bg-rose-500/10 px-2.5 py-1 text-rose-300">
              {errorCount} failed
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5 xl:grid-cols-4 2xl:grid-cols-5">
        {tiles.map((tile) => (
          <ResultTile
            key={tile.id}
            tile={tile}
            prompt={prompt}
            onRetry={onRetry}
          />
        ))}
      </div>
    </section>
  );
}
