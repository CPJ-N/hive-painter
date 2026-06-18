export const MISSING_API_KEY_MESSAGE =
  "Add your Together API key in the navbar to start generating images.";

export function getTogetherApiKey(): string | undefined {
  const key = process.env.TOGETHER_API_KEY?.trim();
  return key || undefined;
}

export function missingApiKeyResponse() {
  return Response.json(
    { error: MISSING_API_KEY_MESSAGE, code: "MISSING_API_KEY" },
    { status: 401 },
  );
}
