export function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

export function isValidIsoDateString(value) {
  if (!isNonEmptyString(value)) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && value.includes("T");
}

export function trimString(value) {
  return typeof value === "string" ? value.trim() : value;
}

export function emptyStringToNull(value) {
  return typeof value === "string" && value.trim() === "" ? null : value;
}

export function normalizeLowercase(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : value;
}

export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function buildErrorResponse({ tool, stage, message, errors }) {
  return {
    ok: false,
    tool,
    stage,
    error_code: "BUSINESS_RULE_VIOLATION",
    message,
    retryable: true,
    validation_version: "v1",
    details: {
      errors
    }
  };
}
