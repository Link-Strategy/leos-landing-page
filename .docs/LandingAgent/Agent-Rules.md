# Agent Rules Supplement — LeOS Workspace

> **Mục đích**: Bổ sung và ghi đè `.agents/rules/` cho workspace LeOS.
> **Hiệu lực**: Cao hơn `.agents/rules/` khi có mâu thuẫn.
> **Phạm vi**: Workspace `leos-landing-page` — LeOS landing page + blog + content.

---

## 1. Danh tính & Định vị (Ghi đè 09-Agent Context Memory)

### Định vị thương hiệu
**LeOS (Letron Operation System)** là **hệ điều hành vận hành cho doanh nghiệp tài nguyên & môi trường** — tích hợp công nghệ chuyển hóa chất thải, vật liệu xây dựng xanh, và quản trị vận hành bền vững.

### Category
*Green Technology & Operations Platform for Resource Enterprises*

### 3 trụ cột
1. **Green Technology** — Chuyển hóa chất thải, vật liệu tái chế, giảm phát thải
2. **LeOS Platform** — Hệ điều hành vận hành tích hợp AI/IoT
3. **Sustainable Consulting** — ESG, chuyển đổi xanh, tối ưu vận hành

### Tagline
*Công nghệ xanh — Vận hành thông minh*

### Giọng điệu & Tông màu

| Thuộc tính | Mô tả |
|:---|:---|
| Giọng điệu | Chuyên nghiệp, kỹ thuật, đáng tin cậy |
| Tính cách | Nhà khoa học - kỹ sư, người tiên phong |
| Ngôn ngữ | Chính xác, có dữ liệu, tránh cường điệu |
| Cảm xúc | Tự tin, điềm tĩnh, tập trung vào giải pháp |

---

## 2. Taxonomy (Ghi đè phần tham chiếu taxonomy)

Sử dụng taxonomy đã seed trong MongoDB `taxonomy_registry` (21 entries):

### Theses (`TH-*`)

| Mã | Tên | Mô tả |
|:---|:---|:---|
| TH-01 | Waste as Resource | Chất thải là tài nguyên đang bị đặt sai chỗ |
| TH-02 | System over Technology | Doanh nghiệp không thiếu công nghệ — thiếu hệ thống vận hành |
| TH-03 | Green Operations | Chuyển đổi xanh là khoản đầu tư sinh lời |
| TH-04 | Data-Driven Sustainability | Không thể quản lý thứ không đo lường được |
| TH-05 | IoT & AI Leverage | IoT cảm nhận, AI phân tích, con người quyết định |

### Mental Models (`MM-*`)
- **MM-01** Waste Value Curve — Giá trị chất thải thay đổi theo vị trí trong chuỗi xử lý
- **MM-02** Operational Leakage — Thất thoát vận hành đến từ điểm giao giữa người và hệ thống
- **MM-03** Technology Absorption — Công nghệ chỉ có giá trị khi được hấp thụ vào quy trình thực tế
- **MM-04** Green ROI — Lợi nhuận từ chuyển đổi xanh đến từ chi phí thấp và tài nguyên tuần hoàn
- **MM-05** ESG Flywheel — ESG tốt → đầu tư xanh → tối ưu vận hành → giảm chi phí

### Content Clusters (`CL-*`)
- **CL-01** Green Technology — Công nghệ chuyển hóa chất thải, vật liệu xanh
- **CL-02** Operations & Automation — Vận hành nhà máy, tự động hóa IoT/AI
- **CL-03** ESG & Compliance — Báo cáo ESG, tiêu chuẩn môi trường
- **CL-04** Digital Transformation — Chuyển đổi số ngành tài nguyên & môi trường
- **CL-05** Case Studies & Proof — Câu chuyện khách hàng, dự án thực tế

### Distribution Goals (`PL-*`)
- **PL-01** Discussion — Thu hút bình luận, chia sẻ góc nhìn
- **PL-02** Save — Bài viết mang tính tài liệu để lưu lại
- **PL-03** Conversation/DM — Định hướng người đọc nhắn tin trực tiếp
- **PL-04** Profile Visit — Kích thích tò mò tìm hiểu sâu hơn
- **PL-05** Long-form Click — Điều hướng về blog/bài viết dài
- **PL-06** Conversion — Đăng ký dùng thử, tư vấn, nhận báo cáo

---

## 3. Công cụ hiện có (Ghi đè CONTENT_AGENT_SPEC)

### ls-post CLI
```
node .agents/tools/ls-post/cli.mjs <lệnh> [đối số]
```

| Lệnh | Chức năng | Yêu cầu |
|:---|:---|:---|
| `save-idea` | Lưu ý tưởng bài viết vào MongoDB | MongoDB |
| `save-brief` | Lưu brief chiến lược (validate taxonomy) | MongoDB + taxonomy_registry |
| `save-asset` | Lưu bài đăng + lịch hẹn giờ (QStash) | MongoDB + brief_id |
| `save-signal` | Lưu bài học từ metrics | MongoDB + asset_id |
| `search-content` | Tra cứu nội dung | MongoDB |
| `get-content` | Xem chi tiết record | MongoDB |
| `publish-asset` | Đánh dấu đã xuất bản | MongoDB |
| `fetch-metrics` | Lấy metrics (đang mock) | MongoDB |
| `schedule-asset` | Lên lịch đăng qua QStash | QStash token |
| `unschedule-asset` | Hủy lịch đăng QStash | QStash token |

### Publish API
Internal API endpoint để publish bài lên social platforms.

`
POST /api/publish
Body: { platform: string, asset: { title, body, hashtags } }
`

- Platform: linkedin, acebook, 	hreads, instagram, 	iktok, youtube, wordpress, zalo
- Đọc token từ .env theo format {PLATFORM}_ACCESS_TOKEN + {PLATFORM}_PAGE_ID
- Trả về { ok, platform, status, postId, permalink, error }
- CLI publish-asset gọi API này, fallback về blog-only nếu chưa có token

### upload.cjs
Upload file trực tiếp lên S3 (không qua Next.js server).

```
node .agents/skills/ls-ops/scripts/upload.cjs <filePath> [folder]
```

- Folder mặc định: `uploads/YYYY/MM`
- Trả về JSON `{ ok, url, key, size }`
- Cần AWS credentials trong `.env`

S3 bucket: `letron-blog-content-dev` (ap-southeast-1)
Public URL format: `https://letron-blog-content-dev.s3.ap-southeast-1.amazonaws.com/{key}`

### Blog
- Danh sách: `/blog`
- Chi tiết: `/blog/[slug]` (SEO + OG tags)
- API: `GET /api/blog/posts`
- RSS: `/rss.xml`
- Section trên landing: `News.tsx` (đọc từ MongoDB, fallback WordPress)

### Publish API
- Endpoint: POST /api/publish
- Platforms: linkedin, facebook, threads, instagram, tiktok, youtube, wordpress, zalo
- Đọc token từ process.env, cần {PLATFORM}_ACCESS_TOKEN + {PLATFORM}_PAGE_ID
- execution.mjs gọi API này, fallback về blog nếu thiếu token

### S3 Upload
- Tool: `upload.cjs` (CLI)
- Bucket: `letron-blog-content-dev`
- Upload thẳng S3 bằng `@aws-sdk/client-s3`
- Public URL có sẵn sau upload

### Lead Capture
- API: `POST /api/contact`
- Form: `LeadForm.tsx` (gọi API thật)
- Lưu trữ: MongoDB collection `leads`

---

## 4. Cấu trúc kể chuyện (Giữ nguyên từ 09-Agent Context Memory)

Áp dụng cấu trúc 6 bước:

```
1. Symptom — Nỗi đau bề mặt (VD: "Hóa đơn xử lý chất thải mỗi tháng một tăng")
2. Hidden Problem — Vấn đề thực sự (không phải chi phí, mà là không đo lường được)
3. Reframe — Đảo ngược niềm tin (chất thải là tài nguyên, không phải gánh nặng)
4. Mental Model — Giải thích bằng mô hình (Waste Value Curve, Operational Leakage...)
5. Business Implication — Tác động kinh doanh (giảm 30% chi phí, tạo thêm nguồn thu)
6. Product Bridge — Giới thiệu LeOS (chỉ khi logic đã được thiết lập)
```

---

## 5. Từ vựng (Ghi đè)

### Nên dùng
- Chuyển hóa chất thải, vật liệu xây dựng xanh, hệ điều hành vận hành
- Kinh tế tuần hoàn, thất thoát vận hành, hấp thụ công nghệ
- Mức độ sẵn sàng chuyển đổi, phát thải ròng bằng 0
- IoT cảm biến, AI tối ưu, ESG compliance, Net Zero

### Tránh dùng
- Thần tốc, đột phá, thay đổi cuộc chơi, bí quyết, công thức vàng
- Hack, mẹo vặt, AI toàn năng (nếu không có bằng chứng)
- Số hóa toàn diện (mơ hồ)

---

## 6. Product Bridge (Giữ nguyên logic từ editorial-rules)

4 mức nhắc sản phẩm: `none` → `soft` → `light` → `direct`
Tỷ lệ khuyến nghị: **4 bài value : 1 bài product-facing**

---

## 7. Quy trình vào việc (Ghi đè)

Khi bắt đầu phiên làm việc, đọc theo thứ tự:

1. `.docs/LandingAgent/LandingAgent.md` — workspace có gì, thiếu gì
2. `.docs/LandingAgent/Agent-Rules.md` — (file này) — brand, taxonomy, tools cho LeOS
3. `.agents/rules/09-Agent Context Memory.md` — giọng văn, cấu trúc kể chuyện (dùng phần không bị ghi đè)
4. `01_TASK_SPEC.md` — task hiện tại
5. `03_LOGS.md` — tiến độ & blockers

