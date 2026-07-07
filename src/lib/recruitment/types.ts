import type { ObjectId } from "mongodb";

// ─── Status ──────────────────────────────────────────────────────────────────

export const JOB_STATUSES = ["draft", "published", "closed"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_TYPES = ["full-time", "part-time", "contract", "internship"] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const JOB_LOCATIONS = ["Hà Nội", "Hồ Chí Minh", "Remote", "Hybrid"] as const;
export type JobLocation = (typeof JOB_LOCATIONS)[number];

// ─── MongoDB Document ─────────────────────────────────────────────────────────

export type JobListingDocument = {
  _id?: ObjectId;
  slug: string;
  title: string;
  department: string;
  location: string;
  jobType: JobType;
  salary?: string;
  requirements: string; // Markdown
  description: string;  // Markdown
  benefits?: string;    // Markdown
  status: JobStatus;
  order: number;
  externalApplyUrl?: string;
  publishedAt?: Date | null;
  closedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// ─── Public DTO (serialisable, safe for client) ────────────────────────────────

export type JobListing = {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  jobType: JobType;
  salary?: string;
  requirements: string;
  description: string;
  benefits?: string;
  status: JobStatus;
  order: number;
  externalApplyUrl?: string;
  publishedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

// ─── Payload (used by CLI / API writes) ──────────────────────────────────────

export type JobListingPayload = {
  slug: string;
  title: string;
  department: string;
  location: string;
  jobType: JobType;
  salary?: string;
  requirements: string;
  description: string;
  benefits?: string;
  status?: JobStatus;
  order?: number;
  externalApplyUrl?: string;
};
