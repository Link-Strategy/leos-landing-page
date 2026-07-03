---
description: "Quy trình nộp bài (Secure Delivery) cho AI Hands Agent"
---

# LS-WORKFLOW-GITPUSH

Quy trình này là đường nộp bài bắt buộc của **AI Hands Agent** trong Satellite. Mục tiêu là push delivery lên `origin/main` sau khi Phase 1 Technical Gate pass local và có biên nhận (`delivery-receipt`) để GitHub Actions xác minh.

1. **Nạp Ngữ cảnh (Context Loading)**:
   Đọc các file sau để xác định giới hạn thi công và tiêu chuẩn nghiệm thu:
   - [GEMINI.md](../../../GEMINI.md)
   - [01_TASK_SPEC.md](../../../01_TASK_SPEC.md)
   - [02_DECISION_LOGS.md](../../../02_DECISION_LOGS.md)
   - [03_LOGS.md](../../../03_LOGS.md)

2. **Kiểm tra Kỹ thuật (Technical Testing)**:
   // turbo
   ```bash
   npm test
   ```
   Nếu fail, sửa code/test trước khi tiếp tục. Không skip hoặc todo test để né gate.

3. **Xác minh Cổng (Verify Gate)**:
   // turbo
   ```bash
   npm run verify-gate
   ```
   Lệnh này phải PASS để đảm bảo tính toàn vẹn của DNA quản trị (không sửa `.agents/`, `.github/`, `GEMINI.md`).

4. **Cập nhật Nhật ký (Progress Snapshot)**:
   Append một block mới vào `03_LOGS.md` bao gồm: Overall Progress, Task Status (copy từ Spec), Changed Since Last Push, và Test Evidence.

5. **Nộp bài (Secure Delivery)**:
   // turbo
   ```bash
   npm run ls-gitpush
   ```
   Lệnh này **không được truyền thêm tham số**. Tool sẽ tự động chạy lại gate, tạo `report/GATE_REPORT.md`, tạo `report/delivery-receipt.json`, tự động stage các file được phép, commit với nội dung chuẩn `"feat: delivery"` và push lên `origin/main`. Lệnh này sẽ **theo dõi realtime** trạng thái của GitHub Actions cho đến khi có kết quả cuối cùng.

6. **Xác minh qua CI (Automated)**:
   Script sẽ tự động kiểm tra GitHub Actions. Nếu CI PASS, quy trình kết thúc thành công. Nếu CI FAIL hoặc TIMEOUT, script sẽ báo lỗi và cung cấp link để Hands Agent kiểm tra nguyên nhân.

---
**Status:** ACTIVE HARDENED WORKFLOW (Antigravity Optimized)
**Mandatory for:** All Phase 1 Satellite Deliveries
