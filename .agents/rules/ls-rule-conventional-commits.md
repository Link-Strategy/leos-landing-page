---
trigger: on_demand
description: "Quy tắc đặt tên commit nhằm đảm bảo lịch sử dự án minh bạch, phục vụ việc thay thế nhân sự trong 24h."
---

# LS-RULE-CONVENTIONAL-COMMITS

Chào Hands, lịch sử Git là tài sản tri thức của Link Strategy. Chúng tôi yêu cầu bạn tuân thủ chuẩn Conventional Commits để Brain và AI Agent có thể hiểu tiến độ mà không cần họp.

## 1. CẤU TRÚC COMMIT MESSAGE

Mẫu chuẩn: `<type>(<scope>): <description>`

### Các loại Type bắt buộc:
- **feat:** Một tính năng mới cho dự án.
- **fix:** Sửa lỗi kỹ thuật hoặc lỗi logic.
- **docs:** Thay đổi tài liệu (README, Spec, Logs).
- **test:** Thêm hoặc sửa các đoạn code kiểm thử.
- **refactor:** Thay đổi code nhưng không thay đổi tính năng hay sửa lỗi.
- **harden:** Bóc tách module thành asset tái sử dụng, đóng gói tri thức.
- **chore:** Các thay đổi về build, script tự động hóa, cấu hình repo.

## 2. QUY TẮC CỤ THỂ

- **Scope:** Ưu tiên dùng tên ProjectID hoặc ModuleID (ví dụ: `feat(DEMO-BASE): thêm script verify`).
- **Description:** Bắt đầu bằng chữ thường, không dùng dấu chấm ở cuối, mô tả ngắn gọn nhưng đủ nghĩa.
- **Cấm:** Tuyệt đối không dùng các commit mang tính vô nghĩa như "update", "fix bug", "done task".

## 3. ENFORCEMENT (ÉP BUỘC)

- Brain sẽ kiểm tra lịch sử commit trước khi chấm điểm Gate.
- Commit history rác sẽ bị Brain đánh dấu rủi ro trong review; scorecard 100 điểm chỉ áp dụng ở Brain Acceptance/Phase 2+.

---
**Status:** ACTIVE OPERATIONAL RULE
**Priority:** HIGH
