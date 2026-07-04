#!/usr/bin/env node
/**
 * upload.cjs - Upload file tr?c ti?p l?n S3
 * Usage: node .agents/skills/ls-ops/scripts/upload.cjs <filePath> [folder]
 */
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const fs = require("fs");

// Load .env
const envPath = path.resolve(__dirname, "../../../../.env");
const env = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8").split("\n").forEach(line => {
    const t = line.trim();
    if (!t || t.startsWith("#")) return;
    const i = t.indexOf("=");
    if (i > 0) {
      const key = t.slice(0, i).trim();
      let val = t.slice(i + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
        val = val.slice(1, -1);
      env[key] = val;
    }
  });
}

const [,, filePath, folderInput] = process.argv;
if (!filePath) {
  console.error("Usage: node upload.cjs <filePath> [folder]");
  process.exit(1);
}

const now = new Date();
const month = String(now.getMonth() + 1).padStart(2, "0");
const folder = folderInput || `uploads/${now.getFullYear()}/${month}`;
const resolvedPath = path.resolve(filePath);

if (!fs.existsSync(resolvedPath)) {
  console.error("File not found:", resolvedPath);
  process.exit(1);
}

const s3 = new S3Client({
  region: env.S3_REGION || "ap-southeast-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucket = env.S3_BUCKET_NAME || "letron-blog-content-dev";
const fileName = path.basename(resolvedPath);
const key = `${folder}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

async function main() {
  try {
    const fileBuffer = fs.readFileSync(resolvedPath);
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      CacheControl: "public, max-age=31536000, immutable",
    }));
    const url = `https://${bucket}.s3.${env.S3_REGION || "ap-southeast-1"}.amazonaws.com/${key}`;
    console.log(JSON.stringify({ ok: true, url, key, size: fileBuffer.length }));
  } catch (err) {
    console.error("Upload failed:", err.message);
    process.exit(1);
  }
}
main();
