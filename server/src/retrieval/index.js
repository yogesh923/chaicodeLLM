export { buildQueryTexts, searchVectorByTexts } from "./vectorSearch.js";
export { searchPostgresByTexts } from "./postgresSearch.js";
export { searchS3ByTexts } from "./s3Search.js";
export { reciprocalRankFusion, fuseRetrieval } from "./rrf.js";
export { getTopK, buildContext } from "./topk.js";

import { buildQueryTexts, searchVectorByTexts } from "./vectorSearch.js";
import { searchPostgresByTexts } from "./postgresSearch.js";
import { searchS3ByTexts } from "./s3Search.js";
import { fuseRetrieval } from "./rrf.js";
import { getTopK, buildContext } from "./topk.js";

export async function searchAll(
  enhanced,
  { k = 5, fusedLimit = 20, topK = 5 } = {}
) {
  const texts = buildQueryTexts(enhanced);
  const [vectorRes, postgresRes, s3Res] = await Promise.allSettled([
    searchVectorByTexts(texts, k),
    searchPostgresByTexts(texts),
    searchS3ByTexts(texts),
  ]);
  const pick = (r) =>
    r.status === "fulfilled"
      ? { ok: true, results: r.value }
      : { ok: false, results: [], error: r.reason?.message };
  const vector = pick(vectorRes);
  const postgres = pick(postgresRes);
  const s3 = pick(s3Res);
  const fused = fuseRetrieval(
    { vector: vector.results, postgres: postgres.results, s3: s3.results },
    { limit: fusedLimit }
  );
  const top = getTopK(fused, topK);
  const context = buildContext(top);
  return { texts, vector, postgres, s3, fused, topK: top, context };
}
