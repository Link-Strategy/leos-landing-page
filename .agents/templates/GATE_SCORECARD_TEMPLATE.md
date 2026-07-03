# GATE SCORECARD: [PROJECT/MODULE NAME]

> **Phase 2 / Brain Acceptance Template**
>
> Template này dùng cho Brain hoặc Brain Delegate khi nghiệm thu sâu, review chất lượng và ra quyết định thương mại. Đây **không phải** điều kiện bắt buộc của Phase 1 Technical Gate. Hands Agent Phase 1 chỉ cần vượt `npm run verify-gate -- --project-path .`.

## Tổng Kết

- **Hands:** [Tên Freelancer/Agent]
- **Reviewer:** Brain / Brain Delegate
- **Ngày chấm:** [YYYY-MM-DD]
- **Trạng thái:** [PASS / PARTIAL / REJECT]
- **Tổng điểm:** 0 / 100

## 1. Kỹ Thuật Lõi - 30đ

- [ ] Unit tests pass 100% (15đ)
- [ ] Coverage đạt ngưỡng Brain yêu cầu (15đ)
- **Điểm:** / 30
- **Nhận xét:**

## 2. Chất Lượng Mã Nguồn - 20đ

- [ ] Không lỗi lint/format nghiêm trọng (10đ)
- [ ] Logic rõ, ít nợ kỹ thuật, không hacky-way (10đ)
- **Điểm:** / 20
- **Nhận xét:**

## 3. Tài Liệu & Bàn Giao - 20đ

- [ ] README/docs đủ để vận hành (10đ)
- [ ] Evidence/UAT/logs rõ ràng (10đ)
- **Điểm:** / 20
- **Nhận xét:**

## 4. Hardening Ready - 10đ

- [ ] Có khả năng tái sử dụng hoặc đã bóc tách tốt (5đ)
- [ ] Có đề xuất hardening nếu phù hợp (5đ)
- **Điểm:** / 10
- **Nhận xét:**

## 5. Security & Risk - 20đ

- [ ] Không lộ secret, không rủi ro injection rõ ràng (10đ)
- [ ] Dependency/config không tạo rủi ro vận hành đáng kể (10đ)
- **Điểm:** / 20
- **Nhận xét:**

## Quyết Định Brain

- **90-100:** Accept mạnh.
- **80-89:** Accept.
- **70-79:** Conditional accept hoặc yêu cầu sửa.
- **<70 hoặc lỗi bảo mật nghiêm trọng:** Reject.

**Quyết định thương mại/giải ngân:** [Brain điền nếu áp dụng]

---
*Scorecard này là bằng chứng audit Phase 2+, không thay thế Phase 1 `GATE_REPORT.md`.*
