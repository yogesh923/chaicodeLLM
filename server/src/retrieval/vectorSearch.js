import { searchVectors } from "../adapters/vectordb.js";

export function buildQueryTexts(enhanced) {
  const texts = [
    enhanced.query,
    enhanced.rewritten,
    enhanced.stepBack,
    enhanced.hypothetical,
    ...(enhanced.subqueries || []),
  ].filter(Boolean);
  return [...new Set(texts)];
}

export async function searchVectorByTexts(texts, k = 5) {
  const perText = await Promise.all(
    texts.map((t) => searchVectors(t, k).catch(() => []))
  );
  const seen = new Set();
  const merged = [];
  perText.flat().forEach((doc) => {
    const key = doc.pageContent?.slice(0, 200);
    if (key && !seen.has(key)) {
      seen.add(key);
      merged.push({
        content: doc.pageContent,
        metadata: doc.metadata || {},
      });
    }
  });
  return merged.slice(0, k * texts.length);
}
