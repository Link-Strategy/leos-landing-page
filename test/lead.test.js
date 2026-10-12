import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Alias-free TS modules: Node 22.18+ strips types on import.
import { isHoneypotTriggered, normalizeLeadInput } from "../src/lib/lead-validation.ts";
import { consumeFixedWindow, createRateLimiter, getClientIp } from "../src/lib/rate-limit.ts";
import { buildCvKey, detectCvType, sanitizeFileName } from "../src/lib/cv-file.ts";
import { escapeTelegramHtml, formatLeadMessage } from "../src/lib/notify/telegram.ts";

describe("normalizeLeadInput", () => {
  it("accepts a valid lead and normalizes it", () => {
    const { lead, errors } = normalizeLeadInput({
      consent: true,
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
    const { lead, errors } = normalizeLeadInput({ consent: true, name: "A", email: "nope", phone: "12ab" });
    assert.equal(lead, undefined);
    assert.deepEqual(errors.map((e) => e.code).sort(), ["INVALID_EMAIL", "INVALID_PHONE", "NAME_TOO_SHORT"]);
  });

  it("requires phone only when asked", () => {
    assert.equal(normalizeLeadInput({ consent: true, name: "Anh", email: "a@b.vn" }).errors.length, 0);
    const { errors } = normalizeLeadInput({ consent: true, name: "Anh", email: "a@b.vn" }, { requirePhone: true });
    assert.equal(errors[0].code, "PHONE_REQUIRED");
  });

  it("enforces length limits", () => {
    const { errors } = normalizeLeadInput({ consent: true, name: "x".repeat(101), email: "a@b.vn", message: "m".repeat(3001) });
    assert.deepEqual(errors.map((e) => e.code).sort(), ["MESSAGE_TOO_LONG", "NAME_TOO_LONG"]);
  });
});

describe("V2 contact fields", () => {
  const base = { name: "Nguyen Van A", email: "a@b.vn", consent: true };

  it("keeps the interest and company picked on the contact form", () => {
    const { lead, errors } = normalizeLeadInput({ ...base, company: "ACME", interest: "Hợp tác R&D" });
    assert.equal(errors.length, 0);
    assert.equal(lead.interest, "Hợp tác R&D");
    assert.equal(lead.company, "ACME");
  });

  it("treats interest as optional and caps its length", () => {
    assert.equal(normalizeLeadInput(base).lead.interest, undefined);
    assert.equal(normalizeLeadInput({ ...base, interest: "x".repeat(300) }).lead.interest.length, 100);
  });

  it("does not require a phone number by default", () => {
    assert.equal(normalizeLeadInput(base).errors.length, 0);
  });
});

describe("privacy consent", () => {
  const base = { name: "Anh", email: "a@b.vn" };

  it("is required and reported as its own field error", () => {
    for (const consent of [undefined, false, "", "no", 0]) {
      const { lead, errors } = normalizeLeadInput({ ...base, consent });
      assert.equal(lead, undefined);
      assert.deepEqual(errors.map((e) => e.code), ["CONSENT_REQUIRED"]);
    }
  });

  it("accepts true / 'true' / 'on' (checkbox) and records when it was given", () => {
    const now = new Date("2026-10-12T10:00:00Z");
    for (const consent of [true, "true", "on"]) {
      const { lead } = normalizeLeadInput({ ...base, consent }, { now });
      assert.equal(lead.consent, true);
      assert.equal(lead.consent_at.toISOString(), "2026-10-12T10:00:00.000Z");
    }
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

describe("consumeFixedWindow (shared counter)", () => {
  // Fake of the one MongoDB call used: atomic upsert + $inc, returning the document after the update.
  function fakeCollection() {
    const docs = new Map();
    return {
      docs,
      async findOneAndUpdate({ _id }, update) {
        const doc = docs.get(_id) ?? { _id, count: 0, ...update.$setOnInsert };
        doc.count += update.$inc.count;
        docs.set(_id, doc);
        return { ...doc };
      },
    };
  }
  const options = { limit: 3, windowMs: 1000 };

  it("allows up to the limit, then blocks with a retry-after", async () => {
    const col = fakeCollection();
    const results = [];
    for (let i = 0; i < 5; i++) results.push(await consumeFixedWindow(col, "lead:abc", options, 10_250));
    assert.deepEqual(results.map((r) => r.allowed), [true, true, true, false, false]);
    assert.equal(results[3].retryAfterSec, 1);
  });

  it("is shared: two 'instances' using the same collection see one counter", async () => {
    const col = fakeCollection();
    await consumeFixedWindow(col, "lead:abc", options, 5_000);
    await consumeFixedWindow(col, "lead:abc", options, 5_100);
    await consumeFixedWindow(col, "lead:abc", options, 5_200);
    assert.equal((await consumeFixedWindow(col, "lead:abc", options, 5_300)).allowed, false);
  });

  it("resets in the next window and keeps keys independent", async () => {
    const col = fakeCollection();
    for (let i = 0; i < 4; i++) await consumeFixedWindow(col, "lead:abc", options, 5_000);
    assert.equal((await consumeFixedWindow(col, "lead:abc", options, 6_000)).allowed, true);
    assert.equal((await consumeFixedWindow(col, "lead:other", options, 5_000)).allowed, true);
  });

  it("sets an expiry so the TTL index can clean old windows", async () => {
    const col = fakeCollection();
    await consumeFixedWindow(col, "lead:abc", options, 5_500);
    const [doc] = [...col.docs.values()];
    assert.equal(doc.expireAt.getTime(), 5_000 + 2_000);
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
