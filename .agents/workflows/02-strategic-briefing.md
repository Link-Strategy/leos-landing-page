---
description: Lập Brief chiến lược và khóa Taxonomy chuẩn cho nội dung.
---

# Workflow 02: Strategic Briefing

## Tổng quan
Biến Idea thành một bản đặc tả chiến lược (Brief) trước khi viết nội dung.

## Các bước thực hiện

### 1. Truy xuất Idea
- Lấy chi tiết idea gốc:
  ```tool
  get_content_detail(record_type="idea", record_id="<ID>")
  ```

### 2. Khóa Taxonomy
- Tra cứu và chọn mã chuẩn tại `taxonomy_registry`:
  ```tool
  search_taxonomy(query="<chủ đề>", limit=5)
  ```
- **Bắt buộc**: 1 `TH-*` (Thesis), 1 `MM-*` (Mental Model), 1 `CL-*` (Cluster), 1 `PL-*` (Goal).

### 3. Thiết lập Brief
- Xây dựng **Core Insight** (Reframe vấn đề).
- Xác định **Product Mention Level** (None, Soft, Light, Direct).
- Lưu brief qua tool `save_brief`.

### 4. Kết quả
Bản brief sau khi lưu sẽ là Anchor Point cho tất cả các Asset phía sau.