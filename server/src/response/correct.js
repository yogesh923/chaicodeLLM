import { searchAll } from "../retrieval/index.js";
import { answerQuery } from "./answer.js";
import { gradeAnswer, PASS_SCORE } from "./grade.js";
import { checkOutputGuardrails } from "./outputGuardrails.js";

export async function askWithCorrection(
  enhanced,
  { k = 5, fusedLimit = 20, topK = 5, maxRetries = 1, threshold = PASS_SCORE } = {}
) {
  let opts = { k, fusedLimit, topK };
  let best = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const retrieval = await searchAll(enhanced, opts);
    const { answer, sources } = await answerQuery(
      enhanced.query,
      retrieval.topK
    );
    const grade = await gradeAnswer(enhanced.query, retrieval.context, answer);
    const pass = grade.score >= threshold;
    if (!best || grade.score > best.grade.score) {
      best = { retrieval, answer, sources, grade, attempt };
    }
    if (pass) break;
    opts = { ...opts, k: opts.k + 5, topK: opts.topK + 3 };
  }

  const guard = checkOutputGuardrails(best.answer);
  return {
    answer: guard.answer,
    sources: best.sources,
    score: best.grade.score,
    pass: best.grade.pass && guard.ok,
    retries: best.attempt,
    guard,
  };
}
