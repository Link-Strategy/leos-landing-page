---
description: Tự động đề xuất và quản lý ý tưởng nội dung (Idea) cho Link Strategy.
---

# Workflow 01: Idea Discovery & Backlog

## Tổng quan
Giai đoạn đầu của Lifecycle: Tìm kiếm cơ hội nội dung từ ghi chú thô, bình luận, hoặc tư vấn khách hàng.

## Các bước thực hiện

### 1. Nạp bối cảnh
- Đọc `.agents/rules/09-Agent Context Memory.md` để nắm Core Thesis (`TH-*`).

### 2. Kiểm tra Backlog
- Luôn kiểm tra để tránh trùng lặp:
  ```tool
  search_content_records(query="<từ khóa>", record_types=["ideas"])
  ```

### 3. Đưa Idea vào hệ thống
- Lưu idea mới vào Backlog qua tool `save_idea`.
- **Phân loại**: Gắn nhãn `backlog` hoặc `validated`.
- **Taxonomy**: Có thể gắn gợi ý `thesis_id` hoặc `cluster_id` sơ bộ.

### 4. Kết nối Tool
- Dùng `search_taxonomy` để tìm các mã liên quan đến idea vừa tạo.