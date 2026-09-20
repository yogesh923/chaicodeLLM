import OpenAI from "openai";

let cached = null;

export function getOpenAI() {
  if (cached) return cached;
  cached = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return cached;
}

export async function chatText(prompt, temperature = 0) {
  const client = getOpenAI();
  const res = await client.chat.completions.create({
    model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
    temperature,
    messages: [{ role: "user", content: prompt }],
  });
  return (res.choices[0]?.message?.content || "").trim();
}
