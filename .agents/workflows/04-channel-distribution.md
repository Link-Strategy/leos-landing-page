---
description: Tái sử dụng và phân phối nội dung đa kênh.
---

# Workflow 04: Channel Distribution

## Tổng quan
Tái sử dụng các Asset cũ để phân phối lại hoặc bẻ lái nội dung sang nền tảng mới.

## Các bước thực hiện

### 1. Truy xuất Asset Gốc
- Lấy nội dung từ bài viết đã có:
  ```tool
  get_content_detail(record_type="asset", record_id="<ID>")
  ```

### 2. Adapt Platform
- Chuyển đổi Tone: LinkedIn (Sâu sắc) -> Threads (Punchy) -> Facebook (Hội thảo).
- Giữ nguyên Mental Model và Thesis.

### 3. Lưu Asset mới
- Dùng `save_asset` để lập lịch cho kênh mới.
- Khuyến khích tạo thêm bản EN nếu bản gốc là VI.