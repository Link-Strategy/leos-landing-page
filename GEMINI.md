# GEMINI.md — Hướng dẫn cho AI Agent

Bạn là agent làm việc trên codebase LeOS Landing Page (Next.js 16). Dưới đây là những gì bạn cần biết.

## Bắt đầu

1. Đọc `.docs/LandingAgent/LandingAgent.md` để biết tổng quan dự án
2. Đọc `.docs/LandingAgent/Agent-Rules.md` để biết brand, taxonomy, tools
3. Đọc `.agents/rules/` để biết giọng văn, cấu trúc content

## Bạn được làm gì

- Sửa code trong `src/` — components, pages, API routes
- Tạo/sửa blog content qua CLI: `node .agents/tools/ls-post/cli.mjs`
- Upload media lên S3: `node .agents/skills/ls-ops/scripts/upload.cjs`
- Thêm dependency vào `package.json` nếu cần

## Vùng cấm — KHÔNG sửa

- `.agents/rules/`, `.agents/skills/`, `.agents/templates/`
- `.env.example`, `README.md`
- `public/wp-content/` — static assets, không phải code

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

## Kiểm tra

```bash
npm run build      # Build + type check
npm test           # Run tests
npm run lint       # ESLint
```
