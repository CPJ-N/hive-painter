export type OfferedImageModel = {
  id: string;
  displayName: string;
  organization: string;
};

export const OFFERED_IMAGE_MODELS = [
  {
    id: "ByteDance-Seed/Seedream-4.0",
    displayName: "ByteDance Seedream 4.0",
    organization: "ByteDance",
  },
  {
    id: "ByteDance/Seedream-5.0-lite",
    displayName: "ByteDance Seedream 5.0 Lite",
    organization: "ByteDance",
  },
  {
    id: "black-forest-labs/FLUX.1-schnell",
    displayName: "FLUX.1 Schnell",
    organization: "Black Forest Labs",
  },
  {
    id: "black-forest-labs/FLUX.1-kontext-pro",
    displayName: "FLUX.1 Kontext [pro]",
    organization: "Black Forest Labs",
  },
  {
    id: "black-forest-labs/FLUX.1-kontext-max",
    displayName: "FLUX.1 Kontext [max]",
    organization: "Black Forest Labs",
  },
  {
    id: "black-forest-labs/FLUX.2-dev",
    displayName: "FLUX.2 [dev]",
    organization: "Black Forest Labs",
  },
  {
    id: "black-forest-labs/FLUX.2-flex",
    displayName: "FLUX.2 [flex]",
    organization: "Black Forest Labs",
  },
  {
    id: "black-forest-labs/FLUX.2-pro",
    displayName: "FLUX.2 [pro]",
    organization: "Black Forest Labs",
  },
  {
    id: "google/gemini-3-pro-image",
    displayName: "Gemini 3 Image",
    organization: "Google",
  },
  {
    id: "google/flash-image-3.1",
    displayName: "Gemini 3.1 Flash Image",
    organization: "Google",
  },
  {
    id: "google/flash-image-2.5",
    displayName: "Gemini Flash Image 2.5",
    organization: "Google",
  },
  {
    id: "openai/gpt-image-1.5",
    displayName: "GPT Image 1.5",
    organization: "OpenAI",
  },
  {
    id: "openai/gpt-image-2",
    displayName: "GPT Image 2",
    organization: "OpenAI",
  },
  {
    id: "ideogram/ideogram-4.0",
    displayName: "Ideogram 4.0",
    organization: "Ideogram",
  },
  {
    id: "Qwen/Qwen-Image-2.0",
    displayName: "Qwen Image 2.0",
    organization: "Qwen",
  },
  {
    id: "Qwen/Qwen-Image-2.0-Pro",
    displayName: "Qwen Image 2.0 Pro",
    organization: "Qwen",
  },
  {
    id: "Wan-AI/Wan2.6-image",
    displayName: "Wan 2.6 Image",
    organization: "Wan-AI",
  },
] satisfies OfferedImageModel[];

const OFFERED_IMAGE_MODEL_IDS = new Set(
  OFFERED_IMAGE_MODELS.map((model) => model.id.toLowerCase()),
);

export function getOfferedImageModels() {
  return OFFERED_IMAGE_MODELS;
}

export function isOfferedImageModel(modelId: string) {
  return OFFERED_IMAGE_MODEL_IDS.has(modelId.toLowerCase());
}

export function getUnavailableImageModelMessage(modelId: string) {
  return `${modelId} is not available in Hive Painter. Choose another model.`;
}
