import { QdrantVectorStore } from "@langchain/qdrant";
import { getEmbeddings } from "./embeddings.js";

export const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";
export const QDRANT_COLLECTION =
  process.env.QDRANT_COLLECTION || "documents";

export async function getQdrantStore() {
  return QdrantVectorStore.fromExistingCollection(getEmbeddings(), {
    url: QDRANT_URL,
    collectionName: QDRANT_COLLECTION,
  });
}

export async function storeChunks(chunks) {
  if (!chunks?.length) return { stored: 0 };
  const store = await QdrantVectorStore.fromDocuments(
    chunks,
    getEmbeddings(),
    { url: QDRANT_URL, collectionName: QDRANT_COLLECTION }
  );
  return { stored: chunks.length, store };
}
