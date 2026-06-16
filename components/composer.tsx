"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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

export default function Composer({
  onRun,
  isRunning,
  userAPIKey,
}: ComposerProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedModelIds, setSelectedModelIds] =
    useState<string[]>(DEFAULT_MODEL_IDS);
  const [count, setCount] = useState(DEFAULT_VARIATION_COUNT);
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
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-6">
      <div className="pointer-events-auto w-full max-w-3xl rounded-xl border border-gray-300/45 bg-gray-500 p-4 shadow-[0_0_0_1px_rgba(61,115,88,0.35),0_24px_80px_-18px_rgba(0,0,0,0.95)] ring-1 ring-emerald-300/20 backdrop-blur-md">
        {configError && (
          <p className="mb-3 rounded-md border border-[#7A6120] bg-[#201A0C] px-3 py-2 text-xs text-[#F2D68A]">
            {MISSING_API_KEY_MESSAGE}
          </p>
        )}
        <div className="relative">
          <Textarea
            rows={3}
            spellCheck={false}
            placeholder="Describe your image..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full resize-none border-gray-300/45 bg-gray-400 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-200/65 focus-visible:ring-emerald-300/35"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <ModelSelector
            userAPIKey={userAPIKey}
            selectedModelIds={selectedModelIds}
            onChange={setSelectedModelIds}
          />

          <Select value={aspectRatio} onValueChange={setAspectRatio}>
            <SelectTrigger className="h-auto w-auto border-gray-300/45 bg-gray-400 px-3 py-1.5 text-sm text-gray-100 transition hover:border-emerald-300/40 hover:bg-gray-400/90">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-gray-350 bg-gray-500 text-gray-100">
              {ASPECT_RATIOS.map((ratio) => (
                <SelectItem key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <CountStepper value={count} onChange={setCount} />

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-xs text-gray-200/80 sm:inline">
              Will run {count}x on {selectedModelIds.length} model
              {selectedModelIds.length === 1 ? "" : "s"} ({totalImages} images)
            </span>
            <Button
              type="button"
              onClick={handleRun}
              disabled={!canRun}
              className="border-emerald-500/40 bg-emerald-500 font-medium text-gray-100 shadow-sm transition hover:border-emerald-400/50 hover:bg-emerald-400 disabled:opacity-40"
            >
              {isRunning ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Running...
                </>
              ) : (
                <>
                  Run
                  <span className="ml-2 hidden text-xs opacity-70 sm:inline">
                    ⌘↵
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
