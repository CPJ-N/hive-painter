import Together from "together-ai";
import { headers } from "next/headers";
import { getTogetherApiKey, missingApiKeyResponse } from "@/lib/together";

export type ImageModel = {
  id: string;
  displayName: string;
  organization: string;
};

let cachedModels: ImageModel[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function fetchImageModels(apiKey: string): Promise<ImageModel[]> {
  const client = new Together({ apiKey });

  const models = await client.models.list();

  return models
    .filter((model) => model.type === "image")
    .map((model) => ({
      id: model.id,
      displayName: model.display_name ?? model.id,
      organization: model.organization ?? "",
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export async function GET() {
  const headersList = await headers();
  const userApiKey = headersList.get("x-together-api-key")?.trim();
  const apiKey = userApiKey || getTogetherApiKey();
  if (!apiKey) {
    return missingApiKeyResponse();
  }

  const now = Date.now();

  if (!userApiKey && cachedModels && now - cacheTimestamp < CACHE_TTL_MS) {
    return Response.json(cachedModels, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  }

  try {
    const models = await fetchImageModels(apiKey);
    if (!userApiKey) {
      cachedModels = models;
      cacheTimestamp = now;
    }

    return Response.json(models, {
      headers: {
        "Cache-Control": userApiKey
          ? "private, no-store"
          : "public, max-age=3600",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return Response.json({ error: message }, { status: 500 });
  }
}

export const runtime = "edge";
