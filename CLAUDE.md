# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LeOS landing page — a Vietnamese-language corporate site built with **Next.js 16** (App Router), **Tailwind CSS v4**, and **Radix UI** primitives. Serves as the front door for LeOS, a green technology / waste-to-resources company.

## Architecture

### Content

Pages are React (App Router). Blog content lives in **MongoDB** (`assets` / `articles`), queried via `src/lib/blog/`. There is no WordPress/Elementor code or CSS in the repo.

### Key Architecture Patterns

- **React islands** (e.g., `HeartTab.tsx`, `Products.tsx`, `News.tsx`, Header/Footer) are interactive components that overlay or replace static section behavior.
- **Path alias `@/`** maps to `src/` (also `@/ui/*` → `src/components/ui/*`, `@/layout/*` → `src/components/layout/*`, etc.)

### Route Structure

| Route | Type | Source |
|-------|------|--------|
| `/` | React | `src/components/landing/` + `src/components/v2/` |
| `/blog` | SSR | MongoDB via `src/lib/blog/queries.ts` |
| `/blog/[slug]` | SSR | MongoDB, MD rendered via remark/rehype |
| `/rss.xml` | Dynamic | MongoDB → RSS XML |
| `/sitemap` | Dynamic | Static pages + blog URLs |
| `/api/blog/posts` | JSON API | MongoDB |
| `/api/blog/track-click` | POST | CTA click tracking |
| `/api/contact` | POST | Lead capture → MongoDB `leads` + Telegram (honeypot, rate limit) |
| `/api/apply` | POST multipart | Job application: CV → private S3 (`private/cv/`) + Telegram with 7-day presigned link |
| `/api/blog/articles` | POST (Bearer) | Upsert blog article into `articles` (used by `ls-post publish-asset`) |
| `/api/metrics` | POST (Bearer) | Real platform metrics for an asset (used by `ls-post fetch-metrics`) |
| `/gioi-thieu`, `/lien-he`, `/san-pham`, `/tuyen-dung` | React | components in `src/components/` |

### Directory Structure

```
src/
├── app/                   # Next.js App Router pages + API routes
│   ├── blog/              # Blog listing + detail pages
│   ├── api/               # API routes (blog CRUD, publish, contact, revalidate)
│   ├── [slug]/            # Catch-all for static landing pages
│   ├── layout.tsx         # Root layout (Header, Footer)
│   └── page.tsx           # Homepage (composes StaticSection + React components)
├── components/
│   ├── ui/                # Radix UI primitives (shadcn-style, ~30 components)
│   ├── layout/            # Header, Footer, SearchBar, ScrollToTop, ClientScripts
│   ├── landing/           # Homepage interactive sections (Hero, Products, News, etc.)
│   ├── blog/              # CtaButton
│   └── subpage/           # SubpageHero, SubpageSections, LeadForm
├── lib/
│   ├── blog/              # Blog repository, queries, cache, SEO, types, topics, tracking, validation
│   ├── publishing/        # Social media publishing system (LinkedIn, FB, Instagram, TikTok, etc.)
│   ├── mongodb.ts         # MongoDB client (blog DB, "blogs" database)
│   ├── lead-storage.ts    # Lead capture validation + storage
│   └── utils.ts           # cn() helper (clsx + tailwind-merge)
├── app/
public/
└── assets/                # Logo SVGs and company assets
```

### Social Publishing System

A multi-platform social media posting system lives in `src/lib/publishing/`. Supports: LinkedIn, Facebook, Threads, Instagram, TikTok, YouTube, Zalo. Tokens loaded from `.env` (no DB OAuth). Uses an adapter factory pattern:
- `src/lib/publishing/index.ts` — core `PostingPublisherService`, types, env loader
- `src/lib/publishing/adapters/posting-adapter-factory.ts` — dynamic `import()` of adapters
- `src/lib/publishing/adapters/*-posting-adapter.ts` — individual platform implementations
- Endpoint: `POST /api/publish`

### Agent Skills & Workflows

Located in `.agents/`:
- **`ls-post` CLI** (`.agents/tools/ls-post/cli.mjs`) — 11 commands: `save-idea`, `save-brief`, `save-asset`, `save-signal`, `search-content`, `search-taxonomy`, `get-content`, `publish-asset` (posts via `/api/publish`), `fetch-metrics` (mock data), `schedule-asset`, `unschedule-asset`
- **Workflows** (`.agents/workflows/`) — 5 pipeline definitions: idea-discovery, strategic-briefing, production-master, channel-distribution, signal-mining
- **`ls-jobs` CLI** (`.agents/tools/ls-jobs/cli.mjs`) — recruitment job listings (`job_listings`)
- **Skills**: `ls-ops` (S3 uploads + MongoDB deletes/audits), `ls-jobs`. `tailwind-design-system` lives in `.claude/skills/`
- **Docs**: `.docs/LandingAgent/` contains agent rules and technical specifications

## Commands

```bash
npm run dev       # Start Next.js dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run test      # Run tests (node --test test/*.test.js)
```

## Key Conventions

- **CSS**: Tailwind v4 with CSS variables in `globals.css`. Custom styles use `@layer utilities` or inline in component files. The project defines extensive CSS custom properties for theming via radix/Elementor bridge.
- **Content**: All site content is in **Vietnamese**. Blog posts stored in MongoDB.
- **Typography**: Uses `Archivo` (headings, variable `--font-archivo`) and `Outfit` (body, variable `--font-outfit`) from Google Fonts.
- **Component imports**: Prefer `@/ui/button` shorthand for UI primitives, `@/components/*` for app components.
- **Markdown rendering**: `remark` → `remark-gfm` → `remark-rehype` → `rehype-sanitize` → `rehype-stringify` pipeline in `src/lib/blog/markdown.ts`.

## Environment Variables (`.env`)

- `MONGODB_URI` / `MONGODB_DB_NAME` — MongoDB connection (blog content storage)
- `NEXT_PUBLIC_SITE_URL` — Canonical site URL
- Social tokens: `*_ACCESS_TOKEN`, `*_PAGE_ID` per platform (LinkedIn, Facebook, Threads, Instagram, TikTok, YouTube, Zalo)
- `QSTASH_TOKEN` / `QSTASH_URL` — QStash scheduling
- AWS S3: standard `AWS_*` env vars for blog content bucket
- `BLOG_API_BEARER_TOKEN` — Auth for blog revalidation API

## Governance Documents (Read Before Starting Work)

1. `GEMINI.md` — Workspace constitution
2. `01_TASK_SPEC.md` — Primary execution contract / technical specifications
3. `02_DECISION_LOGS.md` — Architectural and logic decision records
4. `.docs/LandingAgent/LandingAgent.md` — Workspace overview, status, CLI reference
5. `.docs/LandingAgent/Agent-Rules.md` — Brand identity, taxonomy, story structure, vocabulary rules

## Important Constraints

- **Do NOT modify** `.agents/` directory or `GEMINI.md` unless the project owner explicitly asks
- Write APIs (`/api/publish`, `/api/blog/articles`, `/api/blog/refresh`, `/api/metrics`) require `Authorization: Bearer $BLOG_API_BEARER_TOKEN` in production (open in dev); see `src/lib/api-auth.ts`
- Lead notifications (`src/lib/notify`): Telegram (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) + SMTP email (`SMTP_HOST/PORT/USER/PASS`, `MAIL_FROM`, `LEAD_EMAIL_TO_SALES` for contact/product leads, `LEAD_EMAIL_TO_HR` for job applications). Each channel is skipped when unconfigured; leads are always saved
- `01_TASK_SPEC.md` is read-only for the executor
- Blog **`assets` collection** powers the simpler blog display (used by blog-utils). The **`articles` collection** (via `repository.ts`) is the full-featured blog with indexes, click tracking, and SEO — use `repository.ts` for new blog features
- All site content is in **Vietnamese**
