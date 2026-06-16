export const MISSING_API_KEY_MESSAGE =
  "Server is not configured. Add TOGETHER_API_KEY to .env.local or enter your Together API key in the navbar.";

export function getTogetherApiKey(): string | undefined {
  const key = process.env.TOGETHER_API_KEY?.trim();
  return key || undefined;
}

export function missingApiKeyResponse() {
  return Response.json(
    { error: MISSING_API_KEY_MESSAGE, code: "MISSING_API_KEY" },
    { status: 503 },
  );
}
