import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let client = null;

export function getS3() {
  if (client) return client;
  client = new S3Client({
    region: process.env.S3_REGION || "us-east-1",
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: Boolean(process.env.S3_ENDPOINT),
    credentials:
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
  });
  return client;
}

function bucketName(bucket) {
  return bucket || process.env.S3_BUCKET || "chaicodellm";
}

export async function uploadFile(bucket, key, body, contentType) {
  await getS3().send(
    new PutObjectCommand({
      Bucket: bucketName(bucket),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return { bucket: bucketName(bucket), key };
}

export async function downloadFile(bucket, key) {
  const res = await getS3().send(
    new GetObjectCommand({ Bucket: bucketName(bucket), Key: key })
  );
  return res.Body.transformToByteArray();
}

export async function deleteFile(bucket, key) {
  await getS3().send(
    new DeleteObjectCommand({ Bucket: bucketName(bucket), Key: key })
  );
  return { deleted: true };
}

export function getDownloadUrl(bucket, key, expiresIn = 3600) {
  return getSignedUrl(
    getS3(),
    new GetObjectCommand({ Bucket: bucketName(bucket), Key: key }),
    { expiresIn }
  );
}
