---
trigger: on_demand
description: "Mandatory technical acceptance criteria for all satellites."
---
# LS-RULE-GATE-ACCEPTANCE

Quy tắc này định nghĩa **Phase 1 Technical Gate** cho Satellite delivery. Gate là cơ chế **PASS/FAIL kỹ thuật** tự động.

## 1. Ưu tiên Xác minh (Verification-First)

> [!IMPORTANT]
> Không tin báo cáo miệng. Chỉ tin bằng chứng có thể kiểm chứng được từ:
> - `npm test`
> - `npm run verify-gate -- --project-path .`
> - GitHub Actions `verification-gate` trên Satellite `main`.

## 2. Điều Kiện PASS Phase 1

> [!CAUTION]
> Delivery chỉ được push bằng `ls-gitpush` khi tất cả điều kiện local sau đạt 100%:
> - **Governance Integrity:** Không sửa đổi trái phép các file quản trị.
> - **Contract Compliance:** `package.json` đúng chuẩn, Spec không còn placeholder.
> - **Technical Health:** `npm test` PASS và `test/` có code kiểm thử thật.
> - **Security:** Không có secret hoặc file `.env` thật bị leak.

## 3. Quy Trình cho Hands Agent

1. Tự rà lại implementation so với Technical Contract và DoD trong Spec.
2. Chạy `npm test`.
3. Chạy `npm run verify-gate -- --project-path .`.
4. Nếu PASS, nộp bài qua [ls-workflow-gitpush](../../workflows/hands/ls-workflow-gitpush.md).

## 4. Cách thức Xác minh (Verification for Agent)

Agent phải tự kiểm tra trước khi nộp bài:
1. Tôi có đang hack/skip test nào không?
2. `GATE_REPORT.md` có được tạo ra với mã băm Integrity-Hash không?
3. Tôi đã tick hết Task List trong `03_LOGS.md` Progress Snapshot chưa?

---
**Status:** ACTIVE PHASE 1 TECHNICAL GATE RULE  
**Priority:** LEVEL 1
**See also:** [ls-workflow-gitpush](../../workflows/hands/ls-workflow-gitpush.md)
