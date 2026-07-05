# Blog Detail Layout Match Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the React blog detail section visually match the static WordPress/Elementor reference while keeping the static sample rendered below the React version for Playwright comparison.

**Architecture:** The top blog section will remain the production React article page, but its spacing, typography, breadcrumb treatment, meta block, share row, and related-post cards will be restyled to mirror the WordPress sample more closely. The static Elementor sample stays rendered underneath as a reference-only companion so Playwright can compare the two layouts in a single page. The work is intentionally limited to the blog detail surface and the shared blog UI pieces it depends on.

**Tech Stack:** Next.js App Router, React Server Components, Tailwind CSS v4, existing blog query helpers, existing `ShareButtons` client component, existing `StaticLandingPage` reference renderer.

## Global Constraints

- All site content is in Vietnamese.
- Do **not** modify `.agents/` directory or `GEMINI.md`.
- `01_TASK_SPEC.md` is read-only for the executor.
- Keep the static WordPress/Elementor sample rendered **below** the React blog layout for Playwright comparison.
- Match layout and UI with the static reference; avoid unrelated refactors.
- Preserve the current blog data flow from MongoDB for the React article.

---

### Task 1: Remove the duplicate reference block from the React section and keep the static sample below as the comparison target

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getCachedPublicBlogArticleBySlug`, `getCachedRelatedBlogArticles`, `renderMarkdownToHtml`, `ShareButtons`
- Produces: a single top React article layout that can be restyled to match the static reference while the static sample remains rendered underneath

- [ ] **Step 1: Update the page structure**

Replace the existing top React article layout so it reads like the WordPress sample’s structure: breadcrumb/back link, meta row, hero heading, author line, content body, share row, and related posts, while leaving the static sample below untouched.

- [ ] **Step 2: Verify the top section still renders the same article data**

Run the page locally and confirm the top section still uses the same MongoDB article content, title, cover image, and related article data.

- [ ] **Step 3: Commit the structural cleanup**

Commit message:

```bash
git add src/app/blog/[slug]/page.tsx
git commit -m "feat: keep static article sample below react blog"
```

### Task 2: Restyle the React article hero and body typography to mirror the WordPress sample

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/components/blog/ShareButtons.tsx` if needed for button spacing/shape alignment

**Interfaces:**
- Consumes: article metadata from `src/app/blog/[slug]/page.tsx`
- Produces: a hero/meta/content block with spacing, font weight, color, and hierarchy aligned to the static sample

- [ ] **Step 1: Capture the WordPress reference states**

Use Playwright on the static sample to inspect the breadcrumb, title, date, reading time, author/tags, content block, and share row spacing.

- [ ] **Step 2: Adjust the React hero spacing and hierarchy**

Update the React article container classes so the breadcrumb sits closer to the top of the article, the title uses the same vertical rhythm as the static sample, and the metadata line reads like the Elementor output rather than the current generic blog card.

- [ ] **Step 3: Tune the prose block to match the reference**

Refine the content typography so paragraph spacing, heading sizes, list/blockquote rhythm, and image rounding better match the static Elementor output.

- [ ] **Step 4: Verify the React article and static sample align visually**

Run Playwright and compare the top React article section against the rendered static layout below it.

- [ ] **Step 5: Commit the visual restyle**

Commit message:

```bash
git add src/app/blog/[slug]/page.tsx src/components/blog/ShareButtons.tsx
git commit -m "feat: restyle blog detail to match wordpress reference"
```

### Task 3: Restyle the related-post cards and share row to match the static article pattern

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/components/blog/ShareButtons.tsx`
- Optional modify: `src/components/landing/News.tsx` only if a shared card pattern is needed later

**Interfaces:**
- Consumes: the related article data already returned by `getCachedRelatedBlogArticles`
- Produces: cards and share controls that visually resemble the WordPress loop-grid and share strip

- [ ] **Step 1: Reshape the share row**

Make the share row read more like the static sample by tightening button sizing, alignment, and spacing around the label.

- [ ] **Step 2: Restyle the related-post cards**

Adjust the related posts section so the card proportions, image crop, title weight, category label, and spacing are closer to the WordPress loop-grid cards.

- [ ] **Step 3: Verify card spacing in the browser**

Use Playwright to compare the related-post row at desktop width and confirm it reads like the static reference.

- [ ] **Step 4: Commit the card refinements**

Commit message:

```bash
git add src/app/blog/[slug]/page.tsx src/components/blog/ShareButtons.tsx
git commit -m "feat: refine related posts and share row styling"
```

### Task 4: Final browser verification against the static reference

**Files:**
- No code changes expected

**Interfaces:**
- Consumes: the final React blog detail page and the static WordPress sample below it
- Produces: a verified visual match with documented differences, if any

- [ ] **Step 1: Open the blog page in Playwright**

Load `/blog/leos-bien-chat-thai-thanh-tai-nguyen` and inspect both the React section and the static sample below.

- [ ] **Step 2: Compare the key sections visually**

Check breadcrumb, hero/meta, content typography, share row, and related-post cards against the reference.

- [ ] **Step 3: Record any remaining mismatch**

If a section still differs materially, note it and loop back to the relevant task above.

- [ ] **Step 4: Commit if verification is clean**

If no further changes are needed, commit the final verification note or leave the working tree ready for review.

## Self-Review Checklist

- [x] The plan keeps the static WordPress sample rendered below the React layout.
- [x] The plan focuses on the blog detail surface only.
- [x] Every task has exact files and a test/verification step.
- [x] No placeholders, TBDs, or vague steps remain.
- [x] The task dependencies are linear and independently reviewable.
