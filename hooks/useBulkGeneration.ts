import { useCallback, useRef, useState } from "react";
import { MAX_CONCURRENCY } from "@/lib/config";

export type ImageResponse = {
  b64_json: string;
  timings?: { inference: number };
};

export type GenerationTile = {
  id: string;
  runId: string;
  createdAt: number;
  prompt: string;
  model: string;
  variationIndex: number;
  status: "pending" | "done" | "error";
  image?: ImageResponse;
  error?: string;
};

export type BulkGenerationParams = {
  prompt: string;
  models: string[];
  count: number;
  width: number;
  height: number;
};

type RunOptions = BulkGenerationParams & {
  userAPIKey?: string;
};

async function generateOneImage(
  params: RunOptions & { model: string; variationIndex: number },
  signal?: AbortSignal,
): Promise<ImageResponse> {
  const res = await fetch("/api/generateImages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      prompt: params.prompt,
      model: params.model,
      width: params.width,
      height: params.height,
      userAPIKey: params.userAPIKey,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text || "Generation failed";
    try {
      const parsed = JSON.parse(text) as { error?: string };
      if (typeof parsed.error === "string") message = parsed.error;
    } catch {
      message = text.replace(/^"|"$/g, "") || "Generation failed";
    }
    throw new Error(message);
  }

  const image = (await res.json()) as ImageResponse;
  if (!image?.b64_json) {
    throw new Error("No image data returned");
  }

  return image;
}

async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number,
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const current = nextIndex++;
      results[current] = await tasks[current]();
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, tasks.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

function buildTiles(
  prompt: string,
  models: string[],
  count: number,
): GenerationTile[] {
  const runId = crypto.randomUUID();
  const createdAt = Date.now();
  const tiles: GenerationTile[] = [];

  for (const model of models) {
    for (let i = 0; i < count; i++) {
      tiles.push({
        id: `${model}-${i}-${crypto.randomUUID()}`,
        runId,
        createdAt,
        prompt,
        model,
        variationIndex: i,
        status: "pending",
      });
    }
  }

  return tiles;
}

export default function useBulkGeneration() {
  const [tiles, setTiles] = useState<GenerationTile[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const [lastRunParams, setLastRunParams] = useState<RunOptions | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const runParamsByTileRef = useRef(new Map<string, RunOptions>());

  const updateTile = useCallback(
    (id: string, patch: Partial<GenerationTile>) => {
      setTiles((prev) =>
        prev.map((tile) => (tile.id === id ? { ...tile, ...patch } : tile)),
      );
    },
    [],
  );

  const run = useCallback(
    async (options: RunOptions) => {
      const { prompt, models, count, width, height, userAPIKey } = options;

      if (!prompt.trim() || models.length === 0 || count < 1) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const runParams = { prompt, models, count, width, height, userAPIKey };
      const initialTiles = buildTiles(prompt, models, count);
      initialTiles.forEach((tile) => {
        runParamsByTileRef.current.set(tile.id, runParams);
      });
      setTiles((prev) => [...initialTiles, ...prev]);
      setLastPrompt(prompt);
      setLastRunParams(runParams);
      setIsRunning(true);

      const tasks = initialTiles.map((tile) => async () => {
        if (controller.signal.aborted) return;

        try {
          const image = await generateOneImage(
            {
              prompt,
              models,
              count,
              width,
              height,
              userAPIKey,
              model: tile.model,
              variationIndex: tile.variationIndex,
            },
            controller.signal,
          );

          if (!controller.signal.aborted) {
            updateTile(tile.id, { status: "done", image });
          }
        } catch (e) {
          if (controller.signal.aborted) return;
          const message = e instanceof Error ? e.message : String(e);
          updateTile(tile.id, { status: "error", error: message });
        }
      });

      await runWithConcurrency(tasks, MAX_CONCURRENCY);

      if (!controller.signal.aborted) {
        setIsRunning(false);
      }
    },
    [updateTile],
  );

  const retryTile = useCallback(
    async (tileId: string) => {
      const tile = tiles.find((t) => t.id === tileId);
      const runParams = runParamsByTileRef.current.get(tileId) ?? lastRunParams;
      if (!tile || !runParams) return;

      updateTile(tileId, {
        status: "pending",
        error: undefined,
        image: undefined,
      });

      try {
        const image = await generateOneImage({
          ...runParams,
          model: tile.model,
          variationIndex: tile.variationIndex,
        });
        updateTile(tileId, { status: "done", image });
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        updateTile(tileId, { status: "error", error: message });
      }
    },
    [tiles, lastRunParams, updateTile],
  );

  const clear = useCallback(() => {
    abortRef.current?.abort();
    runParamsByTileRef.current.clear();
    setTiles([]);
    setLastPrompt("");
    setLastRunParams(null);
    setIsRunning(false);
  }, []);

  return {
    tiles,
    isRunning,
    lastPrompt,
    lastRunParams,
    run,
    retryTile,
    clear,
  };
}
