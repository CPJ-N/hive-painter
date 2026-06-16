"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/spinner";
import useImageModels from "@/hooks/useImageModels";
import { cn } from "@/lib/utils";
import CheckIcon from "@/components/icons/check-icon";

type ModelSelectorProps = {
  selectedModelIds: string[];
  onChange: (modelIds: string[]) => void;
  userAPIKey?: string;
};

export default function ModelSelector({
  selectedModelIds,
  onChange,
  userAPIKey,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const {
    data: models,
    isLoading,
    isError,
    error,
  } = useImageModels(userAPIKey);

  const filteredModels = useMemo(() => {
    if (!models) return [];
    const query = search.trim().toLowerCase();
    if (!query) return models;
    return models.filter(
      (model) =>
        model.id.toLowerCase().includes(query) ||
        model.displayName.toLowerCase().includes(query) ||
        model.organization.toLowerCase().includes(query),
    );
  }, [models, search]);

  const toggleModel = (modelId: string) => {
    if (selectedModelIds.includes(modelId)) {
      onChange(selectedModelIds.filter((id) => id !== modelId));
    } else {
      onChange([...selectedModelIds, modelId]);
    }
  };

  const label =
    selectedModelIds.length === 0
      ? "Select models"
      : `${selectedModelIds.length} model${selectedModelIds.length === 1 ? "" : "s"}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-350/80 bg-gray-400/50 px-3 py-1.5 text-sm text-gray-200 transition hover:border-emerald-500/25 hover:bg-gray-400/70"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-70"
          >
            <path
              d="M4 7h16M4 12h16M4 17h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {label}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-gray-350/80 bg-gray-500/95 p-6 shadow-panel backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-gray-100">
            Select image models
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Choose one or more Together AI image models. Each selected model
            will generate images when you run.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Search models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-gray-350/80 bg-gray-400/60 text-gray-100 placeholder:text-gray-300/60 focus-visible:ring-emerald-500/30"
        />

        <div className="max-h-[50vh] overflow-y-auto rounded-md border border-gray-350/70 bg-gray-400/40">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-gray-300">
              <Spinner className="size-4" />
              Loading models...
            </div>
          ) : isError ? (
            <p className="p-4 text-sm text-red-400">
              {error instanceof Error
                ? error.message
                : "Failed to load models."}
            </p>
          ) : filteredModels.length === 0 ? (
            <p className="p-4 text-sm text-gray-300">No models found.</p>
          ) : (
            <ul className="divide-y divide-gray-350">
              {filteredModels.map((model) => {
                const selected = selectedModelIds.includes(model.id);
                return (
                  <li key={model.id}>
                    <button
                      type="button"
                      onClick={() => toggleModel(model.id)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-gray-500/60",
                        selected && "bg-emerald-500/10",
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-100">
                          {model.displayName}
                        </p>
                        <p className="truncate text-xs text-gray-300">
                          {model.id}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "inline-flex size-5 shrink-0 items-center justify-center rounded border border-gray-350",
                          selected
                            ? "border-emerald-400/60 bg-emerald-500 text-gray-100"
                            : "border-gray-350/80 bg-transparent text-transparent",
                        )}
                      >
                        <CheckIcon />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {selectedModelIds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedModelIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleModel(id)}
                className="rounded-full border border-gray-350/70 bg-gray-400/50 px-2 py-1 text-xs text-gray-200 transition hover:border-emerald-500/40 hover:text-emerald-400"
              >
                {id.split("/").pop()} ×
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
