export function getTopK(fused, n = 5) {
  return (fused || []).slice(0, n);
}

export function buildContext(docs) {
  return (docs || [])
    .map((d, i) => {
      const src = d.source || d.key || d._key || "unknown";
      return `[${i + 1}] (${d._origin || "mixed"} | ${src})\n${d.content || d.snippet || ""}`;
    })
    .join("\n\n");
}
