# Link Strategy Local CLI Posting Tools

This directory contains the Local CLI tools used by the AI Content Agent to interact with the Link Strategy posting database and execute publication workflows.

All operations are managed through the central script:
```powershell
node .agents/tools/ls-post/cli.mjs <command> [arguments]
```

---

## 1. How to Execute Commands

To avoid command-line quoting issues with JSON payloads on Windows/PowerShell, the agent should use one of the following methods for operations that require a JSON payload (`save-idea`, `save-brief`, `save-asset`, `save-signal`):

### Method A: Using a Temporary Payload File (Recommended)
1. Write the JSON payload to a temporary file in `scripts/` (e.g., `scripts/temp_payload.json`).
2. Run the command referencing the file:
   ```powershell
   node .agents/tools/ls-post/cli.mjs save-idea --payload-file scripts/temp_payload.json
   ```
3. Delete the temporary file when finished.

### Method B: Piping to Standard Input
Pipe the JSON payload directly into standard input:
```powershell
'{"title_working": "My Title", ...}' | node .agents/tools/ls-post/cli.mjs save-idea
```

---

## 2. Command Specifications

### 1. `save-idea`
Saves observations or potential content directions to the backlog.
- **Payload Schema**:
  ```json
  {
    "idea_id": "string",                  // Optional (for updates)
    "title_working": "string",            // Required, min 10 chars
    "source_type": "string",              // Required. Enum: manual, comment, dm, call, signal, research
    "observation": "string",              // Required, min 30 chars
    "suggested_taxonomy": {               // Optional
      "thesis_id": "string",              // TH-* pattern
      "mental_model_id": "string",        // MM-* pattern
      "cluster_id": "string",             // CL-* pattern
      "goal_id": "string"                 // PL-* pattern
    },
    "target_reader": "string",            // Optional, min 10 chars if provided
    "status": "string",                   // Optional. Enum: backlog, validated, converted, discarded. Default: backlog
    "created_at": "string"                // Required, ISO date string
  }
  ```

### 2. `save-brief`
Defines the strategic blueprint for a piece of content.
- **Payload Schema**:
  ```json
  {
    "brief_id": "string",                 // Optional (for updates)
    "title_working": "string",            // Required, min 10 chars
    "thesis_id": "string",                // Required. Must match TH-* and exist in registry
    "mental_model_id": "string",          // Required. Must match MM-* and exist in registry
    "cluster_id": "string",               // Required. Must match CL-* and exist in registry
    "goal_id": "string",                  // Required. Must match PL-* and exist in registry
    "target_reader": "string",            // Required, min 10 chars
    "core_insight": "string",             // Required, min 30 chars (min 50 chars if status=approved)
    "product_mention_level": "string",    // Required. Enum: none, light, moderate, direct
    "status": "string",                   // Required. Enum: draft, approved, archived
    "created_at": "string"                // Required, ISO date string
  }
  ```

### 3. `save-asset`
Saves draft copy for specific social media channels and schedules posting.
- **Payload Schema**:
  ```json
  {
    "asset_id": "string",                 // Optional (for updates)
    "brief_id": "string",                 // Required, 24-character hex ObjectId of a valid brief
    "platform": "string",                 // Required. Enum: linkedin, facebook, threads, instagram, blog
    "format": "string",                   // Optional. Enum: post, article. Default: post (if platform=blog, must be article)
    "title": "string",                    // Optional, min 5 chars (required if format=article)
    "body": "string",                     // Required, min 30 chars. Must be clean (no technical tags/taxonomy IDs)
    "cta": "string",                      // Optional, min 5 chars
    "media": [                            // Optional
      {
        "type": "string",                 // Required. Enum: image, video, document
        "url": "string"                   // Required. Must start with https://media.linkstrategy.io.vn/
      }
    ],
    "platform_metadata": "object",        // Optional
    "status": "string",                   // Optional. Enum: draft, approved, planned, published, failed. Default: planned
    "publish_at": "string",               // Required, ISO date string in UTC format (e.g. YYYY-MM-DDTHH:mm:ssZ)
    "created_at": "string"                // Optional, ISO date string
  }
  ```

### 4. `save-signal`
Registers structured feedback and performance learning.
- **Payload Schema**:
  ```json
  {
    "source_type": "string",              // Required. Value must be "publication"
    "source_scope": "string",             // Optional. Enum: single, batch. Default: single
    "source_id": "string",                // Required if scope=single. 24-character hex ID of an asset
    "source_ids": ["string"],             // Required if scope=batch. Unique 24-character hex IDs of assets
    "metrics": {                          // Optional
      "impressions": "number",
      "likes": "number",
      "comments": "number",
      "shares": "number",
      "clicks": "number"
    },
    "comments": ["string"],               // Optional. Array of non-empty strings
    "insight_summary": "string",          // Required, min 30 chars
    "painpoints": ["string"],             // Required. Array of non-empty strings
    "objections": ["string"],             // Required. Array of non-empty strings
    "recommended_follow_up": ["string"],  // Required. Array of non-empty strings
    "created_at": "string"                // Required, ISO date string
  }
  ```
  *Note: At least one learning item must exist across painpoints, objections, and recommended_follow_up.*

### 5. `search-content`
Performs queries across database records.
- **Arguments**:
  - `--query TEXT` (Matches keywords in title, observation, body, and summary)
  - `--types ideas,briefs,assets` (Comma-separated collections to search. Default: all)
  - `--status STATUS` (Filter by status)
  - `--limit COUNT` (Limit returned list. Default: 20)
- **Example**:
  ```powershell
  node .agents/tools/ls-post/cli.mjs search-content --query "coordination" --types briefs,assets
  ```

### 6. `search-taxonomy`
Queries active taxonomy mappings from the registry.
- **Arguments**:
  - `--query TEXT` (Search code or description)
  - `--type TYPE` (Filter by: `thesis`, `mental_model`, `cluster`, `goal`)
- **Example**:
  ```powershell
  node .agents/tools/ls-post/cli.mjs search-taxonomy --query "coordination" --type thesis
  ```

### 7. `get-content`
Loads a complete document record by its collection name and ID.
- **Arguments**:
  - `--collection NAME` (e.g. `ideas`, `briefs`, `assets`, `signals`)
  - `--id ID` (24-character hex string)
- **Example**:
  ```powershell
  node .agents/tools/ls-post/cli.mjs get-content --collection briefs --id 67ce0f4c9f9f9f9f9f9f9f03
  ```

### 8. `publish-asset`
Simulates or triggers posting an asset to social channels, updating status to `published` and generating external link.
- **Arguments**:
  - `--asset-id ID` (24-character hex string)
- **Example**:
  ```powershell
  node .agents/tools/ls-post/cli.mjs publish-asset --asset-id 67ce0f4c9f9f9f9f9f9f9f03
  ```

### 9. `fetch-metrics`
Retrieves live engagement metric updates for a published asset.
- **Arguments**:
  - `--asset-id ID` (24-character hex string)
- **Example**:
  ```powershell
  node .agents/tools/ls-post/cli.mjs fetch-metrics --asset-id 67ce0f4c9f9f9f9f9f9f9f03
  ```
