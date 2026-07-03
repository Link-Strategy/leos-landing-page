#!/usr/bin/env node
/**
 * upload.js - Upload a local file to S3 via Link Strategy webhook
 * Usage: node scripts/ops/upload.js <filePath> <folder> [fileName]
 * Example: node scripts/ops/upload.js C:/img.png posts/2026/03 my-image.png
 */

const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Load .env - handle = signs in values
const envPath = path.resolve(__dirname, '../../../../.env');
const env = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      env[key] = val;
    }
  });
}

const WEBHOOK_URL = env.UPLOAD_WEBHOOK_URL || "https://leos.local/webhook/upload";

const [, , filePath, folderInput, fileName, contentType = 'image/png'] = process.argv;

// Calculate dynamic default folder based on Link Strategy standards
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const defaultFolder = `linkstrategy/manual-uploads/${year}/${month}`;

const folder = folderInput || env.DEFAULT_UPLOAD_FOLDER || defaultFolder;

if (!filePath) {
  console.error('Usage: node upload.js <filePath> [folder] [fileName] [contentType]');
  process.exit(1);
}

const resolvedPath = path.resolve(filePath);
const destName = fileName || path.basename(resolvedPath);

if (!fs.existsSync(resolvedPath)) {
  console.error('File not found:', resolvedPath);
  process.exit(1);
}

// Write params JSON to temp file (no BOM, no shell quoting issues)
const paramJson = JSON.stringify({
  filename: destName,
  folder,
  content_type: contentType,
  source_type: 'binary',
  metadata: { uploader: 'LS-Ops-Node' }
});

const tempFile = path.join(os.tmpdir(), `ls-upload-params-${Date.now()}.json`);
fs.writeFileSync(tempFile, paramJson, { encoding: 'utf8' });

try {
  const result = execFileSync('curl.exe', [
    '-s', '-X', 'POST', WEBHOOK_URL,
    '-F', 'tool=upload_asset',
    '-F', `params=<${tempFile.replace(/\\/g, '/')}`,
    '-F', `data=@${resolvedPath.replace(/\\/g, '/')}`
  ], { encoding: 'utf8' });

  console.log(result);
} catch (e) {
  console.error('Upload failed:', e.message);
  process.exit(1);
} finally {
  fs.unlinkSync(tempFile);
}

