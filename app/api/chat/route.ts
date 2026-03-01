import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { zbdFetch } from "@/lib/zbd";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { messages, contextUrl } = await req.json();

  let systemPrompt = "You are a helpful assistant.";

  if (contextUrl && typeof contextUrl === "string") {
    try {
      const contextRes = await zbdFetch(contextUrl);
      const context = await contextRes.text();
      systemPrompt = `You are a helpful assistant. Use this paid context to inform your response:\n\n${context}`;
    } catch {
      // Continue without paid context — don't block the chat
    }
  }

  const result = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
