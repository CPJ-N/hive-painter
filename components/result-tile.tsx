"use client";

import Image from "next/image";
import Spinner from "@/components/spinner";
import type { GenerationTile } from "@/hooks/useBulkGeneration";
import imagePlaceholder from "@/public/image-placeholder.png";
import { AlertCircle, Download, RotateCcw } from "lucide-react";

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
    <div className="group relative overflow-hidden rounded-md border border-gray-100/10 bg-gray-400/70 shadow-tile transition hover:border-honey-300/40">
      <div className="relative aspect-square w-full">
        {tile.status === "pending" && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-600/50">
            <Spinner className="size-8 text-honey-300" />
          </div>
        )}

        {tile.status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-600/60 p-4 text-center">
            <AlertCircle className="size-6 text-rose-300" aria-hidden />
            <p className="text-xs font-medium text-rose-300">
              Generation failed
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={() => onRetry(tile.id)}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-100/10 bg-gray-500 px-3 py-1.5 text-xs text-gray-200 transition hover:border-honey-300/40 hover:text-honey-300"
              >
                <RotateCcw className="size-3.5" aria-hidden />
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
              alt={prompt || "Generated image"}
              className="object-cover"
            />
            <button
              type="button"
              onClick={downloadImage}
              className="absolute right-2 top-2 inline-flex size-9 items-center justify-center rounded-md border border-white/10 bg-black/50 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/70 group-hover:opacity-100"
              aria-label="Download image"
            >
              <Download className="size-4" aria-hidden />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-gray-100/10 bg-gray-500/70 px-3 py-2">
        <p className="truncate text-xs text-gray-200/90" title={tile.model}>
          {shortModelName(tile.model)}
        </p>
        {tile.status === "done" && tile.image?.timings?.inference != null && (
          <p className="shrink-0 font-mono text-[10px] text-gray-300">
            {(tile.image.timings.inference / 1000).toFixed(1)}s
          </p>
        )}
      </div>
    </div>
  );
}
