import { getOpenAI } from "../query/llm.js";

export const PASS_SCORE = 0.7;

export async function gradeAnswer(originalQuery, context, answer) {
  if (!answer || !answer.trim() || /don't know/i.test(answer)) {
    return { score: 0, pass: false, reason: "Empty or abstained answer." };
  }
  const client = getOpenAI();
  const res = await client.chat.completions.create({
    model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          'Judge if the answer is grounded in the context and addresses the question. Return JSON only: {"score": 0-1, "reason": "..."}.',
      },
      {
        role: "user",
        content: `Question: ${originalQuery}\n\nContext:\n${context}\n\nAnswer:\n${answer}`,
      },
    ],
  });
  try {
    const parsed = JSON.parse(res.choices[0]?.message?.content || "{}");
    const score = Number(parsed.score) || 0;
    return { score, pass: score >= PASS_SCORE, reason: parsed.reason || "" };
  } catch {
    return { score: 0, pass: false, reason: "Grade parse failed." };
  }
}
