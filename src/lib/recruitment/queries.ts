import { unstable_cache } from "next/cache";
import {
  getPublishedJobListings,
  getJobListingBySlug,
  isRecruitmentStorageConfigured,
} from "./repository";
import type { JobListing } from "./types";

export const CACHE_TAG = "job_listings";
const REVALIDATE_SECONDS = 60 * 60; // 1 hour

/** Cached list of published job listings for SSR pages. */
export const getCachedPublishedJobListings: () => Promise<JobListing[]> = unstable_cache(
  async () => {
    if (!isRecruitmentStorageConfigured()) return [];
    return getPublishedJobListings();
  },
  ["published-job-listings"],
  { tags: [CACHE_TAG], revalidate: REVALIDATE_SECONDS }
);

/** Cached single job listing by slug for SSR detail pages. */
export const getCachedJobListingBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      if (!isRecruitmentStorageConfigured()) return null;
      return getJobListingBySlug(slug);
    },
    [`job-listing-${slug}`],
    { tags: [CACHE_TAG], revalidate: REVALIDATE_SECONDS }
  )();
