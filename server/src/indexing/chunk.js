import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export function getSplitter() {
  return new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
}

export async function splitDocs(docs) {
  const splitter = getSplitter();
  return splitter.splitDocuments(docs);
}
