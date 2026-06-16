import { useQuery } from "@tanstack/react-query";
import { MISSING_API_KEY_MESSAGE } from "@/lib/together";

export type ImageModel = {
  id: string;
  displayName: string;
  organization: string;
};

export class ModelsFetchError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "ModelsFetchError";
    this.code = code;
  }
}

async function fetchImageModels(userAPIKey?: string): Promise<ImageModel[]> {
  const headers: HeadersInit = {};
  const key = userAPIKey?.trim();
  if (key) {
    headers["x-together-api-key"] = key;
  }

  const res = await fetch("/api/models", { headers });
  const text = await res.text();

  if (!res.ok) {
    try {
      const parsed = JSON.parse(text) as { error?: string; code?: string };
      throw new ModelsFetchError(
        parsed.error ?? "Failed to load image models",
        parsed.code,
      );
    } catch (e) {
      if (e instanceof ModelsFetchError) throw e;
      throw new ModelsFetchError(text || "Failed to load image models");
    }
  }

  return JSON.parse(text) as ImageModel[];
}

export default function useImageModels(userAPIKey?: string) {
  const key = userAPIKey?.trim();
  const keyFingerprint = key ? `${key.length}:${key.slice(-6)}` : "server";

  return useQuery({
    queryKey: ["image-models", keyFingerprint],
    queryFn: () => fetchImageModels(key),
    staleTime: 60 * 60 * 1000,
    retry: (failureCount, error) => {
      if (
        error instanceof ModelsFetchError &&
        error.code === "MISSING_API_KEY"
      ) {
        return false;
      }
      return failureCount < 2;
    },
    meta: { suppressToast: true },
  });
}

export { MISSING_API_KEY_MESSAGE };
