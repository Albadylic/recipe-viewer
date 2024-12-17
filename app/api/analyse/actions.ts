import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Analyse image
export async function analyse(input: string | null) {
  if (input === null) {
    return "No image provided";
  } else {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyse the food and drink in this picture. List the ingredients you can detect. If you can identify the name of the dish, state that name.",
            },
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

    return response.choices[0];
  }
}
