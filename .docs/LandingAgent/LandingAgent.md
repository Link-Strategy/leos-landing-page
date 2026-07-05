## 1. Toàn cảnh hiện tại

### 1.1 Bảng trạng thái

| Thành phần | Trạng thái | Ghi chú |
|:---|:---|:---|
| Landing page (`src/`) | ✅ Build pass, 40+ routes | Next.js 16, Radix UI, Tailwind v4 |
| Blog system | ✅ Pages + API + RSS + Sitemap | `save-asset` → MongoDB → website |
| Blog pagination | ✅ Có phân trang | URL query `?page=` + `?cat=` |
| Blog topics filter | ✅ Lọc theo category | URL query `?cat=...` |
| Blog reading time | ✅ Tính từ body length | Hiển thị trên card + detail |
| Blog markdown rendering | ✅ `renderMarkdownToHtml` | Dùng remark/rehype thay vì regex |
| CTA tracking | ✅ `CtaButton` component | Client Component, track click → `/api/blog/track-click` |
| Blog SEO | ✅ metadata, OG, Twitter card, canonical | Từng bài viết có SEO riêng |
| `ls-post` CLI | ✅ 10 commands | MongoDB + QStash đã kết nối |
| S3 content bucket | ✅ `letron-blog-content-dev` ap-southeast-1 | Upload thẳng S3, public URL, bucket policy |
| `upload.cjs` | ✅ Direct S3 upload | CLI tool, không qua server |
| Taxonomy registry | ✅ 21 entries | TH, MM, CL, PL |
| Lead capture | ✅ API + Form + Storage | `POST /api/contact` → MongoDB |
| Agent rules | ✅ 5 files + supplement | `.agents/rules/` + `.docs/LandingAgent/Agent-Rules.md` |
| Workflows | ✅ 5 files | idea → brief → asset → signal |
| Skills | ✅ 2 skills | ls-ops, tailwind-design-system |
| `.env` | ✅ | MongoDB, QStash, Google, Social, AWS |
| `package.json` scripts | ✅ Sạch | dev, build, start, lint, test |

### 1.2 Routes

```
/                           Trang chủ (static)
/blog                       Blog listing (static, paginated, category filter)
/blog/[slug]                Blog chi tiết (dynamic SSR, SEO metadata)
/blog/topics/[slug]         Topic hub (dynamic SSR, lọc theo chủ đề)
/rss.xml                    RSS feed (dynamic)
/sitemap                    Sitemap (dynamic)
/api/blog/posts             Blog JSON API (dynamic)
/api/blog/track-click       CTA click tracking (POST)
/api/blog/refresh           Revalidate cache + GSC submit (POST)
/api/contact                Lead capture API (POST)
/san-pham                   Sản phẩm (static HTML legacy)
/san-pham/[...slug]         Sản phẩm chi tiết (SSG)
/tuyen-dung                 Tuyển dụng (static HTML legacy)
/tuyen-dung/[...slug]       Tuyển dụng chi tiết (SSG)
/[slug]                     Static landing pages (SSG, từ public/landing/)
```

### 1.3 S3 Content Storage

Bucket `letron-blog-content-dev` (ap-southeast-1) chứa toàn bộ media cho blog và content:

| Thông số | Giá trị |
|:---|:---|
| Bucket | `letron-blog-content-dev` |
| Region | `ap-southeast-1` |
| IAM User | `github-actions-uploader` |
| Policy | `PutObject`, `GetObject`, `ListBucket` — chỉ bucket này |
| Public read | `uploads/*`, `media/*` — cache 1 năm |
| Upload tool | `upload.cjs` — upload thẳng S3 bằng AWS SDK |

```
CLI upload.cjs ──► S3 PutObject ──► Public URL
```

---

## 2. Công cụ chính

### 2.1 `ls-post` CLI

```bash
node .agents/tools/ls-post/cli.mjs <lệnh> [đối số]
```

Danh sách lệnh: `save-idea`, `save-brief`, `save-asset`, `save-signal`, `search-content`, `get-content`, `publish-asset`, `fetch-metrics`, `schedule-asset`, `unschedule-asset`

Payload: `--payload-file <file>` hoặc pipe stdin

### 2.2 Scripts

| `npm run` | Chức năng |
|:---|:---|
| `dev` | Next.js dev server |
| `build` | Production build + type check |
| `start` | Production server |
| `lint` | ESLint |
| `test` | Node test runner |

---

## 3. Luồng vận hành

### 3.1 Upload Media

```
upload.cjs <filePath> [folder]
  → Upload thẳng lên S3
  → Trả về public URL
  → Dùng URL đó trong blog content
```

### 3.2 Content → Blog

```
Agent viết → save-asset (platform=blog, status=planned)
  → publish-asset (status=published)
    → /blog hiển thị
    → /blog/[slug] chi tiết + SEO
    → RSS feed cập nhật
    → Sitemap cập nhật
```

### 3.3 Lead Capture

```
LeadForm.tsx → POST /api/contact
  → Validate (name, email)
  → Lưu vào MongoDB collection "leads"
  → Trả về lead_id
```

---

## 4. Gap Analysis — Những gì còn thiếu / chưa hoàn thiện

### P0 — Critical
| Mục | Trạng thái | Hành động cần làm |
|:---|:---|:---|
| Social API tokens | ❌ Rỗng (local) / ✅ Có (Vercel Production) | Local `.env` để trống, token thật trên Vercel Production — chỉ cần deploy là dùng được |

### P1 — Product
| Mục | Trạng thái | Hành động cần làm |
|:---|:---|:---|
| Email notification leads | ❌ Chưa có | Cần Brevo API key + webhook khi có lead mới |
| Blog search | ❌ Chưa có | Search bar + API endpoint |
| Blog content production | ✅ 1 bài published (đã migrate sang articles collection) | Đã chạy migration script, routes dùng `articles` thay `assets` |
| Blog search | ❌ Chưa có | Search bar + API endpoint |

### P2 — Automation & Analytics
| Mục | Trạng thái | Hành động cần làm |
|:---|:---|:---|
| Social publishing | ⚠️ Code sẵn, chờ tokens | User điền token → publish-asset hoạt động |
| GSC active | ✅ Đã test thành công | `POST /api/blog/refresh` → GSC sitemap submitted |

### P3 — Nice to Have
| Mục | Ghi chú |
|:---|:---|
| PWA offline support | ✅ Hoàn chỉnh | Service worker (`sw.js`), manifest (`manifest.ts` + `site.webmanifest`), đủ bộ icon 16–512px, register trong `ClientScripts.tsx` |
| RSS full content | ✅ Toàn bộ body, render HTML từ markdown | Gồm heading, link, ảnh trong feed |
| Multiple authors | Author là string, chưa có profile |
| Blog CMS UI | Chỉ có CLI, chưa có giao diện quản lý |
| i18n / English blog | Chưa hỗ trợ đa ngôn ngữ |

---

## 5. Những gì đã cập nhật gần đây

### Production Readability — Blog System

| Khoản mục | Trạng thái |
|:---|:---|
| Migration `assets` → `articles` collection | ✅ All routes updated (blog listing, detail, topic, RSS, sitemap, API, News) |
| Hardcoded `linkstrategy.io.vn` | ✅ Fixed 8 files, use `getSiteUrl()` |
| Loading/error/not-found states | ✅ 8 files created (3 route groups) |
| Track-click type mismatch | ✅ `CtaButton` + route dùng `articleExternalId` |
| Unit tests | ✅ 22 tests — validation, slug, utils, SEO |
| Migration script | ✅ `scripts/migrate-assets-to-articles.mjs` (chờ chạy) |

## 6. Lỗi đã fix gần đây

| Lỗi | Nguyên nhân | Cách fix |
|:---|:---|:---|
| `onClick` trong Server Component | `<button onClick>` trong async component | Tách thành `CtaButton` Client Component |
| `themeColor` warning | Metadata không support `themeColor` | Move sang `export const viewport` |
| Mojibake ở code blog | File lưu sai encoding (ASCII) | Ghi lại UTF-8, sửa toàn bộ text UI |
| Mojibake ở MongoDB | Bytes gốc mất khi sync/import | `updateOne` với tiếng Việt đúng, thêm platform_metadata |
| CSS/JS bị vỡ khi cleanup | Xóa nhầm CSS `<link>` trong layout | Restore lại đủ 43 CSS files trong `<head>` |
| WordPress code references | Publishing adapter + env vars + docs | Xóa adapter, platform type, WEBHOOK_URL, cập nhật docs |
| PWA thiếu service worker + icons | ClientScripts chưa register SW, manifest thiếu PNG icons | Thêm `sw.js`, register trong `useEffect`, 4 PNG icon sizes, `site.webmanifest` |
| RSS chỉ có excerpt | Dùng `post.excerpt` cho `<description>` | Render full body HTML từ markdown bằng `renderMarkdownToHtml` |
| `/api/blog/sync` còn sót | WordPress sync route cũ | Xóa route khỏi codebase |
| `WEBHOOK_URL` dư thừa | Legacy WordPress publish webhook | Xóa khỏi Vercel Production env |
| Social tokens rỗng trong local `.env` | Token chỉ set trên Vercel, local để trống | Rút gọn format, thêm comment |

---

## 7. Quy trình vào việc

Trước khi làm việc, agent đọc theo thứ tự:

1. `.docs/LandingAgent/LandingAgent.md` — workspace có gì, thiếu gì
2. `.docs/LandingAgent/Agent-Rules.md` — brand, taxonomy, tools cho LeOS
3. `.agents/rules/09-Agent Context Memory.md` — giọng văn, cấu trúc kể chuyện
4. `01_TASK_SPEC.md` — task hiện tại
5. `03_LOGS.md` — tiến độ & blockers

### Vùng cấm

- `.agents/rules/`, `.agents/skills/`, `.agents/templates/`
- `.env.example`, `GEMINI.md`, `README.md`

---

## 7. Hướng dẫn vận hành

### 7.1 Quy trình publish bài blog

```bash
# 1. Upload ảnh cover lên S3
node .agents/skills/ls-ops/scripts/upload.cjs path/to/image.jpg media/blog

# 2. Lưu idea (nếu cần brainstorm)
node .agents/tools/ls-post/cli.mjs save-idea --payload-file idea.json

# 3. Lưu brief với taxonomy
node .agents/tools/ls-post/cli.mjs save-brief --payload-file brief.json

# 4. Lưu asset (nội dung bài viết)
node .agents/tools/ls-post/cli.mjs save-asset --payload-file post.json

# 5. Xuất bản (blog + social + re-index)
node .agents/tools/ls-post/cli.mjs publish-asset --asset-id <id>
```

### 7.2 Kiểm tra hệ thống

```bash
# Build
npm run build

# Test lead capture
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com"}'

# Test sitemap
curl http://localhost:3000/sitemap

# Test robots
curl http://localhost:3000/robots.txt
```
