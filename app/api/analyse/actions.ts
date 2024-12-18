"use server";

import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
// import dotenv from "dotenv";
// dotenv.config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Analyse image
export async function analyse(input: string | null) {
  if (!input) {
    return "No image provided";
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "The OPENAI_API_KEY environment variable is missing or empty. Please set it before running the script."
      );
    }

    const stream = createStreamableValue();

    (async () => {
      const { textStream } = await streamText({
        model: openai("gpt-4-turbo"),
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },

              {
                type: "image",
                image_url: {
                  url: input,
                },
              },
            ],
          },
        ],
      });

      for await (const delta of textStream) {
        stream.update(delta);
      }

      stream.done();
    })();

    return { response: stream.value };
  } catch (error) {
    return `Error: ${error.message}`;
  }
}
