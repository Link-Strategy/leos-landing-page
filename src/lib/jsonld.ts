// schema.org builders (pure). Facts come from the site's own contact page — keep them in sync with it.

export const ORGANIZATION = {
  name: "LeTRON",
  legalName: "Công ty Cổ phần Tập đoàn LeTRON",
  email: "office@letrongroup.com",
  phone: "+842033668838",
  address: {
    streetAddress: "Tầng 3, Tòa nhà Công Thành, số 295 đường Trần Nhân Tông",
    addressLocality: "phường Uông Bí",
    addressRegion: "tỉnh Quảng Ninh",
    addressCountry: "VN",
  },
} as const;

export function buildOrganizationJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: siteUrl,
    logo: `${siteUrl}/icons/icon-512x512.png`,
    email: ORGANIZATION.email,
    telephone: ORGANIZATION.phone,
    address: { "@type": "PostalAddress", ...ORGANIZATION.address },
  };
}

export function buildWebSiteJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORGANIZATION.name,
    url: siteUrl,
    inLanguage: ["vi", "en"],
  };
}

const EMPLOYMENT_TYPES: Record<string, string> = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  contract: "CONTRACTOR",
  internship: "INTERN",
};

type JobForJsonLd = {
  title: string;
  description: string;
  department: string;
  location: string;
  jobType: string;
  publishedAt?: string | null;
  createdAt: string;
  deadline?: string;
};

function stripMarkdown(text: string) {
  return text.replace(/[#>*_`~]/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\s+/g, " ").trim();
}

/** Google JobPosting. validThrough is only emitted when the deadline is a real date. */
export function buildJobPostingJsonLd(job: JobForJsonLd, url: string, siteUrl: string) {
  const validThrough = job.deadline && /^\d{4}-\d{2}-\d{2}/.test(job.deadline) ? new Date(job.deadline) : null;

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: stripMarkdown(job.description) || job.title,
    url,
    datePosted: (job.publishedAt || job.createdAt).slice(0, 10),
    ...(validThrough && !Number.isNaN(validThrough.getTime()) ? { validThrough: validThrough.toISOString() } : {}),
    employmentType: EMPLOYMENT_TYPES[job.jobType] ?? "OTHER",
    industry: job.department,
    hiringOrganization: { "@type": "Organization", name: ORGANIZATION.name, sameAs: siteUrl },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "VN" },
    },
  };
}
