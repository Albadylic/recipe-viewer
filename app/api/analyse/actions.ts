"use server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyse(input: string) {
  const prompt = `
    Analysing this picture of food. Describe the visible food and drink items, list ingredients if detectable, and suggest the name for the dish if you can deduce it.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: input,
            },
          },
        ],
      },
    ],
  });
  return response.choices[0].message.content;
}
