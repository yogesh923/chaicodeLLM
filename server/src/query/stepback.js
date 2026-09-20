import { chatText } from "./llm.js";

export async function stepBackPrompting(query) {
  const stepBack = await chatText(
    `Given the user question below, write one general principle or background concept needed to answer it. Return only that principle in one sentence.\n\nQuestion: ${query}`,
    0
  );
  return { stepBack };
}
