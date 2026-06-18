import { headers } from "next/headers";
import { getTogetherApiKey, missingApiKeyResponse } from "@/lib/together";
import {
  getOfferedImageModels,
  type OfferedImageModel,
} from "@/lib/image-models";

export type ImageModel = OfferedImageModel;

export async function GET() {
  const headersList = await headers();
  const userApiKey = headersList.get("x-together-api-key")?.trim();
  const apiKey = userApiKey || getTogetherApiKey();
  if (!apiKey) {
    return missingApiKeyResponse();
  }

  return Response.json(getOfferedImageModels(), {
    headers: {
      "Cache-Control": userApiKey
        ? "private, no-store"
        : "public, max-age=3600",
    },
  });
}

export const runtime = "edge";
