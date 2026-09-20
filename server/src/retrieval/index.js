export { buildQueryTexts, searchVectorByTexts } from "./vectorSearch.js";
export { searchPostgresByTexts } from "./postgresSearch.js";
export { searchS3ByTexts } from "./s3Search.js";

import { buildQueryTexts, searchVectorByTexts } from "./vectorSearch.js";
import { searchPostgresByTexts } from "./postgresSearch.js";
import { searchS3ByTexts } from "./s3Search.js";

export async function searchAll(enhanced, { k = 5 } = {}) {
  const texts = buildQueryTexts(enhanced);
  const [vector, postgres, s3] = await Promise.allSettled([
    searchVectorByTexts(texts, k),
    searchPostgresByTexts(texts),
    searchS3ByTexts(texts),
  ]);
  const pick = (r) =>
    r.status === "fulfilled"
      ? { ok: true, results: r.value }
      : { ok: false, results: [], error: r.reason?.message };
  return { texts, vector: pick(vector), postgres: pick(postgres), s3: pick(s3) };
}
