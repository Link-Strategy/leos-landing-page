## 1. Toàn cảnh hiện tại

### 1.1 Bảng trạng thái

| Thành phần | Trạng thái | Ghi chú |
|:---|:---|:---|
| Landing page (`src/`) | ✅ Build pass, 40+ routes | Next.js 16, Radix UI, Tailwind v4 |
| Blog system | ✅ Pages + API + RSS + Sitemap | `save-asset` → MongoDB → website |
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
/blog                       Blog listing (static)
/blog/[slug]                Blog chi tiết (dynamic SSR)
/rss.xml                    RSS feed (dynamic)
/sitemap                    Sitemap (dynamic)
/api/blog/posts             Blog JSON API (dynamic)
/api/contact                Lead capture API (POST)
/san-pham                   Sản phẩm (static HTML legacy)
/san-pham/[...slug]         Sản phẩm chi tiết (SSG)
/tuyen-dung                 Tuyển dụng (static HTML legacy)
/tuyen-dung/[...slug]       Tuyển dụng chi tiết (SSG)
/[slug]                     WordPress legacy pages (SSG)
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
    → News section trên landing
```

### 3.3 Lead Capture

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
- [x] S3 content bucket + IAM user + upload.cjs
- [x] Taxonomy registry (21 entries)
- [x] Dọn dẹp scripts chết (`ls-engine`)
- [x] Agent rules supplement cho LeOS

### P1 — Tiếp theo
- [ ] Sản xuất blog content đầu tiên
- [ ] Cải thiện blog UI (categories, search, pagination)
- [ ] Gửi email thông báo khi có lead mới

### P2 — Automation
- [x] Kết nối social API (LinkedIn, Facebook, Instagram, Threads, TikTok, YT, Zalo, WP)
- [ ] `publish-asset` thật (không mock)
- [ ] Google Search Console integration
### P2 - Automation
- [ ] Ket noi social API (LinkedIn, Facebook, Instagram, Threads, TikTok, YT, Zalo, WP) - tokens rong
- [ ] publish-asset that (qua /api/publish) - can tokens
- [ ] Google Search Console integration - code da co, can test voi token that

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







---

  curl http://localhost:3000/robots.txt
  # Test robots

  curl http://localhost:3000/sitemap
  # Test sitemap

  curl -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com"}'
  # Test lead capture

  npm run build
  # Build
bash:

### 7.2 Kiem tra he thong

  node .agents/tools/ls-post/cli.mjs publish-asset --asset-id <id>
  # 5. Xuat ban (blog + social + re-index)

  node .agents/tools/ls-post/cli.mjs save-asset --payload-file post.json
  # 4. Luu asset (noi dung bai viet)

  node .agents/tools/ls-post/cli.mjs save-brief --payload-file brief.json
  # 3. Luu brief voi taxonomy

  node .agents/tools/ls-post/cli.mjs save-idea --payload-file idea.json
  # 2. Luu idea (neu can brainstorm)

  node .agents/skills/ls-ops/scripts/upload.cjs path/to/image.jpg media/blog
  # 1. Upload anh cover len S3
bash:

### 7.1 Quy trinh publish bai blog


---

| i18n / English blog | Chua ho tro da ngon ngu |
| Blog CMS UI | Chi co CLI, chua co giao dien quan ly |
| Multiple authors | Author la string, chua co profile |
| RSS full content | Hien chi co excerpt, them body vao RSS |
| PWA offline support | Manifest da co, can service worker |
|:---|:---|
| Muc | Ghi chu |
### P3 - Nice to Have

| Blog metrics | ⚠️ Dang mock | Ket noi Google Analytics / dashboard that |
| CTA tracking | ⚠️ API da copy | Gan onClick vao CTA buttons trong UI |
| GSC active | ⚠️ Code san, cho test | Kiem tra .env Google credentials + test submit |
| Social publishing | ⚠️ Code san, cho tokens | User dien token, publish-asset hoat dong |
|:---|:---|:---|
| Muc | Trang thai | Hanh dong can lam |
### P2 - Automation & Analytics

| WordPress sync | ⚠️ API da copy | Co the bo neu khong dung WP nua |
| Reading time | ❌ Chua co | Tinh tu body length, hien thi tren card |
| Blog search | ❌ Chua co | Search bar + API endpoint |
| Topics navigation | ❌ Chua co | Menu filter chu de tren blog listing |
| Email notification leads | ❌ Chua co | Can Brevo API key + webhook khi co lead moi |
|:---|:---|:---|
| Muc | Trang thai | Hanh dong can lam |
### P1 - Product

| Blog pagination | ❌ Chua co | Them phan trang / load-more cho blog listing |
| Blog markdown rendering | ⚠️ Regex tam | Tich hop remark/rehype vao blog detail page |
| Social API tokens | ❌ Rong | User lay token tu LinkedIn, FB, Meta, TikTok, YouTube, Zalo, WP |
|:---|:---|:---|
| Muc | Trang thai | Hanh dong can lam |
### P0 - Critical



---

## 6. Gap Analysis — Những gì còn thiếu / chưa hoàn thiện

### P0 — Critical
| Mục | Trạng thái | Hành động cần làm |
|:---|:---|:---|
| Social API tokens | ❌ Rỗng | User lấy token từ LinkedIn, FB, Meta, TikTok, YouTube, Zalo, WP |
| Blog markdown rendering | ⚠️ Regex tạm | Tích hợp emark/ehype vào blog detail page |
| Blog pagination | ❌ Chưa có | Thêm phân trang / load-more cho blog listing |

### P1 — Product
| Mục | Trạng thái | Hành động cần làm |
|:---|:---|:---|
| Email notification leads | ❌ Chưa có | Cần Brevo API key + webhook khi có lead mới |
| Topics navigation | ❌ Chưa có | Menu filter chủ đề trên blog listing |
| Blog search | ❌ Chưa có | Search bar + API endpoint |
| Reading time | ❌ Chưa có | Tính từ body length, hiển thị trên card |
| WordPress sync | ⚠️ API đã copy | Có thể bỏ nếu không dùng WP nữa |

### P2 — Automation & Analytics
| Mục | Trạng thái | Hành động cần làm |
|:---|:---|:---|
| Social publishing | ⚠️ Code sẵn, chờ tokens | User điền token → publish-asset hoạt động |
| GSC active | ⚠️ Code sẵn, chờ test | Kiểm tra .env Google credentials + test submit |
| CTA tracking | ⚠️ API đã copy | Gắn onClick vào CTA buttons trong UI |
| Blog metrics | ⚠️ Đang mock | Kết nối Google Analytics / dashboard thật |

### P3 — Nice to Have
| Mục | Ghi chú |
|:---|:---|
| PWA offline support | Manifest đã có, cần service worker |
| RSS full content | Hiện chỉ có excerpt, thêm body vào RSS |
| Multiple authors | Author là string, chưa có profile |
| Blog CMS UI | Chỉ có CLI, chưa có giao diện quản lý |
| i18n / English blog | Chưa hỗ trợ đa ngôn ngữ |

## 7. Huong dan van hanh

### 7.1 Quy trinh publish bai blog

bash:
  # 1. Upload anh cover len S3
  node .agents/skills/ls-ops/scripts/upload.cjs path/to/image.jpg media/blog

  # 2. Luu idea (neu can brainstorm)
  node .agents/tools/ls-post/cli.mjs save-idea --payload-file idea.json

  # 3. Luu brief voi taxonomy
  node .agents/tools/ls-post/cli.mjs save-brief --payload-file brief.json

  # 4. Luu asset (noi dung bai viet)
  node .agents/tools/ls-post/cli.mjs save-asset --payload-file post.json

  # 5. Xuat ban (blog + social + re-index)
  node .agents/tools/ls-post/cli.mjs publish-asset --asset-id <id>

### 7.2 Kiem tra he thong

bash:
  # Build
  npm run build

  # Test lead capture
  curl -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com"}'

  # Test sitemap
  curl http://localhost:3000/sitemap

  # Test robots
  curl http://localhost:3000/robots.txt

---


### P0 - Critical
| Muc | Trang thai | Hanh dong can lam |
|:---|:---|:---|
| Social API tokens | ❌ Rong | User lay token tu LinkedIn, FB, Meta, TikTok, YouTube, Zalo, WP |
| Blog markdown rendering | ⚠️ Regex tam | Tich hop remark/rehype vao blog detail page |
| Blog pagination | ❌ Chua co | Them phan trang / load-more cho blog listing |

### P1 - Product
| Muc | Trang thai | Hanh dong can lam |
|:---|:---|:---|
| Email notification leads | ❌ Chua co | Can Brevo API key + webhook khi co lead moi |
| Topics navigation | ❌ Chua co | Menu filter chu de tren blog listing |
| Blog search | ❌ Chua co | Search bar + API endpoint |
| Reading time | ❌ Chua co | Tinh tu body length, hien thi tren card |
| WordPress sync | ⚠️ API da copy | Co the bo neu khong dung WP nua |

### P2 - Automation & Analytics
| Muc | Trang thai | Hanh dong can lam |
|:---|:---|:---|
| Social publishing | ⚠️ Code san, cho tokens | User dien token, publish-asset hoat dong |
| GSC active | ⚠️ Code san, cho test | Kiem tra .env Google credentials + test submit |
| CTA tracking | ⚠️ API da copy | Gan onClick vao CTA buttons trong UI |
| Blog metrics | ⚠️ Dang mock | Ket noi Google Analytics / dashboard that |

### P3 - Nice to Have
| Muc | Ghi chu |
|:---|:---|
| PWA offline support | Manifest da co, can service worker |
| RSS full content | Hien chi co excerpt, them body vao RSS |
| Multiple authors | Author la string, chua co profile |
| Blog CMS UI | Chi co CLI, chua co giao dien quan ly |
| i18n / English blog | Chua ho tro da ngon ngu |

---


### 7.1 Quy trinh publish bai blog

bash:
  # 1. Upload anh cover len S3
  node .agents/skills/ls-ops/scripts/upload.cjs path/to/image.jpg media/blog

  # 2. Luu idea (neu can brainstorm)
  node .agents/tools/ls-post/cli.mjs save-idea --payload-file idea.json

  # 3. Luu brief voi taxonomy
  node .agents/tools/ls-post/cli.mjs save-brief --payload-file brief.json

  # 4. Luu asset (noi dung bai viet)
  node .agents/tools/ls-post/cli.mjs save-asset --payload-file post.json

  # 5. Xuat ban (blog + social + re-index)
  node .agents/tools/ls-post/cli.mjs publish-asset --asset-id <id>

### 7.2 Kiem tra he thong

bash:
  # Build
  npm run build

  # Test lead capture
  curl -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com"}'

  # Test sitemap
  curl http://localhost:3000/sitemap

  # Test robots
  curl http://localhost:3000/robots.txt

---

