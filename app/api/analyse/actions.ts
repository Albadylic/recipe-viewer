import OpenAI from "openai";

// Analyse image
export async function analyse(input: string | null) {
  console.log({ input });

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

    const openai = new OpenAI({ apiKey: apiKey });

    const prompt = `
    Analysing a picture of food and drink.
    Input Image URL: ${input}
    Describe the visible food and drink items, list ingredients if detectable, and suggest a potential name for the dish.
  `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content.trim();
    } else {
      return "No response from the AI model.";
    }
  } catch (error) {
    return `Error: ${error.message}`;
  }
}
