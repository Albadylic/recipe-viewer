"use server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

// Prompt GPT with image data (ingredients), prompt, and chef

const prompt =
  "You are a professional chef. You give recipe instructions which are clear and concise. The recipe will contain steps for creating a dish. The dish will be provided in the prompt. Use the information provided to determine what dish you need to create and provide a recipe.";

export async function generate(input: string) {
  const stream = createStreamableValue();

  (async () => {
    const { textStream } = await streamText({
      model: openai("gpt-4-turbo"),
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: input },
      ],
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { response: stream.value };
}

// Return reponse
