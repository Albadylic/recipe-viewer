"use server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyse(input: string) {
  const prompt = `
    Analysing a picture of food and drink. Describe the visible food and drink items, list ingredients if detectable, and suggest the name for the dish if you can deduce it.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "What's in this image?" },
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
  console.log(response.choices[0]);
}
// main();
