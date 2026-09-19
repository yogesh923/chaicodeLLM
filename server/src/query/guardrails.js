const MAX_LENGTH = 2000;

const BLOCKED_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+your\s+(system\s+)?prompt/i,
  /reveal\s+(your\s+)?system\s+prompt/i,
  /disregard\s+(all\s+)?(previous|above)/i,
  /jailbreak/i,
  /\bDAN\b/,
  /do\s+anything\s+now/i,
  /developer\s+mode/i,
  /bypass\s+(safety|filter|guardrail)/i,
];

const PII_PATTERNS = [
  { type: "email", regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
  { type: "phone", regex: /(?:\+91[\s-]?)?[6-9]\d{9}\b/g },
  { type: "credit_card", regex: /\b(?:\d[ -]?){12,18}\d\b/g },
  { type: "aadhaar", regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/g },
  { type: "pan", regex: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g },
];

const BLOCK_SENSITIVE = new Set(["aadhaar", "credit_card"]);

function redactPii(text) {
  let redacted = text;
  const detected = [];
  for (const { type, regex } of PII_PATTERNS) {
    regex.lastIndex = 0;
    if (regex.test(redacted)) {
      detected.push(type);
      regex.lastIndex = 0;
      redacted = redacted.replace(regex, `[REDACTED_${type.toUpperCase()}]`);
    }
  }
  return { redacted, detected };
}
export function checkQueryGuardrails(input) {
  const query = String(input ?? "").trim();

  if (!query) {
    return { ok: false, query, reason: "Query is empty." };
  }

  if (query.length > MAX_LENGTH) {
    return {
      ok: false,
      query,
      reason: `Query too long (${query.length}/${MAX_LENGTH} chars).`,
    };
  }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(query)) {
      return {
        ok: false,
        query,
        reason: "Blocked: prompt-injection pattern detected.",
      };
    }
  }

  const { redacted, detected } = redactPii(query);

  if (detected.some((t) => BLOCK_SENSITIVE.has(t))) {
    return {
      ok: false,
      query: redacted,
      reason: `Blocked: sensitive PII detected (${detected.join(", ")}).`,
      detected,
      redacted: true,
    };
  }

  if (detected.length) {
    return { ok: true, query: redacted, detected, redacted: true };
  }

  return { ok: true, query };
}
