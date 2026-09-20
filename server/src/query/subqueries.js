import { chatText } from "./llm.js";

export async function splitIntoSubqueries(query) {
  const text = await chatText(
    `Break the user question below into 2-4 smaller standalone sub-questions that together cover it. Return one sub-question per line, no numbering, no extra text.\n\nQuestion: ${query}`,
    0
  );
  const subqueries = text
    .split("\n")
    .map((l) => l.replace(/^\s*[\d.\-*)]+\s*/, "").trim())
    .filter(Boolean);
  return { subqueries };
}
