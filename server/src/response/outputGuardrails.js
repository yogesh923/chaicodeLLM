const PII_PATTERNS = [
  { type: "email", regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
  { type: "phone", regex: /(?:\+91[\s-]?)?[6-9]\d{9}\b/g },
  { type: "credit_card", regex: /\b(?:\d[ -]?){12,18}\d\b/g },
  { type: "aadhaar", regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/g },
  { type: "pan", regex: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g },
];

const BLOCK_SENSITIVE = new Set(["aadhaar", "credit_card"]);
const MAX_LENGTH = 4000;

export function checkOutputGuardrails(answer) {
  const text = String(answer ?? "").trim();
  if (!text) return { ok: false, answer: text, reason: "Empty response." };
  if (text.length > MAX_LENGTH) {
    return { ok: false, answer: text, reason: "Response too long." };
  }

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

  if (detected.some((t) => BLOCK_SENSITIVE.has(t))) {
    return {
      ok: false,
      answer: redacted,
      reason: `Blocked: sensitive PII in response (${detected.join(", ")}).`,
    };
  }
  return { ok: true, answer: redacted, detected, redacted: detected.length > 0 };
}
