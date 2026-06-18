import Together from "together-ai";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { getTogetherApiKey, missingApiKeyResponse } from "@/lib/together";
import {
  getUnavailableImageModelMessage,
  isOfferedImageModel,
} from "@/lib/image-models";

let ratelimit: Ratelimit | undefined;

// Rate limiting is dormant by default; enable with ENABLE_RATE_LIMIT=true
if (
  process.env.ENABLE_RATE_LIMIT === "true" &&
  process.env.UPSTASH_REDIS_REST_URL
) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.fixedWindow(5, "1440 m"),
    analytics: true,
    prefix: "hive-painter",
  });
}

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = z
    .object({
      prompt: z.string().min(1),
      model: z.string().min(1),
      width: z.number().int().min(256).max(2048),
      height: z.number().int().min(256).max(2048),
      seed: z.number().int().optional(),
      steps: z.number().int().min(1).max(50).optional(),
      userAPIKey: z.string().optional(),
      style: z.string().optional(),
    })
    .safeParse(json);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid generation request" },
      { status: 400 },
    );
  }

  const { prompt, model, width, height, seed, steps, userAPIKey, style } =
    parsed.data;

  if (!isOfferedImageModel(model)) {
    console.warn("[generateImages] unavailable model requested", { model });
    return Response.json(
      { error: getUnavailableImageModelMessage(model) },
      { status: 422 },
    );
  }

  const serverApiKey = getTogetherApiKey();
  if (!serverApiKey && !userAPIKey) {
    return missingApiKeyResponse();
  }

  let options: ConstructorParameters<typeof Together>[0] = {};
  if (process.env.HELICONE_API_KEY) {
    options.baseURL = "https://together.helicone.ai/v1";
    options.defaultHeaders = {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
      "Helicone-Property-BYOK": userAPIKey ? "true" : "false",
    };
  }

  const client = new Together({
    ...options,
    apiKey: userAPIKey || serverApiKey,
  });

  if (ratelimit && !userAPIKey) {
    const identifier = await getIPAddress();
    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      return Response.json(
        "No requests left. Please add your own API key or try again in 24h.",
        { status: 429 },
      );
    }
  }

  let finalPrompt = prompt;
  if (style) {
    finalPrompt += `. Use a ${style} style for the image.`;
  }

  try {
    const response = await client.images.create({
      prompt: finalPrompt,
      model,
      width,
      height,
      seed,
      steps,
      // @ts-expect-error - not typed in the SDK
      response_format: "base64",
    });

    const image = response.data?.[0];
    if (!image?.b64_json) {
      console.error("[generateImages] model returned no image data", {
        model,
      });
      return Response.json(
        { error: "No image data returned" },
        { status: 500 },
      );
    }

    return Response.json(image);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const status =
      typeof e === "object" &&
      e !== null &&
      "status" in e &&
      typeof e.status === "number"
        ? e.status
        : 500;

    console.error("[generateImages] model unavailable or generation failed", {
      model,
      status,
      message,
    });

    return Response.json({ error: message }, { status });
  }
}

export const runtime = "edge";

async function getIPAddress() {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  return headersList.get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}
