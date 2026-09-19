import { readFile } from "node:fs/promises";
import { Document } from "@langchain/core/documents";
import { splitDocs } from "./chunk.js";
import { embedChunks, getEmbeddings } from "./embeddings.js";

function parseVtt(text) {
  return text
    .replace(/^WEBVTT.*\n/, "")
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block.trim().split("\n");
      if (lines.length < 2) return null;
      const timeLine = lines.find((l) => l.includes("-->"));
      const content = lines
        .filter((l) => l !== timeLine && !/^\d+$/.test(l.trim()))
        .join(" ")
        .trim();
      return content ? { content, timestamp: timeLine || "" } : null;
    })
    .filter(Boolean);
}

export async function indexVtt(filePath) {
  const raw = await readFile(filePath, "utf-8");
  const cues = parseVtt(raw);

  const docs = cues.map(
    (cue) =>
      new Document({
        pageContent: cue.content,
        metadata: {
          sourceType: "vtt",
          source: filePath,
          timestamp: cue.timestamp,
        },
      })
  );

  const chunks = await splitDocs(docs);
  const vectors = await embedChunks(chunks);

  return { docs, chunks, vectors, embeddings: getEmbeddings() };
}
