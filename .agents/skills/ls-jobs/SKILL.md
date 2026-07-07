---
name: ls-jobs
description: Quản lý danh sách tuyển dụng (job listings) trong MongoDB cho LeOS Landing Page. Dùng khi cần tạo, cập nhật, publish, đóng hoặc xóa vị trí tuyển dụng.
---

# ls-jobs — LeOS Job Listings CLI

Công cụ CLI để quản lý tuyển dụng, lưu trong MongoDB collection `job_listings`.

## Khi nào dùng skill này

- Tạo vị trí tuyển dụng mới
- Cập nhật nội dung vị trí tuyển dụng đang có
- Publish / đóng tuyển / xóa vị trí
- Xem danh sách tất cả vị trí (kể cả draft/closed)

## Commands

```bash
# Tạo hoặc cập nhật vị trí (upsert by slug)
node .agents/tools/ls-jobs/cli.mjs save-job --payload-file job.json

# Liệt kê tất cả vị trí
node .agents/tools/ls-jobs/cli.mjs list

# Xem chi tiết một vị trí
node .agents/tools/ls-jobs/cli.mjs get --slug <slug>

# Publish vị trí (draft → published)
# → tự động gọi /api/recruitment/revalidate + submit GSC sitemap
node .agents/tools/ls-jobs/cli.mjs publish --slug <slug>

# Đóng tuyển (published → closed)
# → tự động gọi /api/recruitment/revalidate
node .agents/tools/ls-jobs/cli.mjs close --slug <slug>

# Revert về draft
node .agents/tools/ls-jobs/cli.mjs unpublish --slug <slug>

# Xóa vĩnh viễn
node .agents/tools/ls-jobs/cli.mjs delete --slug <slug>
```

## Cấu trúc payload (job.json)

```json
{
  "title": "Kỹ sư IoT cao cấp",
  "slug": "ky-su-iot-cao-cap",
  "department": "Kỹ thuật",
  "location": "Hà Nội",
  "jobType": "full-time",
  "salary": "Thỏa thuận",
  "requirements": "## Yêu cầu\n- 3+ năm kinh nghiệm IoT...",
  "description": "## Mô tả công việc\n...",
  "benefits": "## Phúc lợi\n...",
  "status": "draft",
  "order": 1,
  "externalApplyUrl": "https://..."
}
```

### Các trường bắt buộc
| Trường | Kiểu | Mô tả |
|---|---|---|
| `title` | string | Tên vị trí |
| `slug` | string | URL slug (duy nhất) |
| `department` | string | Bộ phận (VD: "Kỹ thuật", "Kinh doanh") |
| `location` | string | Địa điểm |
| `jobType` | enum | `full-time` \| `part-time` \| `contract` \| `internship` |
| `requirements` | string | Markdown — yêu cầu ứng viên |
| `description` | string | Markdown — mô tả công việc |

### Các trường tùy chọn
| Trường | Kiểu | Mô tả |
|---|---|---|
| `salary` | string | Mức lương (VD: "15-20 triệu", "Thỏa thuận") |
| `benefits` | string | Markdown — phúc lợi |
| `status` | enum | `draft` (default) \| `published` \| `closed` |
| `order` | number | Thứ tự hiển thị (nhỏ hơn = hiển thị trước, default: 99) |
| `externalApplyUrl` | string | URL form ứng tuyển ngoài |

## Trang web liên quan

- **Danh sách**: `/tuyen-dung` — cache 1h, revalidate tự động sau publish/close
- **Chi tiết**: `/tuyen-dung/[slug]` — static pre-render, SEO đầy đủ
- **Sitemap**: `/sitemap.xml` — tự động thêm URL job published
- **Revalidate API**: `POST /api/recruitment/revalidate`

## Setup & Requirements

- **Node.js**: >= 18
- **MongoDB**: Đọc `MONGODB_URI` và `MONGODB_DB_NAME` từ `.env.local` hoặc `.env`
- **GSC** (tùy chọn): `GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL` + `GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY` để tự động submit sitemap
- **Revalidate** (tùy chọn): `REVALIDATE_SECRET` để bảo vệ API revalidate

## Lưu ý

- Lệnh `publish` tự động gọi revalidate API và submit sitemap GSC (nếu có credentials)
- Nếu dev server không chạy, revalidate sẽ fail nhưng không block — CLI vẫn hoàn thành
- URL chi tiết `/tuyen-dung/[slug]` sẽ được pre-render trong lần `npm run build` tiếp theo
