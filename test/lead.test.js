import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Alias-free TS modules: Node 22.18+ strips types on import.
import { isHoneypotTriggered, normalizeLeadInput } from "../src/lib/lead-validation.ts";
import { createRateLimiter, getClientIp } from "../src/lib/rate-limit.ts";
import { buildCvKey, detectCvType, sanitizeFileName } from "../src/lib/cv-file.ts";
import { escapeTelegramHtml, formatLeadMessage } from "../src/lib/notify/telegram.ts";

describe("normalizeLeadInput", () => {
  it("accepts a valid lead and normalizes it", () => {
    const { lead, errors } = normalizeLeadInput({
      name: "  Nguyễn Văn A ",
      email: "A@Example.com",
      phone: "0912 345 678",
      source: "lien-he",
    });
    assert.deepEqual(errors, []);
    assert.equal(lead.name, "Nguyễn Văn A");
    assert.equal(lead.email, "a@example.com");
    assert.equal(lead.lead_type, "contact");
    assert.equal(lead.source, "lien-he");
  });

  it("rejects short name, bad email and bad phone", () => {
    const { lead, errors } = normalizeLeadInput({ name: "A", email: "nope", phone: "12ab" });
    assert.equal(lead, undefined);
    assert.deepEqual(errors.map((e) => e.code).sort(), ["INVALID_EMAIL", "INVALID_PHONE", "NAME_TOO_SHORT"]);
  });

  it("requires phone only when asked", () => {
    assert.equal(normalizeLeadInput({ name: "Anh", email: "a@b.vn" }).errors.length, 0);
    const { errors } = normalizeLeadInput({ name: "Anh", email: "a@b.vn" }, { requirePhone: true });
    assert.equal(errors[0].code, "PHONE_REQUIRED");
  });

  it("enforces length limits", () => {
    const { errors } = normalizeLeadInput({ name: "x".repeat(101), email: "a@b.vn", message: "m".repeat(3001) });
    assert.deepEqual(errors.map((e) => e.code).sort(), ["MESSAGE_TOO_LONG", "NAME_TOO_LONG"]);
  });
});

describe("isHoneypotTriggered", () => {
  it("flags a filled website field only", () => {
    assert.equal(isHoneypotTriggered({ website: "http://spam" }), true);
    assert.equal(isHoneypotTriggered({ website: "  " }), false);
    assert.equal(isHoneypotTriggered({}), false);
  });
});

describe("createRateLimiter", () => {
  it("blocks after the limit and recovers after the window", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
    assert.equal(limiter.check("ip", 0).allowed, true);
    assert.equal(limiter.check("ip", 100).allowed, true);
    const blocked = limiter.check("ip", 200);
    assert.equal(blocked.allowed, false);
    assert.equal(blocked.retryAfterSec, 1);
    assert.equal(limiter.check("other", 200).allowed, true);
    assert.equal(limiter.check("ip", 1101).allowed, true);
  });

  it("reads the first forwarded IP", () => {
    assert.equal(getClientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" })), "1.2.3.4");
    assert.equal(getClientIp(new Headers()), "unknown");
  });
});

describe("CV file checks", () => {
  const pdf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31]);
  const zip = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0, 0]);

  it("detects real file types and requires a matching extension", () => {
    assert.equal(detectCvType("cv.pdf", pdf).ext, "pdf");
    assert.equal(detectCvType("CV.DOCX", zip).ext, "docx");
    assert.equal(detectCvType("cv.docx", pdf), null);
    assert.equal(detectCvType("virus.exe", new Uint8Array([0x4d, 0x5a])), null);
  });

  it("sanitizes names and builds private keys", () => {
    assert.equal(sanitizeFileName("Hồ sơ Đặng Văn B (2026).pdf"), "Ho-so-Dang-Van-B-2026-.pdf");
    assert.equal(sanitizeFileName("../../etc/passwd"), "etc-passwd");
    assert.equal(
      buildCvKey("cv.pdf", "abc", new Date(Date.UTC(2026, 9, 12))),
      "private/cv/2026/10/abc-cv.pdf",
    );
  });
});

describe("Telegram formatting", () => {
  it("escapes HTML in user content", () => {
    assert.equal(escapeTelegramHtml("<b>&</b>"), "&lt;b&gt;&amp;&lt;/b&gt;");
    const text = formatLeadMessage({ name: "<script>", email: "a@b.vn", lead_type: "contact" });
    assert.ok(text.includes("&lt;script&gt;"));
    assert.ok(!text.includes("<script>"));
  });

  it("includes the CV link for applications", () => {
    const text = formatLeadMessage(
      { name: "B", email: "b@c.vn", phone: "0912345678", lead_type: "job_application" },
      { cvUrl: "https://s3/x?a=1&b=2" },
    );
    assert.ok(text.includes("Hồ sơ ứng tuyển mới"));
    assert.ok(text.includes('href="https://s3/x?a=1&amp;b=2"'));
  });
});
