# Backlog — việc để làm sau

Cập nhật: 13/10/2026. Production: `www.letrongroup.com`. Mọi mục dưới đây không chặn việc chạy production.

## Đã quyết định bỏ ra khỏi phạm vi hiện tại
- **Thông báo lead (Telegram + email).** Lead vẫn lưu ở MongoDB `blogs.leads`, chưa có ai được báo. Khi có token: điền vào `.env` rồi chạy `node scripts/push-vercel-env.mjs` (script tự hỏi giá trị còn thiếu, đẩy lên Vercel production và deploy). Biến cần có: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SMTP_HOST/PORT/USER/PASS`, `MAIL_FROM`, `LEAD_EMAIL_TO_SALES`, `LEAD_EMAIL_TO_HR`. Gợi ý SMTP: Lark (`smtp.larksuite.com`, 465, app password).

## Hiệu năng
- Lighthouse mobile giả lập: 57–60 điểm. Đo thật: FCP/LCP ≈ 2,75 s. Nút thắt là xử lý JS ở main thread (LCP là đoạn chữ hero, render delay lớn), không còn là dung lượng ảnh.
- Việc cần làm: profile hydration/main-thread (Performance panel), xem những chunk JS lớn, cân nhắc giảm client component ở trang chủ.
- `public/about/LeaderShipCircle.webp` vẫn 1,4 MB (đã giảm từ 3,7 MB): có thể giảm chất lượng hoặc đổi kích thước.
- Đã thử bỏ Swiper v11 từ CDN: không cải thiện, đã hoàn tác. Elementor cũng nạp Swiper v8; ba component dùng `window.Swiper` (Products, CustomerReviews, HomeElementorInteractions).
- Vùng bấm trên mobile chưa đủ lớn ở vài chỗ (Lighthouse `target-size`).

## SEO / index
- Search Console: còn 17 trang chưa index (6 duplicate `/en/blog/*` sẽ tự hết vì canonical đã sửa, 5 alternate đúng canonical, 4 redirect bình thường, **2 "Crawled – currently not indexed" chưa biết là trang nào** → mở mục đó, xem URL).
- Xóa dòng sitemap cũ `https://letrongroup.com/sitemap.xml` trong Search Console (đang báo lỗi, vô hại).
- Dùng "Request indexing" cho `https://www.letrongroup.com/` nếu muốn Google crawl lại sớm.
- Facebook `sameAs` trong JSON-LD lấy từ Page ID của app đăng bài (`https://www.facebook.com/people/Letron-Vietnam/61595038693250/`): xác nhận đó là page chính thức. Thêm LinkedIn/YouTube khi có.
- Tạo/xác minh Google Business Profile (từ khóa "letron" đang bị lẫn với LeBron và công ty khác; CTR thương hiệu ≈ 5%).
- Nội dung ít (6 bài blog): đăng đều 1–2 bài/tuần bằng pipeline `ls-post`.
- Thêm BreadcrumbList và Product/Service schema cho trang sản phẩm và blog.
- Rà alt text và kích thước ảnh còn lại (chưa kiểm tra).
- `/en`: nội dung chưa dịch hết. Hiện chỉ dựa vào canonical + hreflang; blog `/en/blog/*` canonical về `/blog/*`.

## Hạ tầng
- Function đã ở `sin1`. Kiểm tra region cluster MongoDB Atlas; nếu ở Mỹ thì query DB sẽ chậm hơn.
- Cloudflare: DMARC chưa có `rua`, DNSSEC đang tắt (zone `letrongroup.com`).
- CSP đang Report-Only. Xem log `[csp-report]` vài tuần rồi mới chuyển sang chế độ chặn (bỏ `unsafe-inline`/`unsafe-eval` cần nonce cho Elementor).
- 403 lạ trên console production (4 lần), chưa tìm ra nguồn, ảnh S3 vẫn trả 200.
- Lint: còn 3 lỗi có sẵn từ trước (không do các thay đổi gần đây).

## Nội dung / chiến lược
- Xem `docs/web-v2-thong-diep.md`: bảng đối chiếu thông điệp thiết kế V2 (`D:\BusinessAnalyze\Letron\web`) với landing page hiện tại, kèm đề xuất thay thế. Chờ chốt trước khi áp dụng.
- Trang `/cong-ty-thanh-vien` đang bị ẩn (redirect tạm về `/san-pham`, bỏ khỏi footer và sitemap). Muốn mở lại: xóa hai redirect trong `next.config.ts`, thêm lại link ở `Footer.tsx` và dòng trong `src/app/sitemap/route.ts`.

## Gỡ dần WordPress/Elementor (13/10/2026)
- Đã gỡ khỏi trang chủ, Giới thiệu, Liên hệ, danh sách Sản phẩm, Blog, chính sách/điều khoản và 5 trang V2: không còn 45 file CSS, jQuery, Swiper CDN, runtime Elementor. Hiệu năng mobile (Lighthouse giả lập) 59 → 71.
- Các route còn dùng markup Elementor nằm trong `src/app/[locale]/(wp)/`: tuyển dụng, trang chi tiết sản phẩm theo công ty con (`/san-pham/*`), `/cong-ty-thanh-vien` và các trang tĩnh xuất từ WordPress (`[slug]`). Chúng nạp **một** file CSS đã lọc `public/wp-content/wp-legacy.min.css` (235 KB, 27 KB nén; trước đó 45 file 974 KB).
- Tạo lại file CSS sau khi sửa các trang đó: `node scripts/build-wp-css.mjs` (đọc HTML từ site đang chạy, dùng PurgeCSS).
- Tuyển dụng không còn nạp JS Elementor. Trang `/san-pham/*` và `[slug]` vẫn nạp (cần Swiper cho slider đánh giá).
- Việc tiếp theo để bỏ hẳn: viết lại trang `/san-pham/*` bằng React/Tailwind (và nạp Swiper riêng cho slider), rồi xóa thư mục `public/wp-content`, `public/wp-includes`, `src/lib/elementor-scripts.ts`.
