---
description: Workflow sản xuất nội dung Master (Chỉ English, 3 nền tảng Meta).
---

# Workflow 03: Production Master

## Tổng quan
Workflow quan trọng nhất thực thi việc tạo Asset đa nền tảng cho Link Strategy.

## Các bước thực hiện

### 1. Brainstorming & Draft
- Dựa trên Brief, viết nội dung theo Narrative Flow:
  `Symptom -> Hidden Problem -> Reframe -> Mental Model -> Implication -> CTA`.

### 2. Media Generation (Skills & Tools)
- **Skill**: Sử dụng `generate_image` để tạo visual bám sát Mental Model.
- **Skill (ls-ops)**: Upload ảnh lên S3 qua script `ops.js`.
  ```powershell
  node ".agents/skills/ls-ops/scripts/ops.js" upload -FilePath "<IMAGE_PATH>" -Folder "posts/2026/03" -FileName "slug.png"
  ```

### 3. Asset Creation (Ghi Một Cửa)
- **Sanitization (BẮT BUỘC)**: Trước khi lưu, phải kiểm tra và xóa toàn bộ các thẻ kỹ thuật (`[HOOK]`, `[REFRAME]`, `[VN/EN]`, `(Platform)`) khỏi Title và Body.
- Tạo Asset Tiếng Anh duy nhất cho 3 nền tảng thuộc Meta (Facebook, Instagram, Threads).
- **Tool**: Gọi `save_asset` cho từng platform (Facebook, Instagram, Threads).
- **Lập lịch**: Điền `publish_at` (UTC) và đặt `status: "planned"`.

### 4. Checklist Tool
- [ ] Đã xóa sạch các thẻ kỹ thuật (`[...]`, `(...)`)?
- [ ] Ảnh đã lên S3?
- [ ] Đã có trường `publish_at`?
- [ ] Status là `planned` chưa?

## 5. Platform Constraints (Hard Limits)
Mọi nội dung (body + cta) phải tuân thủ giới hạn ký tự:
- **Threads**: Tối đa 500 ký tự.
- **Instagram**: Tối đa 2,200 ký tự (caption).
- **LinkedIn**: Tối đa 3,000 ký tự.