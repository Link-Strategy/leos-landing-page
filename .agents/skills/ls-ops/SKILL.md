---
name: ls-ops
description: LeOS Operations Layer. Handles MongoDB operations and file uploads for the LeOS workspace.
---

# LeOS Ops Skill

This skill provides robust alternatives to standard MCP and n8n tools for critical database and storage operations in the LeOS / LeTRON workspace.

## When to use this skill

1.  **Binary Uploads**: When you need to upload a local file (e.g., a generated image) to the production S3 storage. The standard `upload_asset` n8n tool does not support direct binary data from the local filesystem.
2.  **Robust Deletions**: When the MongoDB MCP `delete-many` tool fails due to "form elicitation" errors or requires interactive confirmation that blocks automation.

## Capabilities

### Upload Asset
Uploads a local file directly to S3 using AWS SDK v3 and prints the public S3 URL.

**Command:**
```powershell
node .agents/skills/ls-ops/scripts/ops.cjs upload -FilePath "<LOCAL_PATH>" [-Folder "<S3_FOLDER>"] [-FileName "<REMOTE_NAME>"]
```
*   **Simple Usage**: `node .agents/skills/ls-ops/scripts/ops.cjs upload "C:/image.png"`
*   **Default Folder**: If `-Folder` is omitted, it defaults to `uploads/YYYY/MM` (dynamic by month).

### Delete Documents
Deletes a single document from MongoDB strictly by its ID. For safety, this command no longer accepts complex JSON filters, only 24-character hex strings.

**Command:**
```powershell
node .agents/skills/ls-ops/scripts/ops.cjs delete <collection> <24_CHAR_ID>
```
*   **Example**: `node .agents/skills/ls-ops/scripts/ops.cjs delete assets 67d2f0000000000000000102`

### Database & Article Utilities
Additional utility scripts to audit and manage blog databases and image assets.

*   **List Articles**: `node .agents/skills/ls-ops/scripts/ops.cjs articles`
    Prints a JSON array of all articles with their ID, slug, title, and current cover image.
*   **Scan Images**: `node .agents/skills/ls-ops/scripts/ops.cjs images`
    Scans all markdown content in MongoDB to extract referenced image URLs for auditing.
*   **Database Stats**: `node .agents/skills/ls-ops/scripts/ops.cjs db`
    Lists all collections in the database and shows the document count for each.
*   **List Legacy Assets**: `node .agents/skills/ls-ops/scripts/ops.cjs assets`
    Outputs a raw list of all assets inside the legacy assets collection.



## Setup & Requirements
- **Node.js**: Requires Node.js installed on the host system.
- **MongoDB Driver**: The `mongodb` npm package must be installed (it is included in `dependencies`).
- **Environment**: Reads `MONGODB_URI` / `MONGODB_DB_NAME` from the root `.env` file. Uploads read `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`, `S3_REGION`.


