import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { getPendingTargets, getPublishTargets, mergePublishResults } from "../.agents/tools/ls-post/lib/publish-plan.mjs";
import { publishAsset } from "../.agents/tools/ls-post/lib/execution.mjs";

const SOCIAL = ["linkedin", "facebook", "threads", "instagram", "tiktok", "youtube", "zalo"];

describe("publish plan", () => {
  it("expands targets per asset platform", () => {
    assert.deepEqual(getPublishTargets({ platform: "blog" }, SOCIAL), ["blog"]);
    assert.deepEqual(getPublishTargets({ platform: "facebook" }, SOCIAL), ["facebook"]);
    assert.equal(getPublishTargets({ platform: "multi" }, SOCIAL).length, 7);
    assert.deepEqual(getPublishTargets({ platform: "myspace" }, SOCIAL), []);
  });

  it("keeps only targets that have not succeeded", () => {
    const prev = [{ platform: "facebook", ok: true }, { platform: "linkedin", ok: false, status: "skipped" }];
    assert.deepEqual(getPendingTargets(["facebook", "linkedin", "zalo"], prev), ["linkedin", "zalo"]);
  });

  it("replaces retried results and keeps the rest", () => {
    const merged = mergePublishResults(
      [{ platform: "facebook", ok: true, postId: "fb1" }, { platform: "linkedin", ok: false }],
      [{ platform: "linkedin", ok: true, postId: "li1" }],
    );
    assert.deepEqual(merged, [{ platform: "facebook", ok: true, postId: "fb1" }, { platform: "linkedin", ok: true, postId: "li1" }]);
  });
});

describe("publishAsset retry (fake DB + mocked /api/publish)", () => {
  it("retries only the failed platform and never re-posts the successful one", async () => {
    let doc = { _id: "a1", platform: "multi", status: "planned", title: "T", body: "B" };
    const db = {
      collection: () => ({
        findOne: async () => doc,
        updateOne: async (_q, { $set }) => { doc = { ...doc, ...$set }; },
      }),
    };

    const calls = [];
    const realFetch = globalThis.fetch;
    let linkedinUp = false;
    globalThis.fetch = async (_url, init) => {
      const { platform } = JSON.parse(init.body);
      calls.push(platform);
      const ok = platform === "facebook" || (platform === "linkedin" && linkedinUp);
      return new Response(JSON.stringify({ ok, platform, status: ok ? "published" : "failed", postId: ok ? `${platform}-1` : undefined }));
    };

    try {
      const first = await publishAsset({}, { db }, "a1");
      assert.equal(first.ok, true);
      assert.equal(doc.status, "published");
      assert.ok(doc.failed_platforms.includes("linkedin"));
      assert.equal(calls.filter((p) => p === "facebook").length, 1);

      calls.length = 0;
      linkedinUp = true;
      const second = await publishAsset({}, { db }, "a1");
      assert.equal(second.ok, true);
      assert.ok(!calls.includes("facebook"), "facebook must not be re-posted");
      assert.ok(calls.includes("linkedin"));
      assert.ok(!doc.failed_platforms.includes("linkedin"));
      assert.equal(doc.publish_results.find((r) => r.platform === "facebook").postId, "facebook-1");
    } finally {
      globalThis.fetch = realFetch;
    }
  });
});
