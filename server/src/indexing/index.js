export { indexPdf } from "./pdf.js";
export { indexAudio } from "./audio.js";
export { indexVideo } from "./video.js";
export { indexWebsite } from "./website.js";
export { indexSrt } from "./srt.js";
export { indexVtt } from "./vtt.js";
export { getEmbeddings, embedChunks } from "./embeddings.js";
export { splitDocs } from "./chunk.js";
export { getQdrantStore, storeChunks } from "./vectorstore.js";

import { indexPdf } from "./pdf.js";
import { indexAudio } from "./audio.js";
import { indexVideo } from "./video.js";
import { indexWebsite } from "./website.js";
import { indexSrt } from "./srt.js";
import { indexVtt } from "./vtt.js";
import { storeChunks } from "./vectorstore.js";

async function runAndStore(promise, store = true) {
  const result = await promise;
  if (!store) return result;
  await storeChunks(result.chunks);
  return { ...result, stored: result.chunks.length };
}

export function indexSource(type, input, { store = true } = {}) {
  switch (type) {
    case "pdf":
      return runAndStore(indexPdf(input), store);
    case "audio":
      return runAndStore(indexAudio(input), store);
    case "video":
      return runAndStore(indexVideo(input), store);
    case "website":
      return runAndStore(indexWebsite(input), store);
    case "srt":
      return runAndStore(indexSrt(input), store);
    case "vtt":
      return runAndStore(indexVtt(input), store);
    default:
      throw new Error(`Unknown source type: ${type}`);
  }
}
