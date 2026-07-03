---
trigger: on_demand
description: "Guidance for AI Hands Agent to ensure high-quality, traceable delivery."
---

# LS-RULE-HANDOVER-GUIDE-FOR-HANDS

Chào Hands, đây là hướng dẫn tác nghiệp bắt buộc khi bạn nhận bàn giao nhiệm vụ từ Link Strategy. Để vượt qua Gate nghiệm thu, bạn phải hiểu cách sử dụng bộ công cụ đặc tả sau đây.

## 1. SWAGGER / OPENAPI (Dành cho Backend & Integration)

Swagger không chỉ là tài liệu, nó là **Hợp đồng (Contract)**.

- **Nguyên tắc "Contract-First":** Tuyệt đối không tự ý thay đổi tên trường (Field names), kiểu dữ liệu (Data types) hoặc mã lỗi (Error codes) so với Swagger Spec mà Brain đã cung cấp.
- **Validation:** Bạn phải đảm bảo mã nguồn thực hiện đúng các quy tắc validation đã mô tả trong Swagger (ví dụ: `minLength`, `pattern`, `required`).
- **Mocker:** Khuyến khích sử dụng Swagger file để tạo Mock Server trong giai đoạn phát triển local trước khi có kết nối thật.
- **Sai lệch:** Nếu phát hiện Spec không khả thi hoặc thiếu sót, phải báo cáo ngay qua `02_DECISION_LOGS.md` để Brain cập nhật Spec, tuyệt đối không tự ý sửa code khác với Spec.

## 2. FIGMA (Dành cho Frontend & Mobile)

Figma là **Nguồn sự thật duy nhất (Source of Truth)** về giao diện.

- **Pixel-Perfect:** Chúng tôi yêu cầu độ chính xác cao về mặt thị giác. Hãy sử dụng tính năng "Inspect" của Figma để lấy thông số chính xác.
- **Design Tokens:** 
    - Tuyệt đối không dùng mã màu Hex thủ công (ví dụ: `#FF5733`). 
    - Phải sử dụng các biến CSS hoặc Tailwind classes tương ứng với Design System (ví dụ: `var(--color-primary)` hoặc `text-primary-500`).
- **Assets:** Chỉ sử dụng Icon/Image đã được Brain export hoặc chỉ định trong Figma. 
- **Responsive:** Phải kiểm tra thiết kế trên cả 3 khung nhìn (Mobile, Tablet, Desktop) nếu Spec có yêu cầu.

## 3. QUY TRÌNH TIẾP NHẬN 24H (In-boarding)

Khi nhận Task Spec, bạn có 24h để:
1. Đọc kỹ Spec và các tài liệu Swagger/Figma đính kèm.
2. Chạy thử môi trường Sandbox/Docker được cấp.
3. Đặt câu hỏi tại `02_DECISION_LOGS.md` nếu có bất kỳ điểm nào mơ hồ.
4. Sau 24h, nếu không có câu hỏi, hệ thống coi như bạn đã hiểu rõ và cam kết thực hiện đúng 100% Contract.

---
**Status:** ACTIVE OPERATIONAL RULE
**Priority:** HIGH
