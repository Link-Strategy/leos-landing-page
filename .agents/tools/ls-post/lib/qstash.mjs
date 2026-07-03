import { Client } from "@upstash/qstash";
import { ObjectId } from "mongodb";

function getQStashClient() {
  const token = process.env.QSTASH_TOKEN;
  if (!token) {
    return null;
  }
  return new Client({ token });
}

function getBaseUrl() {
  // Use NEXT_PUBLIC_SITE_URL or APP_URL, falling back to localhost in dev
  return process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function scheduleAssetPost(runtime, { db }, assetId, doc) {
  const client = getQStashClient();
  if (!client) {
    console.log("[QStash] Skipping scheduling: QSTASH_TOKEN is not configured.");
    return null;
  }

  const publishAt = new Date(doc.publish_at);
  const delayMs = publishAt.getTime() - Date.now();
  if (delayMs <= 0) {
    console.log(`[QStash] Skipping scheduling for asset ${assetId}: publish_at is in the past.`);
    return null;
  }

  const delaySeconds = Math.max(0, Math.floor(delayMs / 1000));
  const baseUrl = getBaseUrl();
  const webhookUrl = `${baseUrl}/api/post/scheduled-posts`;

  console.log(`[QStash] Scheduling asset ${assetId} to publish at ${publishAt.toISOString()} (delay: ${delaySeconds}s)`);

  try {
    const res = await client.publishJSON({
      url: webhookUrl,
      body: {
        type: "publish-scheduled-post",
        payload: {
          assetId: assetId.toString(),
        },
      },
      delay: delaySeconds,
    });

    if (!res.messageId) {
      throw new Error("QStash did not return messageId");
    }

    console.log(`[QStash] Scheduled successfully. messageId: ${res.messageId}`);

    const jobsCollection = db.collection("scheduled_post_jobs");
    await jobsCollection.updateOne(
      { asset_id: new ObjectId(assetId) },
      {
        $set: {
          asset_id: new ObjectId(assetId),
          message_id: res.messageId,
          queue_name: "scheduled-posts",
          created_at: new Date(),
        },
      },
      { upsert: true }
    );

    return res.messageId;
  } catch (error) {
    console.error(`[QStash] Failed to schedule asset ${assetId}:`, error);
    throw error;
  }
}

export async function unscheduleAssetPost(runtime, { db }, assetId) {
  const client = getQStashClient();
  const jobsCollection = db.collection("scheduled_post_jobs");
  
  let queryId;
  try {
    queryId = new ObjectId(assetId);
  } catch {
    queryId = assetId;
  }

  const job = await jobsCollection.findOne({ asset_id: queryId });
  if (!job) {
    return true; // No job to unschedule
  }

  if (!client) {
    console.log("[QStash] Skipping unscheduling: QSTASH_TOKEN is not configured.");
    await jobsCollection.deleteOne({ asset_id: queryId });
    return true;
  }

  console.log(`[QStash] Revoking scheduled job for asset ${assetId} (messageId: ${job.message_id})`);

  try {
    await client.messages.delete(job.message_id);
    console.log(`[QStash] Revoked job ${job.message_id} successfully.`);
  } catch (error) {
    console.warn(`[QStash] Failed to delete job from QStash (might have already run or expired):`, error.message);
  } finally {
    await jobsCollection.deleteOne({ asset_id: queryId });
  }

  return true;
}
