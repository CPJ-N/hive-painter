"use client";

import ResultTile from "@/components/result-tile";
import type { GenerationTile } from "@/hooks/useBulkGeneration";

type ResultGridProps = {
  tiles: GenerationTile[];
  prompt: string;
  onRetry?: (tileId: string) => void;
};

export default function ResultGrid({ tiles, prompt, onRetry }: ResultGridProps) {
  if (tiles.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 pb-40 pt-10">
        <div className="max-w-xl text-center">
          <p className="text-xl font-semibold tracking-tight text-gray-100 md:text-3xl">
            Bulk image generation
          </p>
          <p className="mt-4 text-balance text-sm leading-relaxed text-gray-300/80 md:text-base">
            Select models, set a count, and run. Images from every model fill in
            as they complete.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-44 pt-6">
      {prompt && (
        <p className="mb-4 text-center text-sm text-gray-300/70">{prompt}</p>
      )}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {tiles.map((tile) => (
          <ResultTile
            key={tile.id}
            tile={tile}
            prompt={prompt}
            onRetry={onRetry}
          />
        ))}
      </div>
    </div>
  );
}
