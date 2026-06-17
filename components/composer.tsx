"use client";

import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import ModelSelector from "@/components/model-selector";
import CountStepper from "@/components/count-stepper";
import Spinner from "@/components/spinner";
import {
  ASPECT_RATIOS,
  DEFAULT_ASPECT_RATIO,
  DEFAULT_MODEL_IDS,
  DEFAULT_VARIATION_COUNT,
} from "@/lib/config";
import useImageModels, {
  MISSING_API_KEY_MESSAGE,
  ModelsFetchError,
} from "@/hooks/useImageModels";
import { ArrowUp, Plus, SlidersHorizontal } from "lucide-react";

export type ComposerSubmitParams = {
  prompt: string;
  models: string[];
  count: number;
  width: number;
  height: number;
};

type ComposerProps = {
  onRun: (params: ComposerSubmitParams) => void;
  isRunning: boolean;
  userAPIKey?: string;
};

function getDefaultCountForModelCount(modelCount: number) {
  return modelCount === 1 ? DEFAULT_VARIATION_COUNT : 1;
}

export default function Composer({
  onRun,
  isRunning,
  userAPIKey,
}: ComposerProps) {
  const promptRef = useRef<HTMLTextAreaElement | null>(null);
  const [prompt, setPrompt] = useState("");
  const [selectedModelIds, setSelectedModelIds] =
    useState<string[]>(DEFAULT_MODEL_IDS);
  const [count, setCount] = useState(() =>
    getDefaultCountForModelCount(DEFAULT_MODEL_IDS.length),
  );
  const [aspectRatio, setAspectRatio] = useState(DEFAULT_ASPECT_RATIO.value);
  const { data: models, isError, error } = useImageModels(userAPIKey);
  const configError =
    isError &&
    error instanceof ModelsFetchError &&
    error.code === "MISSING_API_KEY";

  useEffect(() => {
    if (!models?.length) return;
    setSelectedModelIds((current) => {
      const valid = current.filter((id) =>
        models.some((model) => model.id === id),
      );
      if (valid.length > 0) return valid;
      return models.slice(0, 2).map((model) => model.id);
    });
  }, [models]);

  useEffect(() => {
    setCount(getDefaultCountForModelCount(selectedModelIds.length));
  }, [selectedModelIds.length]);

  const selectedAspect =
    ASPECT_RATIOS.find((ratio) => ratio.value === aspectRatio) ??
    DEFAULT_ASPECT_RATIO;

  const totalImages = selectedModelIds.length * count;
  const canRun =
    prompt.trim().length > 0 &&
    selectedModelIds.length > 0 &&
    !isRunning &&
    !configError;

  const handleRun = () => {
    if (!canRun) return;
    onRun({
      prompt: prompt.trim(),
      models: selectedModelIds,
      count,
      width: selectedAspect.width,
      height: selectedAspect.height,
    });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, selectedModelIds, count, aspectRatio, isRunning]);

  return (
    <section className="rounded-[22px] border border-gray-100/20 bg-[#171817]/[.92] px-4 py-3 shadow-[0_24px_90px_-28px_rgba(0,0,0,0.95)] backdrop-blur-md">
      {configError && (
        <p className="mb-3 rounded-md border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {MISSING_API_KEY_MESSAGE}
        </p>
      )}

      <div className="relative">
        <Textarea
          ref={promptRef}
          rows={3}
          spellCheck={false}
          placeholder="Describe your image..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[76px] resize-none border-0 bg-transparent px-3 py-3 text-base leading-6 text-gray-100 shadow-none placeholder:text-gray-300/60 focus-visible:ring-0 sm:min-h-[88px]"
        />
      </div>

      <div className="mt-1 flex flex-col gap-3 px-1 pb-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => promptRef.current?.focus()}
            className="inline-flex size-9 items-center justify-center rounded-full border border-gray-100/10 bg-gray-500/75 text-gray-200 transition hover:border-honey-300/40 hover:text-honey-300"
            aria-label="Focus prompt"
          >
            <Plus className="size-4" aria-hidden />
          </button>

          <div className="min-w-[150px]">
            <label className="sr-only">Models</label>
            <ModelSelector
              userAPIKey={userAPIKey}
              selectedModelIds={selectedModelIds}
              onChange={setSelectedModelIds}
              showChangeLabel={false}
              triggerClassName="h-9 rounded-full bg-gray-500/75 px-3 text-gray-200 hover:bg-gray-400"
            />
          </div>

          <div className="w-[92px]">
            <label className="sr-only">Frame</label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger
                aria-label="Aspect ratio"
                className="h-9 rounded-full border-gray-100/10 bg-gray-500/75 px-3 text-sm text-gray-200 shadow-none transition hover:border-moss-300/40 hover:bg-gray-400 focus:ring-moss-300/40"
              >
                <span>{selectedAspect.label}</span>
              </SelectTrigger>
              <SelectContent className="border-gray-100/10 bg-gray-500 text-gray-100">
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem
                    key={ratio.value}
                    value={ratio.value}
                    className="focus:bg-moss-500/20 focus:text-gray-100"
                  >
                    {ratio.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <CountStepper
            value={count}
            onChange={setCount}
            className="h-9 rounded-full bg-gray-500/75"
          />
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-gray-300">
            <SlidersHorizontal className="size-4" aria-hidden />
            {totalImages} image{totalImages === 1 ? "" : "s"}
          </span>
          <Button
            type="button"
            size="icon"
            onClick={handleRun}
            disabled={!canRun}
            aria-label="Run generation"
            className="size-11 rounded-full border border-gray-100/20 bg-gray-100 text-gray-600 shadow-tile transition hover:border-honey-300/60 hover:bg-honey-300 disabled:opacity-45"
          >
            {isRunning ? (
              <Spinner className="size-4" />
            ) : (
              <ArrowUp className="size-5" aria-hidden />
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
