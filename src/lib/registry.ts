import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { gateway } from "@ai-sdk/gateway";
import { createProviderRegistry } from "ai";

export const registry = createProviderRegistry({
  pollinations: createOpenAICompatible({
    apiKey: process.env.POLLINATIONS_API_KEY,
    baseURL: "https://text.pollinations.ai/openai",
    name: "pollinations",
  }),

  openrouter: createOpenAICompatible({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    name: "openrouter",
  }),

  gateway,
});
