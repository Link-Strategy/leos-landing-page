// CV upload checks (pure — imported directly by tests).

export const CV_MAX_BYTES = 5 * 1024 * 1024;

const SIGNATURES: Array<{ ext: "pdf" | "docx" | "doc"; contentType: string; bytes: number[] }> = [
  { ext: "pdf", contentType: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46, 0x2d] }, // %PDF-
  {
    ext: "docx",
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    bytes: [0x50, 0x4b, 0x03, 0x04], // ZIP container
  },
  { ext: "doc", contentType: "application/msword", bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] }, // OLE2
];

/** Detect the real file type from its leading bytes, and require the extension to agree. */
export function detectCvType(fileName: string, head: Uint8Array) {
  const ext = fileName.toLowerCase().split(".").pop() ?? "";
  const match = SIGNATURES.find((sig) => sig.bytes.every((b, i) => head[i] === b));
  if (!match || match.ext !== ext) return null;
  return match;
}

export function sanitizeFileName(fileName: string) {
  const base = fileName
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");
  return (base || "cv").slice(-80);
}

export function buildCvKey(fileName: string, id: string, now = new Date()) {
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `private/cv/${now.getUTCFullYear()}/${month}/${id}-${sanitizeFileName(fileName)}`;
}
