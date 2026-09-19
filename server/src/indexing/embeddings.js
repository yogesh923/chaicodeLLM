import { OpenAIEmbeddings } from "@langchain/openai";

let cached = null;

export function getEmbeddings() {
  if (cached) return cached;
  cached = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });
  return cached;
}

export async function embedChunks(chunks) {
  const embeddings = getEmbeddings();
  const texts = chunks.map((d) => d.pageContent);
  const vectors = await embeddings.embedDocuments(texts);
  return vectors;
}
