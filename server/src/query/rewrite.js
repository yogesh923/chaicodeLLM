import { chatText } from "./llm.js";

export async function rewriteQuery(query) {
  const rewritten = await chatText(
    `Rewrite the user question below as a clear, self-contained search query for a vector database. Expand abbreviations, keep names and key terms. Return only the rewritten query.\n\nQuestion: ${query}`,
    0
  );
  return { rewritten };
}
