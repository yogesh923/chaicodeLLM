import { query } from "../adapters/postgres.js";

function keywords(text) {
  return String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((w) => w.length >= 4)
    .slice(0, 10);
}

export async function searchPostgresByTexts(texts, limit = 20) {
  const words = [...new Set(texts.flatMap(keywords))];
  if (!words.length) return [];
  const conditions = words.map((_, i) => `content ILIKE $${i + 1}`).join(" OR ");
  const params = words.map((w) => `%${w}%`);
  const res = await query(
    `SELECT id, source, source_type, LEFT(content, 500) AS snippet
     FROM documents WHERE ${conditions} LIMIT $${words.length + 1}`,
    [...params, limit]
  );
  return res.rows;
}
