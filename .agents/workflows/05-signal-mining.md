---
description: Khai thác Signal từ Case Study và kết quả Publish.
---

# Workflow 05: Signal Mining

## Tổng quan
Vòng lặp học thuật từ Performance và thực tế Consulting.

## Các bước thực hiện

### 1. Signal Extractor (Case Studies)
- Phân tích Raw Notes từ Pilot/Consulting.
- Tách lớp: `Situation -> Pain Point -> System Gap -> Intervention -> Lesson`.
- Lưu qua `save_signal`.

### 2. Metric Analysis
- Sau khi publish bài viết, quét kết quả:
  ```tool
  fetch_publication_results()
  fetch_publication_metrics(publication_plan_ids=["<ID>"])
  ```
- Trích xuất Objections/Pain points mới.

### 3. Feed to Loop
- Nếu Signal mạnh -> Chuyển đổi thành Idea mới qua `save_idea` (status: `validated`).
- Khởi động lại Workflow 01.