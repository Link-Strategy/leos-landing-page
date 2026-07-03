# LandingAgent — Kiến trúc & Vận hành Workspace

> **"Sản phẩm"**: Workspace `leos-landing-page` — hệ thống tự động hóa marketing & chuyển đổi khách hàng.

---

## 1. Toàn cảnh hiện tại

### 1.1 Bảng trạng thái

| Thành phần | Trạng thái | Ghi chú |
|:---|:---|:---|
| Landing page (`src/`) | ✅ Build pass, 40+ routes | Next.js 16, Radix UI, Tailwind v4 |
| Blog system | ✅ Pages + API + RSS + Sitemap | `save-asset` → MongoDB → website |
| `ls-post` CLI | ✅ 10 commands | MongoDB + QStash đã kết nối |
| Taxonomy registry | ✅ 21 entries | TH, MM, CL, PL |
| Lead capture | ✅ API + Form + Storage | `POST /api/contact` → MongoDB |
| Agent rules | ✅ 5 files + supplement | `.agents/rules/` + `.docs/LandingAgent/Agent-Rules.md` |
| Workflows | ✅ 5 files | idea → brief → asset → signal |
| Skills | ✅ 2 skills | ls-ops, tailwind-design-system |
| `.env` | ✅ | MongoDB, QStash, Google, Social |
| `package.json` scripts | ✅ Sạch | dev, build, start, lint, test |

### 1.2 Routes

```
/                           Trang chủ (static)
/blog                       Blog listing (static)
/blog/[slug]                Blog chi tiết (dynamic SSR)
/rss.xml                    RSS feed (dynamic)
/sitemap                    Sitemap (dynamic)
/api/blog/posts             Blog API (dynamic)
/api/contact                Lead capture API (POST)
/san-pham                   Sản phẩm (static HTML legacy)
/san-pham/[...slug]         Sản phẩm chi tiết (SSG)
/tuyen-dung                 Tuyển dụng (static HTML legacy)
/tuyen-dung/[...slug]       Tuyển dụng chi tiết (SSG)
/[slug]                     WordPress legacy pages (SSG)
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

### 3.1 Content → Blog

```
Agent viết → save-asset (platform=blog, status=planned)
  → publish-asset (status=published)
    → /blog hiển thị
    → /blog/[slug] chi tiết + SEO
    → RSS feed cập nhật
    → Sitemap cập nhật
    → News section trên landing
```

### 3.2 Lead Capture

```
LeadForm.tsx → POST /api/contact
  → Validate (name, email)
  → Lưu vào MongoDB collection "leads"
  → Trả về lead_id
```

---

## 4. Roadmap

### P0 — Đã xong
- [x] Blog system (pages, API, RSS, sitemap)
- [x] Lead capture API (`POST /api/contact`)
- [x] `ls-post` CLI hoạt động (MongoDB + QStash)
- [x] Taxonomy registry (21 entries)
- [x] Dọn dẹp scripts chết (`ls-engine`)
- [x] Agent rules supplement cho LeOS

### P1 — Tiếp theo
- [ ] Sản xuất blog content đầu tiên
- [ ] Cai thiện blog UI (categories, search)
- [ ] Gửi email thông báo khi có lead mới

### P2 — Automation
- [ ] Kết nối social API (LinkedIn, Facebook)
- [ ] `publish-asset` thật (không mock)
- [ ] Google Search Console integration

---

## 5. Quy trình vào việc

Trước khi làm việc, agent đọc theo thứ tự:

1. `.docs/LandingAgent/LandingAgent.md` — workspace có gì, thiếu gì
2. `.docs/LandingAgent/Agent-Rules.md` — brand, taxonomy, tools cho LeOS
3. `.agents/rules/09-Agent Context Memory.md` — giọng văn, cấu trúc kể chuyện
4. `01_TASK_SPEC.md` — task hiện tại
5. `03_LOGS.md` — tiến độ & blockers

### Vùng cấm

- `.agents/rules/`, `.agents/skills/`, `.agents/templates/`
- `.env.example`, `GEMINI.md`, `README.md`
