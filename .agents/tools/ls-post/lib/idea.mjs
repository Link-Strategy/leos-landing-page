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

export async function saveIdea(runtime, { db }, rawPayload) {
  const toolName = "save_idea";

  // 1. Protocol Validation
  const requiredFields = ["title_working", "source_type", "observation", "status", "created_at"];
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

  normalized.source_type = normalizeLowercase(normalized.source_type || "manual");
  normalized.status = normalizeLowercase(normalized.status || "backlog");

  if (isPlainObject(normalized.suggested_taxonomy)) {
    for (const key of Object.keys(normalized.suggested_taxonomy)) {
      if (typeof normalized.suggested_taxonomy[key] === "string") {
        normalized.suggested_taxonomy[key] = emptyStringToNull(trimString(normalized.suggested_taxonomy[key]));
      }
    }
  }

  // Enums check
  const validSourceTypes = ["manual", "comment", "dm", "call", "signal", "research"];
  const validStatuses = ["backlog", "validated", "converted", "discarded"];
  
  if (!validSourceTypes.includes(normalized.source_type)) {
    return buildErrorResponse({
      tool: toolName,
      stage: "protocol_validation",
      message: `Invalid source_type: ${normalized.source_type}`,
      errors: [{ field: "source_type", code: "INVALID_ENUM_VALUE" }]
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

  if (isNonEmptyString(normalized.observation) && normalized.observation.length < 30) {
    errors.push({
      field: "observation",
      code: "OBSERVATION_TOO_SHORT",
      message: "observation must be at least 30 characters",
      received_value: normalized.observation,
      min_length: 30
    });
  }

  if (normalized.target_reader !== undefined && normalized.target_reader !== null) {
    if (typeof normalized.target_reader !== "string") {
      errors.push({
        field: "target_reader",
        code: "INVALID_TARGET_READER_TYPE",
        message: "target_reader must be a string when provided"
      });
    } else {
      const tr = normalized.target_reader.trim();
      if (tr !== "" && tr.length < 10) {
        errors.push({
          field: "target_reader",
          code: "TARGET_READER_TOO_SHORT",
          message: "target_reader must be at least 10 characters when provided",
          received_value: normalized.target_reader,
          min_length: 10
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

  if (normalized.suggested_taxonomy !== undefined && normalized.suggested_taxonomy !== null) {
    if (!isPlainObject(normalized.suggested_taxonomy)) {
      errors.push({
        field: "suggested_taxonomy",
        code: "INVALID_TAXONOMY_OBJECT",
        message: "suggested_taxonomy must be an object"
      });
    } else {
      const taxonomy = normalized.suggested_taxonomy;
      const patternRules = [
        ["thesis_id", /^TH-\d+$/],
        ["mental_model_id", /^MM-\d+$/],
        ["cluster_id", /^CL-\d+$/],
        ["goal_id", /^PL-\d+$/]
      ];

      for (const [field, pattern] of patternRules) {
        const val = taxonomy[field];
        if (val === undefined || val === null || val === "") continue;
        if (typeof val !== "string" || !pattern.test(val)) {
          errors.push({
            field: `suggested_taxonomy.${field}`,
            code: "INVALID_TAXONOMY_ID_FORMAT",
            message: `${field} has invalid format: ${val}`
          });
        }
      }
    }
  }

  if (errors.length > 0) {
    return buildErrorResponse({
      tool: toolName,
      stage: "business_validation",
      message: "Business validation failed for save_idea",
      errors
    });
  }

  // 4. Persistence
  let ideaId = normalized.idea_id || normalized._id;
  // Auto-generate idea_id if not provided (for unique index)
  if (!ideaId) {
    ideaId = new ObjectId().toString();
  }
  const dbDoc = {
    idea_id: ideaId,
    title_working: normalized.title_working,
    source_type: normalized.source_type,
    observation: normalized.observation,
    suggested_taxonomy: normalized.suggested_taxonomy || {
      thesis_id: null,
      mental_model_id: null,
      cluster_id: null,
      goal_id: null
    },
    target_reader: normalized.target_reader || null,
    status: normalized.status,
    created_at: new Date(normalized.created_at)
  };

  const collection = db.collection("ideas");

  if (ideaId) {
    let queryId;
    try {
      queryId = new ObjectId(ideaId);
    } catch {
      queryId = ideaId; // Fallback to string if not an ObjectId
    }
    
    await collection.updateOne(
      { _id: queryId },
      { $set: dbDoc },
      { upsert: true }
    );
  } else {
    const result = await collection.insertOne(dbDoc);
    ideaId = result.insertedId.toString();
  }

  return {
    ok: true,
    tool: toolName,
    stage: "db_write",
    message: "Idea saved successfully",
    data: {
      idea_id: ideaId.toString(),
    idea_id: ideaId,
      title_working: dbDoc.title_working,
      status: dbDoc.status
    }
  };
}
