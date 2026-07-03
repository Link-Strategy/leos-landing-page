import { ObjectId } from "mongodb";
import {
  isPlainObject,
  isNonEmptyString,
  isValidIsoDateString,
  trimString,
  emptyStringToNull,
  normalizeLowercase,
  deepClone,
  buildErrorResponse
} from "./validation.mjs";
import { scheduleAssetPost, unscheduleAssetPost } from "./qstash.mjs";

function isValidObjectIdString(value) {
  return typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value.trim());
}

function checkCleanBody(body, errors) {
  const taxPattern = /\b(TH|MM|CL|PL)-\d+\b/i;
  if (taxPattern.test(body)) {
    errors.push({
      field: "body",
      code: "BODY_CONTAINS_TAXONOMY_ID",
      message: "Body must not contain raw taxonomy IDs (e.g. MM-01, TH-03). Use concept names instead."
    });
  }

  const tagPattern = /\[[A-Z0-9_\-\s]+\]/i;
  if (tagPattern.test(body)) {
    errors.push({
      field: "body",
      code: "BODY_CONTAINS_TECHNICAL_TAGS",
      message: "Body must not contain technical markers/tags like [HOOK], [VN], [EN], [SYMPTOM]."
    });
  }
}

function checkPlatformLimits(platform, body, cta, errors) {
  const totalLength = body.length + (cta ? cta.length : 0);
  if (platform === "threads" && totalLength > 500) {
    errors.push({
      field: "body",
      code: "THREADS_LIMIT_EXCEEDED",
      message: `Threads content (body + cta) must be under 500 characters. Current: ${totalLength}`
    });
  }
  if (platform === "instagram" && totalLength > 2200) {
    errors.push({
      field: "body",
      code: "INSTAGRAM_LIMIT_EXCEEDED",
      message: `Instagram content (body + cta) must be under 2200 characters. Current: ${totalLength}`
    });
  }
  if (platform === "linkedin" && totalLength > 3000) {
    errors.push({
      field: "body",
      code: "LINKEDIN_LIMIT_EXCEEDED",
      message: `LinkedIn content (body + cta) must be under 3000 characters. Current: ${totalLength}`
    });
  }
}

export async function saveAsset(runtime, { db }, rawPayload) {
  const toolName = "save_asset";

  // 1. Protocol Validation
  const requiredFields = ["brief_id", "platform", "body", "publish_at"];
  const missing = requiredFields.filter(f => rawPayload[f] === undefined || rawPayload[f] === null);
  if (missing.length > 0) {
    return buildErrorResponse({
      tool: toolName,
      stage: "protocol_validation",
      message: `Missing required protocol fields: ${missing.join(", ")}`,
      errors: missing.map(f => ({ field: f, code: "MISSING_REQUIRED_FIELD" }))
    });
  }

  // 2. Normalization
  const normalized = deepClone(rawPayload);
  for (const key of Object.keys(normalized)) {
    if (typeof normalized[key] === "string") {
      normalized[key] = emptyStringToNull(trimString(normalized[key]));
    }
  }

  normalized.platform = normalizeLowercase(normalized.platform);
  normalized.format = normalizeLowercase(normalized.format || "post");
  normalized.status = normalizeLowercase(normalized.status || "planned");

  if (Array.isArray(normalized.media)) {
    normalized.media = normalized.media.map(item => {
      if (!isPlainObject(item)) return item;
      const mediaItem = { ...item };
      if (mediaItem.type !== undefined && mediaItem.type !== null) {
        mediaItem.type = normalizeLowercase(mediaItem.type);
      }
      if (typeof mediaItem.url === "string") {
        mediaItem.url = mediaItem.url.trim();
      }
      if (typeof mediaItem.alt === "string") {
        mediaItem.alt = emptyStringToNull(mediaItem.alt.trim());
      }
      return mediaItem;
    });
  }

  // Enums check
  const validPlatforms = ["linkedin", "facebook", "threads", "instagram", "blog"];
  const validStatuses = ["draft", "approved", "planned", "published", "failed"];

  if (!validPlatforms.includes(normalized.platform)) {
    return buildErrorResponse({
      tool: toolName,
      stage: "protocol_validation",
      message: `Invalid platform: ${normalized.platform}`,
      errors: [{ field: "platform", code: "INVALID_ENUM_VALUE" }]
    });
  }
  if (!validStatuses.includes(normalized.status)) {
    return buildErrorResponse({
      tool: toolName,
      stage: "protocol_validation",
      message: `Invalid status: ${normalized.status}`,
      errors: [{ field: "status", code: "INVALID_ENUM_VALUE" }]
    });
  }

  // 3. Business Rule Validation
  const errors = [];

  if (!isValidObjectIdString(normalized.brief_id)) {
    errors.push({
      field: "brief_id",
      code: "INVALID_OBJECT_ID",
      message: "brief_id must be a valid MongoDB ObjectId string",
      received_value: normalized.brief_id
    });
  }

  if (isNonEmptyString(normalized.title) && normalized.title.length < 5) {
    errors.push({
      field: "title",
      code: "TITLE_TOO_SHORT",
      message: "title must be at least 5 characters when provided",
      received_value: normalized.title,
      min_length: 5
    });
  }

  if (isNonEmptyString(normalized.body) && normalized.body.length < 30) {
    errors.push({
      field: "body",
      code: "BODY_TOO_SHORT",
      message: "body must be at least 30 characters",
      received_value: normalized.body,
      min_length: 30
    });
  }

  if (normalized.cta !== undefined && normalized.cta !== null) {
    if (typeof normalized.cta !== "string") {
      errors.push({
        field: "cta",
        code: "INVALID_CTA_TYPE",
        message: "cta must be a string when provided"
      });
    } else {
      const ctaVal = normalized.cta.trim();
      if (ctaVal !== "" && ctaVal.length < 5) {
        errors.push({
          field: "cta",
          code: "CTA_TOO_SHORT",
          message: "cta must be at least 5 characters when provided",
          received_value: normalized.cta,
          min_length: 5
        });
      }
    }
  }

  if (normalized.created_at !== undefined && normalized.created_at !== null) {
    if (!isValidIsoDateString(normalized.created_at)) {
      errors.push({
        field: "created_at",
        code: "INVALID_ISO_DATETIME",
        message: "created_at must be a valid ISO datetime string",
        received_value: normalized.created_at
      });
    }
  }

  if (!isValidIsoDateString(normalized.publish_at)) {
    errors.push({
      field: "publish_at",
      code: "INVALID_ISO_DATETIME",
      message: "publish_at must be a valid ISO datetime string in UTC format",
      received_value: normalized.publish_at
    });
  }

  if (Array.isArray(normalized.media)) {
    const allowedMediaTypes = new Set(["image", "video", "document"]);
    normalized.media.forEach((item, index) => {
      if (!isPlainObject(item)) {
        errors.push({
          field: `media.${index}`,
          code: "INVALID_MEDIA_ITEM",
          message: "media item must be an object"
        });
        return;
      }
      if (!isNonEmptyString(item.type) || !allowedMediaTypes.has(item.type)) {
        errors.push({
          field: `media.${index}.type`,
          code: "INVALID_MEDIA_TYPE",
          message: "media.type must be one of image, video, document",
          received_value: item.type
        });
      }
      if (!isNonEmptyString(item.url)) {
        errors.push({
          field: `media.${index}.url`,
          code: "INVALID_MEDIA_URL",
          message: "media.url is required when media item is provided"
        });
      } else if (!item.url.startsWith("https://media.linkstrategy.io.vn/")) {
        errors.push({
          field: `media.${index}.url`,
          code: "INVALID_MEDIA_URL_DOMAIN",
          message: "media.url must start with https://media.linkstrategy.io.vn/",
          received_value: item.url
        });
      }
    });
  }

  if (normalized.platform === "blog" && normalized.format !== "article") {
    errors.push({
      field: "format",
      code: "BLOG_REQUIRES_ARTICLE_FORMAT",
      message: "platform=blog requires format=article",
      received_value: normalized.format
    });
  }

  if (normalized.format === "article") {
    if (!isNonEmptyString(normalized.title) || normalized.title.length < 5) {
      errors.push({
        field: "title",
        code: "ARTICLE_REQUIRES_TITLE",
        message: "format=article requires title with at least 5 characters"
      });
    }
  }

  // Clean content body checks
  if (isNonEmptyString(normalized.body)) {
    checkCleanBody(normalized.body, errors);
  }

  // Platform length limits checks
  if (isNonEmptyString(normalized.body)) {
    checkPlatformLimits(normalized.platform, normalized.body, normalized.cta, errors);
  }

  if (errors.length > 0) {
    return buildErrorResponse({
      tool: toolName,
      stage: "business_validation",
      message: "Business validation failed for save_asset",
      errors
    });
  }

  // 4. Reference check for brief_id existence
  const briefsCollection = db.collection("briefs");
  const briefExists = await briefsCollection.findOne({ _id: new ObjectId(normalized.brief_id) });
  if (!briefExists) {
    return buildErrorResponse({
      tool: toolName,
      stage: "reference_validation",
      message: "Reference validation failed: brief_id not found in database",
      errors: [{ field: "brief_id", code: "REFERENCED_BRIEF_NOT_FOUND", received_value: normalized.brief_id }]
    });
  }

  // 5. Persistence
  let assetId = normalized.asset_id || normalized._id;
  const dbDoc = {
    brief_id: new ObjectId(normalized.brief_id),
    platform: normalized.platform,
    format: normalized.format,
    title: normalized.title || null,
    body: normalized.body,
    cta: normalized.cta || null,
    media: Array.isArray(normalized.media) ? normalized.media : [],
    platform_metadata: normalized.platform_metadata || null,
    status: normalized.status,
    publish_at: new Date(normalized.publish_at),
    created_at: normalized.created_at ? new Date(normalized.created_at) : new Date(),
    updated_at: new Date()
  };

  const assetsCollection = db.collection("assets");

  if (assetId) {
    let queryId;
    try {
      queryId = new ObjectId(assetId);
    } catch {
      queryId = assetId;
    }
    await assetsCollection.updateOne(
      { _id: queryId },
      { $set: dbDoc },
      { upsert: true }
    );
  } else {
    const result = await assetsCollection.insertOne(dbDoc);
    assetId = result.insertedId.toString();
  }

  // 6. QStash scheduling (best-effort, non-blocking)
  let qstashMessageId = null;
  const isFuturePost =
    dbDoc.status === "planned" &&
    dbDoc.publish_at instanceof Date &&
    dbDoc.publish_at.getTime() > Date.now();

  if (isFuturePost) {
    try {
      // Cancel any existing scheduled job before (re)scheduling
      await unscheduleAssetPost(runtime, { db }, assetId);
      qstashMessageId = await scheduleAssetPost(runtime, { db }, assetId, {
        ...dbDoc,
        publish_at: dbDoc.publish_at.toISOString(),
      });
    } catch (scheduleError) {
      console.warn(`[QStash] Non-fatal: Failed to schedule asset ${assetId}:`, scheduleError.message);
    }
  }

  return {
    ok: true,
    tool: toolName,
    stage: "db_write",
    message: "Asset saved successfully",
    data: {
      asset_id: assetId.toString(),
      brief_id: dbDoc.brief_id.toString(),
      platform: dbDoc.platform,
      status: dbDoc.status,
      scheduled: isFuturePost,
      qstash_message_id: qstashMessageId ?? undefined,
    }
  };
}
