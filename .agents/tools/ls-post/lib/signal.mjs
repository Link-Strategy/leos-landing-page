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

function isValidObjectIdString(value) {
  return typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value.trim());
}

function validateStringArray(fieldName, value, errors) {
  if (!Array.isArray(value)) {
    errors.push({
      field: fieldName,
      code: "INVALID_ARRAY",
      message: `${fieldName} must be an array`
    });
    return;
  }

  value.forEach((item, index) => {
    if (typeof item !== "string" || item.trim() === "") {
      errors.push({
        field: `${fieldName}.${index}`,
        code: "INVALID_ARRAY_ITEM",
        message: `${fieldName} items must be non-empty strings`
      });
    }
  });
}

function countNonEmptyStrings(value) {
  if (!Array.isArray(value)) return 0;
  return value.filter(item => typeof item === "string" && item.trim() !== "").length;
}

export async function saveSignal(runtime, { db }, rawPayload) {
  const toolName = "save_signal";

  // 1. Protocol Validation
  const requiredFields = [
    "source_type",
    "insight_summary",
    "painpoints",
    "objections",
    "recommended_follow_up",
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

  normalized.source_type = normalizeLowercase(normalized.source_type);
  normalized.source_scope = normalizeLowercase(normalized.source_scope || "single");

  // Enums check
  if (normalized.source_type !== "publication") {
    return buildErrorResponse({
      tool: toolName,
      stage: "protocol_validation",
      message: `Invalid source_type: ${normalized.source_type}`,
      errors: [{ field: "source_type", code: "INVALID_ENUM_VALUE" }]
    });
  }
  if (normalized.source_scope !== "single" && normalized.source_scope !== "batch") {
    return buildErrorResponse({
      tool: toolName,
      stage: "protocol_validation",
      message: `Invalid source_scope: ${normalized.source_scope}`,
      errors: [{ field: "source_scope", code: "INVALID_ENUM_VALUE" }]
    });
  }

  // 3. Business Rule Validation
  const errors = [];

  if (normalized.source_scope === "single") {
    if (!isValidObjectIdString(normalized.source_id)) {
      errors.push({
        field: "source_id",
        code: "INVALID_OBJECT_ID",
        message: "source_id must be a valid MongoDB ObjectId string for single scope",
        received_value: normalized.source_id
      });
    }
    if (normalized.source_ids !== undefined && normalized.source_ids !== null) {
      errors.push({
        field: "source_ids",
        code: "AMBIGUOUS_SOURCE_REFERENCE",
        message: "source_ids should not be provided when source_scope is single"
      });
    }
  } else if (normalized.source_scope === "batch") {
    if (!Array.isArray(normalized.source_ids)) {
      errors.push({
        field: "source_ids",
        code: "INVALID_ARRAY",
        message: "source_ids must be an array for batch scope"
      });
    } else {
      if (normalized.source_ids.length < 2) {
        errors.push({
          field: "source_ids",
          code: "BATCH_SOURCE_IDS_TOO_SHORT",
          message: "source_ids must contain at least 2 unique items",
          received_value: normalized.source_ids
        });
      }
      
      const seen = new Set();
      normalized.source_ids.forEach((id, index) => {
        if (!isValidObjectIdString(id)) {
          errors.push({
            field: `source_ids.${index}`,
            code: "INVALID_OBJECT_ID",
            message: "source_ids item must be a valid MongoDB ObjectId string",
            received_value: id
          });
        } else {
          if (seen.has(id)) {
            errors.push({
              field: `source_ids.${index}`,
              code: "BATCH_DUPLICATE_SOURCE_ID",
              message: "Duplicate source_id in batch",
              received_value: id
            });
          }
          seen.add(id);
        }
      });
    }
    if (normalized.source_id !== undefined && normalized.source_id !== null) {
      errors.push({
        field: "source_id",
        code: "AMBIGUOUS_SOURCE_REFERENCE",
        message: "source_id should not be provided when source_scope is batch"
      });
    }
  }

  if (!isNonEmptyString(normalized.insight_summary) || normalized.insight_summary.length < 30) {
    errors.push({
      field: "insight_summary",
      code: "INSIGHT_SUMMARY_TOO_SHORT",
      message: "insight_summary must be at least 30 characters",
      received_value: normalized.insight_summary,
      min_length: 30
    });
  }

  validateStringArray("painpoints", normalized.painpoints, errors);
  validateStringArray("objections", normalized.objections, errors);
  validateStringArray("recommended_follow_up", normalized.recommended_follow_up, errors);

  const totalLearningItems =
    countNonEmptyStrings(normalized.painpoints) +
    countNonEmptyStrings(normalized.objections) +
    countNonEmptyStrings(normalized.recommended_follow_up);

  if (totalLearningItems === 0) {
    errors.push({
      field: "painpoints|objections|recommended_follow_up",
      code: "EMPTY_SIGNAL_LEARNING",
      message: "at least one learning item must exist across painpoints, objections, recommended_follow_up"
    });
  }

  if (normalized.comments !== undefined && normalized.comments !== null) {
    validateStringArray("comments", normalized.comments, errors);
  }

  if (normalized.metrics !== undefined && normalized.metrics !== null) {
    if (!isPlainObject(normalized.metrics)) {
      errors.push({
        field: "metrics",
        code: "INVALID_METRICS_OBJECT",
        message: "metrics must be an object when provided"
      });
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

  if (errors.length > 0) {
    return buildErrorResponse({
      tool: toolName,
      stage: "business_validation",
      message: "Business validation failed for save_signal",
      errors
    });
  }

  // 4. Reference Existence Check against assets collection
  const assetsCollection = db.collection("assets");
  if (normalized.source_scope === "single") {
    const assetExists = await assetsCollection.findOne({ _id: new ObjectId(normalized.source_id) });
    if (!assetExists) {
      errors.push({
        field: "source_id",
        code: "REFERENCED_ASSET_NOT_FOUND",
        message: `Asset with id ${normalized.source_id} not found in database`,
        received_value: normalized.source_id
      });
    }
  } else if (normalized.source_scope === "batch") {
    const targetObjectIds = normalized.source_ids.map(id => new ObjectId(id));
    const foundAssets = await assetsCollection.find({ _id: { $in: targetObjectIds } }).toArray();
    const foundIds = new Set(foundAssets.map(a => a._id.toString()));
    
    normalized.source_ids.forEach((id, index) => {
      if (!foundIds.has(id)) {
        errors.push({
          field: `source_ids.${index}`,
          code: "REFERENCED_ASSET_NOT_FOUND",
          message: `Asset with id ${id} not found in database`,
          received_value: id
        });
      }
    });
  }

  if (errors.length > 0) {
    return buildErrorResponse({
      tool: toolName,
      stage: "reference_validation",
      message: "Asset reference existence check failed",
      errors
    });
  }

  // Helper to trim strings in array
  const trimArray = arr => (Array.isArray(arr) ? arr.map(i => i.trim()) : []);

  // 5. Persistence
  const dbDoc = {
    source_type: normalized.source_type,
    source_scope: normalized.source_scope,
    source_id: normalized.source_scope === "single" ? new ObjectId(normalized.source_id) : null,
    source_ids: normalized.source_scope === "batch" ? normalized.source_ids.map(id => new ObjectId(id)) : [],
    source_count: normalized.source_scope === "batch" ? normalized.source_ids.length : 1,
    metrics: normalized.metrics || {},
    comments: trimArray(normalized.comments),
    insight_summary: normalized.insight_summary.trim(),
    painpoints: trimArray(normalized.painpoints),
    objections: trimArray(normalized.objections),
    recommended_follow_up: trimArray(normalized.recommended_follow_up),
    created_at: new Date(normalized.created_at)
  };

  const signalsCollection = db.collection("signals");
  const result = await signalsCollection.insertOne(dbDoc);

  return {
    ok: true,
    tool: toolName,
    stage: "db_write",
    message: "Signal saved successfully",
    data: {
      signal_id: result.insertedId.toString(),
      source_scope: dbDoc.source_scope,
      source_type: dbDoc.source_type,
      source_id: dbDoc.source_id ? dbDoc.source_id.toString() : null,
      source_ids: dbDoc.source_ids.map(id => id.toString()),
      source_count: dbDoc.source_count,
      insight_summary: dbDoc.insight_summary,
      painpoints: dbDoc.painpoints,
      objections: dbDoc.objections,
      recommended_follow_up: dbDoc.recommended_follow_up,
      created_at: dbDoc.created_at.toISOString()
    }
  };
}
