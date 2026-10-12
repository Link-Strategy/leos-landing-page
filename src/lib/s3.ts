import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY (read by the SDK), S3_BUCKET_NAME, S3_REGION.
let client: S3Client | null = null;

function getConfig() {
  const bucket = process.env.S3_BUCKET_NAME?.trim();
  if (!bucket) throw new Error("S3_BUCKET_NAME is not configured");
  const region = process.env.S3_REGION?.trim() || "ap-southeast-1";
  client ??= new S3Client({ region });
  return { bucket, client };
}

/** Upload without any public ACL — objects stay private and are shared via presigned URLs only. */
export async function putPrivateObject(key: string, body: Uint8Array, contentType: string) {
  const { bucket, client } = getConfig();
  await client.send(
    new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }),
  );
}

export async function getPresignedDownloadUrl(key: string, expiresInSec = 7 * 24 * 60 * 60) {
  const { bucket, client } = getConfig();
  return getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: expiresInSec });
}
