# GEMINI.md — Hướng dẫn cho AI Agent

Bạn là agent làm việc trên codebase LeOS Landing Page (Next.js 16). Dưới đây là những gì bạn cần biết.

## Bắt đầu

1. Đọc `.docs/LandingAgent/LandingAgent.md` để biết tổng quan dự án
2. Đọc `.docs/LandingAgent/Agent-Rules.md` để biết brand, taxonomy, tools
3. Đọc `.agents/rules/` để biết giọng văn, cấu trúc content

## Bạn được làm gì

- Sửa code trong `src/` — components, pages, API routes
- Tạo/sửa blog content qua CLI: `node .agents/tools/ls-post/cli.mjs`
- Quản lý tuyển dụng qua CLI: `node .agents/tools/ls-jobs/cli.mjs`
- Upload media lên S3: `node .agents/skills/ls-ops/scripts/upload.cjs`
- Thêm dependency vào `package.json` nếu cần

## Quy trình làm việc

1. Đọc task (file `01_TASK_SPEC.md` nếu có) hoặc nghe user yêu cầu
2. Implement code trong `src/`
3. Build thử: `npm run build`
4. Nếu có lỗi TS, sửa cho đến khi build pass
5. Push bằng git (commit + push)

## Blog — cách đăng bài

```bash
# Upload ảnh lên S3
node .agents/skills/ls-ops/scripts/upload.cjs path/to/image.jpg media/blog

# Tạo idea (nếu cần brainstorm)
node .agents/tools/ls-post/cli.mjs save-idea --payload-file idea.json

# Tạo brief
node .agents/tools/ls-post/cli.mjs save-brief --payload-file brief.json

# Lưu bài viết
node .agents/tools/ls-post/cli.mjs save-asset --payload-file post.json

# Xuất bản
node .agents/tools/ls-post/cli.mjs publish-asset --asset-id <id>
```

## Tuyển dụng — cách quản lý vị trí

Collection MongoDB: `job_listings`. Trang web: `/tuyen-dung` (danh sách) và `/tuyen-dung/[slug]` (chi tiết).

```bash
# Tạo hoặc cập nhật vị trí tuyển dụng (status mặc định: draft)
node .agents/tools/ls-jobs/cli.mjs save-job --payload-file job.json

# Xem toàn bộ danh sách (bao gồm draft/closed)
node .agents/tools/ls-jobs/cli.mjs list

# Xem chi tiết một vị trí
node .agents/tools/ls-jobs/cli.mjs get --slug <slug>

# Xuất bản → tự động revalidate cache + submit GSC sitemap
node .agents/tools/ls-jobs/cli.mjs publish --slug <slug>

# Đóng tuyển → tự động revalidate cache
node .agents/tools/ls-jobs/cli.mjs close --slug <slug>

# Revert về draft
node .agents/tools/ls-jobs/cli.mjs unpublish --slug <slug>

# Xóa vĩnh viễn
node .agents/tools/ls-jobs/cli.mjs delete --slug <slug>
```

### Payload mẫu (job.json)

```json
{
  "title": "Kỹ sư IoT cao cấp",
  "slug": "ky-su-iot-cao-cap",
  "department": "Kỹ thuật",
  "location": "Hà Nội",
  "jobType": "full-time",
  "salary": "Thỏa thuận",
  "requirements": "## Yêu cầu\n- 3+ năm kinh nghiệm...",
  "description": "## Mô tả công việc\n...",
  "benefits": "## Phúc lợi\n...",
  "status": "draft",
  "order": 1
}
```

> **Lưu ý SEO**: Sau khi publish, lệnh CLI tự động gọi `/api/recruitment/revalidate` (clear Next.js cache)
> và submit sitemap lên Google Search Console. URL chi tiết job sẽ xuất hiện trong sitemap.xml ngay lập tức.
> Trang static `/tuyen-dung/[slug]` sẽ được pre-render tại lần build tiếp theo.

## Kiểm tra

```bash
npm run build      # Build + type check
npm test           # Run tests
npm run lint       # ESLint
```
