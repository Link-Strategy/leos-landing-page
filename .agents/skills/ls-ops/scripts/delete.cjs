#!/usr/bin/env node
/**
 * delete.js - Delete documents from MongoDB
 * Usage: node scripts/ops/delete.js <collection> <filterJSON>
 * Example: node scripts/ops/delete.js assets '{"status":"test"}'
 */

const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');

// Load .env from repo root - handle = signs in values
const envPath = path.resolve(__dirname, "../../../../.env");
const env = {};
fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0) {
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    env[key] = val;
  }
});

const MONGODB_URI = env.MONGODB_URI;
const DB_NAME = env.MONGODB_DB_NAME || 'blogs';

const [, , collection, filterJson] = process.argv;

if (!collection || !filterJson) {
  console.error('Usage: node delete.js <collection> <filterJSON>');
  console.error('Example: node delete.js assets \'{"status":"test"}\'');
  process.exit(1);
}

if (!/^[0-9a-fA-F]{24}$/.test(filterJson)) {
  console.error('Error: Delete tool now only accepts a 24-character hex ID.');
  process.exit(1);
}
const filter = { _id: new ObjectId(filterJson) };

(async () => {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const result = await client.db(DB_NAME).collection(collection).deleteMany(filter);
    console.log(JSON.stringify({ ok: true, deletedCount: result.deletedCount, collection, filter }));
  } catch (e) {
    console.error(JSON.stringify({ ok: false, error: e.message }));
    process.exit(1);
  } finally {
    await client.close();
  }
})();


