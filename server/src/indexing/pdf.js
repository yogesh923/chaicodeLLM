import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { splitDocs } from "./chunk.js";
import { embedChunks, getEmbeddings } from "./embeddings.js";

export async function indexPdf(filePath) {
  const loader = new PDFLoader(filePath, { splitPages: false });
  const docs = await loader.load();

  const docsWithSource = docs.map((d) => ({
    ...d,
    metadata: { ...d.metadata, sourceType: "pdf", source: filePath },
  }));

  const chunks = await splitDocs(docsWithSource);
  const vectors = await embedChunks(chunks);

  return { docs: docsWithSource, chunks, vectors, embeddings: getEmbeddings() };
}
