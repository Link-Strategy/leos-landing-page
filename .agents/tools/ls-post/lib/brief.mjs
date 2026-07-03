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

function normalizeUppercase(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : value;
}

export async function saveBrief(runtime, { db }, rawPayload) {
  const toolName = "save_brief";

  // 1. Protocol Validation
  const requiredFields = [
    "title_working",
    "thesis_id",
    "mental_model_id",
    "cluster_id",
    "goal_id",
    "target_reader",
    "core_insight",
    "product_mention_level",
    "status",
    "created_at"
  ];
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

  normalized.product_mention_level = normalizeLowercase(normalized.product_mention_level);
  normalized.status = normalizeLowercase(normalized.status);

  normalized.thesis_id = normalizeUppercase(normalized.thesis_id);
  normalized.mental_model_id = normalizeUppercase(normalized.mental_model_id);
  normalized.cluster_id = normalizeUppercase(normalized.cluster_id);
  normalized.goal_id = normalizeUppercase(normalized.goal_id);

  // Enums check
  const validProductMentionLevels = ["none", "light", "moderate", "direct"];
  const validStatuses = ["draft", "approved", "archived"];

  if (!validProductMentionLevels.includes(normalized.product_mention_level)) {
    return buildErrorResponse({
      tool: toolName,
      stage: "protocol_validation",
      message: `Invalid product_mention_level: ${normalized.product_mention_level}`,
      errors: [{ field: "product_mention_level", code: "INVALID_ENUM_VALUE" }]
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

  if (isNonEmptyString(normalized.title_working) && normalized.title_working.length < 10) {
    errors.push({
      field: "title_working",
      code: "TITLE_TOO_SHORT",
      message: "title_working must be at least 10 characters",
      received_value: normalized.title_working,
      min_length: 10
    });
  }

  if (isNonEmptyString(normalized.target_reader) && normalized.target_reader.length < 10) {
    errors.push({
      field: "target_reader",
      code: "TARGET_READER_TOO_SHORT",
      message: "target_reader must be at least 10 characters",
      received_value: normalized.target_reader,
      min_length: 10
    });
  }

  if (isNonEmptyString(normalized.core_insight) && normalized.core_insight.length < 30) {
    errors.push({
      field: "core_insight",
      code: "CORE_INSIGHT_TOO_SHORT",
      message: "core_insight must be at least 30 characters",
      received_value: normalized.core_insight,
      min_length: 30
    });
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

  if (normalized.status === "approved") {
    if (!isNonEmptyString(normalized.core_insight) || normalized.core_insight.trim().length < 50) {
      errors.push({
        field: "status",
        code: "APPROVED_REQUIRES_STRONG_CORE_INSIGHT",
        message: "status=approved requires core_insight to be at least 50 characters",
        received_value: normalized.status
      });
    }
  }

  // 4. Reference validation (formats and taxonomy registry existence check)
  const referenceChecks = {
    thesis_id: /^TH-\d+$/,
    mental_model_id: /^MM-\d+$/,
    cluster_id: /^CL-\d+$/,
    goal_id: /^PL-\d+$/
  };

  for (const field of Object.keys(referenceChecks)) {
    const pattern = referenceChecks[field];
    const val = normalized[field];

    if (typeof val !== "string" || !pattern.test(val)) {
      errors.push({
        field,
        code: "INVALID_REFERENCE_FORMAT",
        message: `${field} format invalid: ${val}`,
        received_value: val
      });
    }
  }

  if (errors.length > 0) {
    return buildErrorResponse({
      tool: toolName,
      stage: "business_validation",
      message: "Business validation failed for save_brief",
      errors
    });
  }

  // Verify existence of taxonomy entries in taxonomy_registry
  const taxonomyCodes = [
    normalized.thesis_id,
    normalized.mental_model_id,
    normalized.cluster_id,
    normalized.goal_id
  ];

  const registry = db.collection("taxonomy_registry");
  const foundDocs = await registry.find({
    code: { $in: taxonomyCodes },
    status: "active"
  }).toArray();

  const foundCodes = new Set(foundDocs.map(d => d.code));
  for (const field of Object.keys(referenceChecks)) {
    const code = normalized[field];
    if (!foundCodes.has(code)) {
      errors.push({
        field,
        code: "TAXONOMY_NOT_FOUND_OR_INACTIVE",
        message: `Taxonomy code ${code} not found or inactive in registry`,
        received_value: code
      });
    }
  }

  if (errors.length > 0) {
    return buildErrorResponse({
      tool: toolName,
      stage: "reference_validation",
      message: "Taxonomy reference checks failed",
      errors
    });
  }

  // 5. Persistence
  let briefId = normalized.brief_id || normalized._id;
  const dbDoc = {
    title_working: normalized.title_working,
    thesis_id: normalized.thesis_id,
    mental_model_id: normalized.mental_model_id,
    cluster_id: normalized.cluster_id,
    goal_id: normalized.goal_id,
    target_reader: normalized.target_reader,
    core_insight: normalized.core_insight,
    product_mention_level: normalized.product_mention_level,
    status: normalized.status,
    created_at: new Date(normalized.created_at)
  };

  const collection = db.collection("briefs");

  if (briefId) {
    let queryId;
    try {
      queryId = new ObjectId(briefId);
    } catch {
      queryId = briefId;
    }
    await collection.updateOne(
      { _id: queryId },
      { $set: dbDoc },
      { upsert: true }
    );
  } else {
    const result = await collection.insertOne(dbDoc);
    briefId = result.insertedId.toString();
  }

  return {
    ok: true,
    tool: toolName,
    stage: "db_write",
    message: "Brief saved successfully",
    data: {
      brief_id: briefId.toString(),
      title_working: dbDoc.title_working,
      status: dbDoc.status
    }
  };
}
