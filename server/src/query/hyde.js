import { chatText } from "./llm.js";

export async function hydeQuery(query) {
  const hypothetical = await chatText(
    `Write a short hypothetical document passage (4-6 sentences) that would directly answer the question below. Write it as factual content, not as an explanation.\n\nQuestion: ${query}`,
    0.7
  );
  return { hypothetical };
}
