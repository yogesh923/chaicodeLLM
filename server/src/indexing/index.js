export { indexPdf } from "./pdf.js";
export { indexAudio } from "./audio.js";
export { indexVideo } from "./video.js";
export { indexWebsite } from "./website.js";
export { indexSrt } from "./srt.js";
export { indexVtt } from "./vtt.js";
export { getEmbeddings, embedChunks } from "./embeddings.js";
export { splitDocs } from "./chunk.js";

import { indexPdf } from "./pdf.js";
import { indexAudio } from "./audio.js";
import { indexVideo } from "./video.js";
import { indexWebsite } from "./website.js";
import { indexSrt } from "./srt.js";
import { indexVtt } from "./vtt.js";

export function indexSource(type, input) {
  switch (type) {
    case "pdf":
      return indexPdf(input);
    case "audio":
      return indexAudio(input);
    case "video":
      return indexVideo(input);
    case "website":
      return indexWebsite(input);
    case "srt":
      return indexSrt(input);
    case "vtt":
      return indexVtt(input);
    default:
      throw new Error(`Unknown source type: ${type}`);
  }
}
