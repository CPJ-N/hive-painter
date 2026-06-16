"use client";

import Image from "next/image";
import Spinner from "@/components/spinner";
import type { GenerationTile } from "@/hooks/useBulkGeneration";
import imagePlaceholder from "@/public/image-placeholder.png";

type ResultTileProps = {
  tile: GenerationTile;
  prompt: string;
  onRetry?: (tileId: string) => void;
};

function shortModelName(modelId: string) {
  const parts = modelId.split("/");
  return parts[parts.length - 1] ?? modelId;
}

export default function ResultTile({ tile, prompt, onRetry }: ResultTileProps) {
  const downloadImage = () => {
    if (!tile.image?.b64_json) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${tile.image.b64_json}`;
    link.download = `hive-painter-${shortModelName(tile.model)}-${tile.variationIndex + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-350/70 bg-gray-500/80 shadow-tile transition hover:border-emerald-500/20">
      <div className="relative aspect-square w-full">
        {tile.status === "pending" && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-400/50">
            <Spinner className="size-8 text-emerald-400" />
          </div>
        )}

        {tile.status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-400/50 p-4 text-center">
            <p className="text-xs text-red-400/90">Generation failed</p>
            {onRetry && (
              <button
                type="button"
                onClick={() => onRetry(tile.id)}
                className="rounded-md border border-gray-350/80 bg-gray-500/80 px-3 py-1 text-xs text-gray-200 transition hover:border-emerald-500/40 hover:text-emerald-400"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {tile.status === "done" && tile.image?.b64_json && (
          <>
            <Image
              placeholder="blur"
              blurDataURL={imagePlaceholder.blurDataURL}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              src={`data:image/png;base64,${tile.image.b64_json}`}
              alt={prompt}
              className="object-cover"
            />
            <button
              type="button"
              onClick={downloadImage}
              className="absolute right-2 top-2 rounded-lg border border-transparent bg-black/40 p-2 opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-black/60"
              title="Download image"
            >
              <img src="/download.svg" alt="Download" className="size-4" />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-gray-350/60 bg-gray-500/40 px-3 py-2">
        <p className="truncate text-xs text-gray-200/90" title={tile.model}>
          {shortModelName(tile.model)}
        </p>
        {tile.status === "done" && tile.image?.timings?.inference != null && (
          <p className="shrink-0 text-[10px] text-gray-350">
            {(tile.image.timings.inference / 1000).toFixed(1)}s
          </p>
        )}
      </div>
    </div>
  );
}
