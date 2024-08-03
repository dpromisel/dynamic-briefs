import { openai } from "@ai-sdk/openai";
import { CoreMessage, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const json = (await req.json()) as { messages: CoreMessage[] };
  const { messages } = json;

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages,
  });

  return result.toDataStreamResponse();
}
