import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);

  const { prompt } = body as { prompt: string };

  const result = await streamText({
    model: openai("gpt-3.5-turbo"),
    prompt,
  });

  return result.toDataStreamResponse();
}
