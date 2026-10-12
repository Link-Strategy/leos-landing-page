import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { escapeHtml, formatLeadEmail, getLeadRecipients } from "../src/lib/notify/email.ts";

describe("getLeadRecipients", () => {
  const env = { LEAD_EMAIL_TO_SALES: "sales@letrongroup.com, ceo@letrongroup.com", LEAD_EMAIL_TO_HR: "hr@letrongroup.com" };

  it("routes job applications to HR and everything else to sales", () => {
    assert.deepEqual(getLeadRecipients("job_application", env), ["hr@letrongroup.com"]);
    assert.deepEqual(getLeadRecipients("contact", env), ["sales@letrongroup.com", "ceo@letrongroup.com"]);
    assert.deepEqual(getLeadRecipients("product_inquiry", env), ["sales@letrongroup.com", "ceo@letrongroup.com"]);
  });

  it("returns an empty list when unset", () => {
    assert.deepEqual(getLeadRecipients("contact", {}), []);
  });
});

describe("formatLeadEmail", () => {
  it("escapes user input in HTML and keeps the subject on one line", () => {
    const { subject, html, text } = formatLeadEmail({
      name: "Evil\r\nBcc: x@y.z <script>",
      email: "a@b.vn",
      message: "<img src=x onerror=alert(1)>",
      source: "lien-he",
      lead_type: "contact",
    });
    assert.ok(!/[\r\n]/.test(subject));
    assert.ok(subject.startsWith("[LeTRON] Lead liên hệ mới: "));
    assert.ok(!html.includes("<script>"));
    assert.ok(!html.includes("<img"));
    assert.ok(html.includes("&lt;img src=x"));
    assert.ok(text.includes("Nguồn: lien-he"));
  });

  it("adds the CV link for applications", () => {
    const { subject, html, text } = formatLeadEmail(
      { name: "B", email: "b@c.vn", phone: "0912345678", lead_type: "job_application" },
      { cvUrl: "https://s3/x?a=1&b=2" },
    );
    assert.ok(subject.includes("Hồ sơ ứng tuyển mới"));
    assert.ok(html.includes('href="https://s3/x?a=1&amp;b=2"'));
    assert.ok(text.includes("https://s3/x?a=1&b=2"));
  });
});

describe("escapeHtml", () => {
  it("escapes quotes too (attribute safety)", () => {
    assert.equal(escapeHtml(`"'<>&`), "&quot;&#39;&lt;&gt;&amp;");
  });
});
