import { SRTLoader } from "@langchain/community/document_loaders/fs/srt";
import { splitDocs } from "./chunk.js";
import { embedChunks, getEmbeddings } from "./embeddings.js";

export async function indexSrt(filePath) {
  const loader = new SRTLoader(filePath);
  const docs = await loader.load();

  const docsWithSource = docs.map((d) => ({
    ...d,
    metadata: { ...d.metadata, sourceType: "srt", source: filePath },
  }));

  const chunks = await splitDocs(docsWithSource);
  const vectors = await embedChunks(chunks);

  return { docs: docsWithSource, chunks, vectors, embeddings: getEmbeddings() };
}
