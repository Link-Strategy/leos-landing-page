# Thiết kế V2 (`D:\BusinessAnalyze\Letron\web`) đã áp dụng vào landing page

Nguồn V2: `web/content.js`, `web/app.js`, `web/README.txt` (03/10/2026). Quy tắc chủ dự án (13/10/2026): *chỗ nào V2 mâu thuẫn với nội dung hiện tại thì thay, chỗ nào không mâu thuẫn thì thêm*. Bản tiếng Anh là bản dịch của chúng tôi.

## Đã áp dụng (production)

**Thay thế (mâu thuẫn với nội dung cũ)**
- Hero trang chủ: "Tự chủ vận hành. / Trong tầm kiểm soát.", phụ đề, ba ý, mô tả, thẻ cuối hero; hai nút → "Khám phá giải pháp" (`/giai-phap`) và "Trao đổi thử nghiệm" (`/lien-he`).
- Sơ đồ Mặt trời và hai quỹ đạo (`HeroOrbit.tsx`) thay cho ảnh sáu hexagon: vòng trong LeASO, LeLe, LeCAP-M; vòng ngoài Le-NodeFactory, Le-NodeMobility, Le-NodeAir, Le-ORION, LeOS. Tooltip có trạng thái, mô tả và link. Tốc độ quay nhanh hơn V2 (V2 chỉ 2°/giây, không nhìn thấy).
- Sứ mệnh/tầm nhìn (trang chủ và Giới thiệu), H.E.A.R.T (Humanity, Evidence, Accountability, Resilience, Truthfulness) ở cả ba nơi, tiêu đề các trang, 404, footer ("Tin cậy · Kiểm soát · Trách nhiệm").
- Mục Sản phẩm (giữa trang chủ và `/san-pham`) và menu Sản phẩm trong header/footer: 6 sản phẩm V2 kèm nhãn trạng thái, thay cho 6 sản phẩm theo công ty con.
- JSON-LD Organization: mô tả theo định vị V2.

**Thêm mới (không mâu thuẫn)**
- Trang chủ: ba nguyên tắc, hai khối nhà máy/Thành phố Số (ảnh minh họa V2), vòng vận hành 5 bước, dải "20 Họ sáng chế" (ghi rõ là danh mục R&D), S.a.a.S, triết lý Chủ tịch, kêu gọi hành động.
- Trang mới: `/giai-phap`, `/nen-tang`, `/nha-may`, `/thanh-pho-so`, `/dieu-khoan-su-dung` (vi + en, có trong sitemap, hreflang).
- Giới thiệu: sứ mệnh, triết lý, hệ sinh thái LeAR/LeDB/LeHS.
- Form liên hệ: tổ chức, nhu cầu quan tâm, bộ đếm 1.000 ký tự, cảnh báo tài liệu mật, ba bước chuẩn bị sau khi gửi; số điện thoại không bắt buộc; `interest` được lưu và hiện trong thông báo Telegram/email.

**Giữ nguyên vì V2 không đề cập:** mô hình HaaS/SaaS/CaaS/AaaS, kiến trúc công nghệ, lộ trình, đối tác, chính sách bảo mật, tuyển dụng, blog.

**Đã xóa:** 6 trang `/san-pham/<công-ty-con>` (301 về `/san-pham`, bỏ khỏi sitemap).

**Đã ẩn:** `/cong-ty-thanh-vien` (redirect 307 về `/san-pham`, bỏ khỏi footer và sitemap). Mở lại: xóa hai redirect trong `next.config.ts`, thêm link ở `Footer.tsx` và dòng trong `src/app/sitemap/route.ts`.

## Cố ý không làm
- Giảm chuyển động / nút tạm dừng của V2 (chủ dự án không muốn).
- Giao diện màu giấy/cobalt của V2: các khối mới dùng kiểu dáng V1 (nền navy, viền cyan) cho đồng bộ.
- Cam kết "phản hồi trong 2 ngày làm việc" và mã tham chiếu DEMO của V2: chưa có quy trình xử lý lead.

**Gộp (13/10/2026):** nội dung `/cong-nghe` nằm trong `/gioi-thieu#cong-nghe`, URL cũ redirect 308. File `src/app/[locale]/cong-nghe/page.tsx` giữ lại nhưng không còn được phục vụ.

## Còn lại
1. Icon H.E.A.R.T vẫn là file cũ (`respect.svg` đi với Accountability, `action.svg` với Resilience): cần bộ icon mới nếu muốn khớp nghĩa.
