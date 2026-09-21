const RRF_K = 60;

function keyOf(doc) {
  if (doc.id != null) return `pg:${doc.id}`;
  if (doc.key) return `s3:${doc.bucket}/${doc.key}`;
  const text = doc.content || doc.snippet || "";
  return `txt:${text.slice(0, 200)}`;
}

function normalize(doc, origin) {
  return {
    ...doc,
    _origin: origin,
    _key: keyOf(doc),
  };
}

export function reciprocalRankFusion(lists, { k = RRF_K, limit = 20 } = {}) {
  const scores = new Map();
  lists.forEach((list) => {
    (list || []).forEach((raw, i) => {
      const doc = normalize(raw, raw._origin || "mixed");
      const prev = scores.get(doc._key);
      const score = 1 / (k + (i + 1));
      if (prev) {
        prev._rrfScore += score;
        if (!prev._sources.includes(doc._origin)) {
          prev._sources.push(doc._origin);
        }
      } else {
        scores.set(doc._key, {
          ...doc,
          _rrfScore: score,
          _sources: [doc._origin],
        });
      }
    });
  });
  return [...scores.values()]
    .sort((a, b) => b._rrfScore - a._rrfScore)
    .slice(0, limit);
}

export function fuseRetrieval({ vector = [], postgres = [], s3 = [] }, opts) {
  return reciprocalRankFusion(
    [
      vector.map((d) => ({ ...d, _origin: "vector" })),
      postgres.map((d) => ({ ...d, content: d.snippet, _origin: "postgres" })),
      s3.map((d) => ({ ...d, content: d.key, _origin: "s3" })),
    ],
    opts
  );
}
