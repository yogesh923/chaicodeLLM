import { QdrantVectorStore } from "@langchain/qdrant";
import { getEmbeddings } from "../indexing/embeddings.js";

export const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";
export const QDRANT_COLLECTION =
  process.env.QDRANT_COLLECTION || "documents";

export function getVectorStore() {
  return QdrantVectorStore.fromExistingCollection(getEmbeddings(), {
    url: QDRANT_URL,
    collectionName: QDRANT_COLLECTION,
  });
}

export async function storeVectors(chunks) {
  if (!chunks?.length) return { stored: 0 };
  await QdrantVectorStore.fromDocuments(chunks, getEmbeddings(), {
    url: QDRANT_URL,
    collectionName: QDRANT_COLLECTION,
  });
  return { stored: chunks.length };
}

export async function searchVectors(query, k = 5) {
  const store = await getVectorStore();
  return store.similaritySearch(query, k);
}
