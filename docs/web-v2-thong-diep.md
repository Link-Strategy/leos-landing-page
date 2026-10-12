# Thông điệp thiết kế V2 (`D:\BusinessAnalyze\Letron\web`) so với landing page

Nguồn V2: `web/content.js`, `web/README.txt`, `web/Copy_VI_Review.json` (ngày 03/10/2026, "Bản đề xuất VI; EN chờ bản dịch duyệt"). Gói V2 ghi rõ **chưa được công bố**, nên mọi mục dưới đây là đề xuất, chưa áp dụng lên site.

## 1. Thay đổi lớn về định vị

| | Landing page hiện tại | V2 |
|---|---|---|
| Định vị | "Mạng lưới Biên tri giác" (The Perceptive Edge Network), kinh tế tuần hoàn, biến rác thải thành tài nguyên | "Hạ tầng chứng thực tại nguồn và kiểm soát tự chủ"; "Nhà máy tự vận hành có kiểm soát" |
| Khẩu hiệu | Humanity at the center. Intelligence at the edge. Evidence in every decision. | **TIN CẬY • KIỂM SOÁT • TRÁCH NHIỆM** |
| Giọng điệu | Nhiều cam kết tuyệt đối ("vận hành hoàn toàn offline, bảo mật cấp phần cứng, tự động đúc chứng thư carbon") | Thận trọng, nêu **trạng thái phát triển** từng sản phẩm; nguyên tắc "Công bố trung thực" |
| Sản phẩm | 6 trụ cột theo công ty con: LeDB, LeSM, LeSE, LeGM, LeSB, LeSC | 8 sản phẩm: LeASO, LeLe, LeCAP-M, Le-NodeFactory, Le-NodeMobility, Le-NodeAir, Le-ORION, LeOS |
| Mô hình bán | HaaS / SaaS / CaaS / AaaS, "không đầu tư ban đầu" | "một giải pháp theo dịch vụ", xác lập phạm vi, đường cơ sở và cách nghiệm thu trước khi triển khai |

→ Đây là **đổi định vị**, không phải sửa câu chữ. Cần Chủ tịch/Văn phòng Chủ tịch chốt hướng trước khi viết lại cả site.

## 2. Đối chiếu theo từng khối

| Khối | Hiện tại (`src/messages/vi.json`) | V2 đề xuất | Ghi chú |
|---|---|---|---|
| Hero `hero` | Tiêu đề "Mạng lưới Biên tri giác"; mô tả "...vận hành hoàn toàn offline, bảo mật cấp phần cứng và tự động đúc chứng thư carbon. Sẵn sàng cho kỷ nguyên Net-Zero và CBAM."; 3 ý: Hạ tầng tự chủ / Xử lý tại milimét thực địa / AI biên thực thi | Eyebrow: "NHÀ MÁY TỰ VẬN HÀNH CÓ KIỂM SOÁT". Tiêu đề: "Tự chủ vận hành. Trong tầm kiểm soát." Mô tả: "LeTRON kết nối hệ quản trị, thiết bị biên và robot công nghiệp trong một giải pháp theo dịch vụ." | Nên thay cùng lúc với khẩu hiệu mới. Hai nút CTA (Sách trắng, Demo Sandbox) V2 không đề cập, cần quyết định giữ hay đổi |
| Khẩu hiệu / ba nguyên tắc | Không có | "Biết dữ liệu đến từ đâu" (Tin cậy) · "Tự chủ trong giới hạn" (Kiểm soát) · "Kết quả có thể đối soát" (Trách nhiệm) | Khối mới, chưa có chỗ trên trang |
| H.E.A.R.T `heart`, `aboutHeartValues`, `heartTab` | Humanity · Excellence · Appreciation (hoặc Respect) · Rapid Action (hoặc Action) · Technology | Humanity · **Evidence** · **Accountability** · **Resilience** · **Truthfulness** | Hiện site đang **tự mâu thuẫn**: 3 nơi dùng 3 phiên bản khác nhau (Appreciation/Respect, Rapid Action/Action). V2 là bộ thứ ba. Nên chốt một bộ duy nhất rồi sửa cả 3 chỗ, cả `en.json` |
| Sứ mệnh / tầm nhìn `vision` | "Kiến tạo Mạng lưới Biên Tri giác... mọi hành trình thành tín chỉ xanh... kinh tế tuần hoàn toàn cầu" | Không có sứ mệnh/tầm nhìn riêng; trang Về LeTRON: "Dám nghĩ lớn. Làm bằng trách nhiệm." | Cần Chủ tịch quyết định giữ hay thay |
| Giới thiệu `about` | "tập đoàn công nghiệp thế hệ mới, kết nối dữ liệu, trí tuệ nhân tạo và tài sản vật lý... tuần hoàn và bền vững" | "Kết nối nghiên cứu, vận hành và sản xuất để đưa công nghệ vào bài toán thực tế; giữ con người và trách nhiệm ở trung tâm." + triết lý Chủ tịch Lê Minh Tiến | |
| Sản phẩm `products`, `pillars` | LeDB, LeSB, LeSE, LeSM, LeGM, LeSC | LeASO + LeLe; Le-NodeFactory; Le-NodeMobility; Le-NodeAir; Le-ORION; LeCAP-M; LeOS. Mỗi sản phẩm có nhãn trạng thái: *Đang phát triển*, *Ý tưởng ứng dụng*, *Thiết kế & R&D* | **Chưa có trang, ảnh, giá cho 8 sản phẩm mới.** Các trang `/san-pham/*` hiện có là của 6 sản phẩm cũ |
| Quy trình | Không có | 5 bước: Giao việc → Thực hiện → QC đối soát → Lưu bằng chứng → Bảo trì | Khối mới |
| Lĩnh vực | Không có | Nhà máy · Thành phố Số · Mỏ/Cảng/Logistics · Năng lượng · Thực phẩm/Chuỗi lạnh · Nông nghiệp công nghệ cao | Khối mới; V2 cũng dựng 2 trang riêng (Nhà máy, Thành phố Số) |
| Công nghệ & R&D | `techArchitecture`: LeOS × LeLe ERE, Zero Trust, tiêu chuẩn | "Một nền tảng. Nhiều ứng dụng."; danh mục **20 Họ sáng chế** thể hiện là danh mục R&D, **không** diễn giải là 20 bằng được cấp, không nêu tên từng Họ | Cần cẩn trọng pháp lý với con số "20 Họ sáng chế" |
| Liên hệ `contact` | Form liên hệ, có đồng ý chính sách bảo mật | "Cùng xác định kết quả cần đạt. Chia sẻ hiện trạng, nhiệm vụ và kết quả mong muốn để cùng xác định một phạm vi thử phù hợp." Phản hồi trong 2 ngày làm việc | Có thể dùng làm câu dẫn đầu trang liên hệ. **Cam kết "2 ngày làm việc" chỉ nên đưa lên khi có người xử lý thật** (hiện chưa có thông báo lead) |
| Chính sách bảo mật | Đã có `/chinh-sach-bao-mat` (đã được duyệt) | Chỉ là trang mẫu, chờ nội dung | Giữ bản hiện tại |
| Điều khoản sử dụng | Chưa có | Trang mẫu, chờ nội dung | Nếu cần thì soạn riêng |
| Trang 404 | Đã có trang 404 riêng | "Đường dẫn này chưa có nội dung. Anh/chị có thể về trang chủ hoặc liên hệ LeTRON..." | Có thể đổi câu chữ cho đồng nhất giọng V2 |

## 3. Điều kiện V2 tự đặt trước khi công bố
- Bản tiếng Anh do Văn phòng Chủ tịch duyệt. Hiện `en.json` chưa có phần V2.
- Tên pháp nhân và nội dung chính sách/điều khoản.
- Trạng thái phát triển từng sản phẩm.
- Hình và câu chữ công bố. Hai ảnh nhà máy/thành phố trong V2 chỉ là minh họa tạo mới, không phải công trình thật; ảnh robot Le-ORION là thiết kế ngoại thất.

## 4. Đề xuất thứ tự áp dụng
1. Chốt định vị và khẩu hiệu (mục 1) — quyết định của Chủ tịch.
2. Chốt một bộ H.E.A.R.T duy nhất; sửa `heart`, `aboutHeartValues`, `heartTab` trong cả `vi.json` và `en.json`.
3. Thay hero trang chủ (khối nhỏ, thay chữ trong `hero`).
4. Thêm ba khối mới lên trang chủ: nguyên tắc, quy trình 5 bước, lĩnh vực.
5. Viết lại danh sách sản phẩm sau khi có ảnh và trạng thái; mỗi sản phẩm mới cần trang riêng (`src/lib/products.ts`, `public/landing/san-pham/`).
6. Dịch EN và gửi duyệt.

## 5. Trang công ty con
`/cong-ty-thanh-vien` đã được ẩn (xem `docs/backlog.md`). Các trang `/san-pham/*` mang tên công ty con (LeDB, LeSM, LeSE, LeGM, LeSB, LeSC) vẫn còn vì là trang sản phẩm; nếu sản phẩm mới thay thế chúng thì cần redirect 301 sang trang sản phẩm tương ứng.
