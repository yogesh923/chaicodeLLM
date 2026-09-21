import { getOpenAI } from "../query/llm.js";
import { buildContext } from "../retrieval/topk.js";

const SYSTEM = `Answer the user question using ONLY the context below. Cite sources like [1], [2] after each claim. If the context is insufficient, say you don't know. Keep it concise.`;

export async function answerQuery(originalQuery, topK) {
  const docs = Array.isArray(topK) ? topK : [];
  const context = typeof topK === "string" ? topK : buildContext(docs);

  if (!context) {
    return { answer: "I don't know — no relevant context found.", sources: [] };
  }

  const client = getOpenAI();
  const res = await client.chat.completions.create({
    model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
    temperature: 0,
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `Question: ${originalQuery}\n\nContext:\n${context}`,
      },
    ],
  });

  return {
    answer: (res.choices[0]?.message?.content || "").trim(),
    sources: docs.map((d, i) => ({
      n: i + 1,
      origin: d._origin || "mixed",
      source: d.source || d.key || d._key || "unknown",
      score: d._rrfScore ?? null,
    })),
  };
}
