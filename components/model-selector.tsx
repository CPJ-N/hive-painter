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
import { ListFilter, Search } from "lucide-react";

type ModelSelectorProps = {
  selectedModelIds: string[];
  onChange: (modelIds: string[]) => void;
  userAPIKey?: string;
  triggerClassName?: string;
  showChangeLabel?: boolean;
};

export default function ModelSelector({
  selectedModelIds,
  onChange,
  userAPIKey,
  triggerClassName,
  showChangeLabel = true,
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
          className={cn(
            "inline-flex h-11 w-full items-center justify-between gap-3 rounded-md border border-gray-100/10 bg-gray-400/80 px-3 text-sm text-gray-100 shadow-none transition hover:border-moss-300/40 hover:bg-gray-400",
            triggerClassName,
          )}
        >
          <span className="inline-flex min-w-0 items-center gap-2">
            <ListFilter className="size-4 shrink-0 text-moss-300" aria-hidden />
            <span className="truncate">{label}</span>
          </span>
          {showChangeLabel && (
            <span className="text-xs text-gray-300">Change</span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-md border-gray-100/10 bg-gray-500/95 p-6 shadow-panel backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Models</DialogTitle>
          <DialogDescription className="text-gray-300">
            {selectedModelIds.length} selected
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-300"
            aria-hidden
          />
          <Input
            placeholder="Search models..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 border-gray-100/10 bg-gray-400/75 pl-9 text-gray-100 placeholder:text-gray-300/60 focus-visible:ring-moss-300/40"
          />
        </div>

        <div className="max-h-[50vh] overflow-y-auto rounded-md border border-gray-100/10 bg-gray-600/50">
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
                        "flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-gray-400/60",
                        selected && "bg-moss-500/20",
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
                          "inline-flex size-5 shrink-0 items-center justify-center rounded border border-gray-100/20",
                          selected
                            ? "border-moss-300/60 bg-moss-500 text-gray-100"
                            : "bg-transparent text-transparent",
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
                className="rounded-md border border-gray-100/10 bg-gray-400/80 px-2 py-1 text-xs text-gray-200 transition hover:border-honey-300/40 hover:text-honey-300"
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
