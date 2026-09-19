import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { splitDocs } from "./chunk.js";
import { embedChunks, getEmbeddings } from "./embeddings.js";

export async function indexWebsite(url) {
  const loader = new CheerioWebBaseLoader(url);
  const docs = await loader.load();

  const docsWithSource = docs.map((d) => ({
    ...d,
    metadata: { ...d.metadata, sourceType: "website", source: url },
  }));

  const chunks = await splitDocs(docsWithSource);
  const vectors = await embedChunks(chunks);

  return { docs: docsWithSource, chunks, vectors, embeddings: getEmbeddings() };
}
