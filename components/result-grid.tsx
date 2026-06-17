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
  const groups = tiles.reduce<
    Array<{ runId: string; prompt: string; tiles: GenerationTile[] }>
  >((acc, tile) => {
    const current = acc[acc.length - 1];
    if (current?.runId === tile.runId) {
      current.tiles.push(tile);
    } else {
      acc.push({ runId: tile.runId, prompt: tile.prompt, tiles: [tile] });
    }
    return acc;
  }, []);

  if (tiles.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-[1800px]">
      {groups.map((group, index) => {
        const doneCount = group.tiles.filter(
          (tile) => tile.status === "done",
        ).length;
        const errorCount = group.tiles.filter(
          (tile) => tile.status === "error",
        ).length;
        return (
          <div key={group.runId} className={index === 0 ? "" : "mt-8"}>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-100/20 to-gray-100/10" />
              <div className="flex min-w-0 max-w-4xl items-center gap-2 rounded-full border border-gray-100/10 bg-gray-500/70 px-3 py-1.5 shadow-tile">
                <p className="min-w-0 truncate text-sm text-gray-200">
                  {group.prompt || prompt}
                </p>
                <span className="shrink-0 rounded-full border border-moss-300/25 bg-moss-500/20 px-2 py-0.5 text-xs font-medium text-moss-300">
                  {doneCount}/{group.tiles.length}
                </span>
                {errorCount > 0 && (
                  <span className="shrink-0 rounded-full border border-rose-400/30 bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-300">
                    {errorCount} failed
                  </span>
                )}
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gray-100/20 to-gray-100/10" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {group.tiles.map((tile) => (
                <ResultTile
                  key={tile.id}
                  tile={tile}
                  prompt={tile.prompt}
                  onRetry={onRetry}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
