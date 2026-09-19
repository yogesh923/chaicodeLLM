import { OpenAIWhisperAudio } from "@langchain/community/document_loaders/fs/openai_whisper_audio";
import { splitDocs } from "./chunk.js";
import { embedChunks, getEmbeddings } from "./embeddings.js";

export async function indexVideo(filePath) {
  const loader = new OpenAIWhisperAudio(filePath, {
    transcriptionCreateParams: { model: "whisper-1" },
  });
  const docs = await loader.load();

  const docsWithSource = docs.map((d) => ({
    ...d,
    metadata: { ...d.metadata, sourceType: "video", source: filePath },
  }));

  const chunks = await splitDocs(docsWithSource);
  const vectors = await embedChunks(chunks);

  return { docs: docsWithSource, chunks, vectors, embeddings: getEmbeddings() };
}
