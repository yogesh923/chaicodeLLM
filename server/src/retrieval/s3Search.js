import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getS3 } from "../adapters/s3.js";

function keywords(text) {
  return String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((w) => w.length >= 4);
}

export async function searchS3ByTexts(texts, bucket) {
  const Bucket = bucket || process.env.S3_BUCKET || "chaicodellm";
  const terms = [...new Set(texts.flatMap(keywords))];
  if (!terms.length) return [];

  const res = await getS3().send(
    new ListObjectsV2Command({ Bucket, MaxKeys: 1000 })
  );
  return (res.Contents || [])
    .filter((o) => {
      const key = o.Key.toLowerCase();
      return terms.some((t) => key.includes(t));
    })
    .slice(0, 20)
    .map((o) => ({ key: o.Key, bucket: Bucket }));
}
