import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { escapeXml } from "../src/lib/xml.ts";

describe("escapeXml", () => {
  it("escapes the five XML special characters", () => {
    assert.equal(escapeXml(`HR & GA <"LeTRON's">`), "HR &amp; GA &lt;&quot;LeTRON&apos;s&quot;&gt;");
  });

  it("does not double-escape plain text and keeps Vietnamese", () => {
    assert.equal(escapeXml("Nguyễn Văn Công - CFO"), "Nguyễn Văn Công - CFO");
  });
});
