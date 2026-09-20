export { checkQueryGuardrails } from "./guardrails.js";
export { stepBackPrompting } from "./stepback.js";
export { rewriteQuery } from "./rewrite.js";
export { splitIntoSubqueries } from "./subqueries.js";
export { hydeQuery } from "./hyde.js";

import { checkQueryGuardrails } from "./guardrails.js";
import { stepBackPrompting } from "./stepback.js";
import { rewriteQuery } from "./rewrite.js";
import { splitIntoSubqueries } from "./subqueries.js";
import { hydeQuery } from "./hyde.js";

export async function enhanceQuery(input) {
  const guard = checkQueryGuardrails(input);
  if (!guard.ok) return { ok: false, ...guard };
  const query = guard.query;

  const [stepBack, rewritten, sub, hyde] = await Promise.all([
    stepBackPrompting(query),
    rewriteQuery(query),
    splitIntoSubqueries(query),
    hydeQuery(query),
  ]);

  return {
    ok: true,
    query,
    ...stepBack,
    ...rewritten,
    ...sub,
    ...hyde,
  };
}
