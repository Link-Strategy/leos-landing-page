# Nội dung nháp thay Lorem ipsum — cần duyệt trước khi deploy

Soạn từ mô tả sản phẩm trong `src/messages/vi.json`, nội dung trang Giới thiệu và quy tắc giọng văn `.agents/rules/Agent-Rules.md`.
Không có số liệu nào được bịa thêm. Sửa trực tiếp tại file được ghi ở mỗi mục.

## Trang Sản phẩm (`public/landing/san-pham/index.html`)
- **Hero:** Sáu dòng sản phẩm LeTRON kết nối dữ liệu, năng lượng, vật liệu và hạ tầng thành một hệ sinh thái công nghiệp xanh, vận hành thống nhất trên nền tảng LeOS.
- **Thẻ slider** (đã bỏ 2 thẻ trùng LeDB/LeSE, còn 6 thẻ):
  - **LeDB — BỘ NÃO SỐ:** Hệ quản trị dữ liệu tích hợp kết nối toàn bộ hệ thống số hóa, thiết lập hộ chiếu sản phẩm tuần hoàn.
  - **LeSB — XÂY DỰNG THÔNG MINH:** Số hóa hạ tầng kỹ thuật xây dựng công trình giao thông, cảng biển và kết cấu công nghiệp lắp ghép.
  - **LeSE — NĂNG LƯỢNG THÔNG MINH:** Tích hợp điện mặt trời, điện gió và trạm lưu trữ năng lượng BESS phục vụ vận hành Net Zero.
  - **LeSM — DI CHUYỂN THÔNG MINH:** Hạ tầng trạm sạc xe điện thông minh, trạm đổi pin tự động và tối ưu hóa hệ thống logistics xanh.
  - **LeGM — VẬT LIỆU XANH:** Bê tông tươi cấp phối tối ưu, gạch không nung, thép xanh và bê tông chống xâm thực nước biển.
  - **LeSC — ĐÔ THỊ THÔNG MINH:** Quy hoạch đô thị sinh thái thông minh và phát triển khu công nghiệp sinh thái tuần hoàn.
- **FAQ:**
  - **Tự động hóa bằng LeTRON có thể giúp ích gì cho doanh nghiệp của tôi?** — LeTRON giúp doanh nghiệp đo lường và tối ưu vận hành dựa trên dữ liệu thời gian thực: giảm thất thoát nguyên liệu và năng lượng, theo dõi phát thải, đồng thời biến phụ phẩm, chất thải thành nguồn tài nguyên có giá trị.
  - **Việc tích hợp trí tuệ nhân tạo LeTRON vào hệ thống hiện tại của tôi có khó không?** — Các giải pháp LeTRON được thiết kế để kết nối với hệ thống sẵn có (ERP, SCADA, cảm biến IoT) thông qua LeDB. Đội ngũ LeTRON khảo sát hiện trạng trước, sau đó tích hợp theo từng giai đoạn để không làm gián đoạn sản xuất.
  - **Những ngành nào có thể hưởng lợi từ tự động hóa bằng trí tuệ nhân tạo?** — Các ngành có nhiều tài nguyên, năng lượng và chất thải như vật liệu xây dựng, nhiệt điện, khai khoáng, hạ tầng giao thông – cảng biển, khu công nghiệp và quản lý đô thị.
  - **Việc thiết lập LeTRON mất bao lâu?** — Thời gian triển khai phụ thuộc vào quy mô và mức độ số hóa hiện tại của doanh nghiệp. Sau buổi khảo sát, LeTRON sẽ đề xuất lộ trình triển khai cụ thể theo từng giai đoạn.
  - **Tôi có thể yêu cầu một giải pháp LeTRON tùy chỉnh không?** — Có. Mỗi giải pháp được điều chỉnh theo quy trình, dữ liệu và mục tiêu riêng của doanh nghiệp. Hãy để lại thông tin để đội ngũ LeTRON liên hệ tư vấn.

## Đoạn giới thiệu dưới tiêu đề mỗi trang sản phẩm (`public/landing/san-pham/<slug>/index.html`)
- **LeDB — BỘ NÃO SỐ** (`ledb-bo-nao-so`): LeDB là nền tảng dữ liệu trung tâm của hệ sinh thái LeTRON: hợp nhất dữ liệu sản xuất, năng lượng và vật liệu theo thời gian thực, truy xuất nguồn gốc qua hộ chiếu sản phẩm tuần hoàn và cung cấp nền tảng cho phân tích, tối ưu bằng AI.
- **LeSB — XÂY DỰNG THÔNG MINH** (`lesb-xay-dung-thong-minh`): LeSB số hóa vòng đời công trình hạ tầng — từ thiết kế, thi công đến vận hành — cho công trình giao thông, cảng biển và kết cấu công nghiệp lắp ghép, giúp kiểm soát tiến độ, chất lượng và vật liệu dựa trên dữ liệu.
- **LeSE — NĂNG LƯỢNG THÔNG MINH** (`lese-nang-luong-thong-minh`): LeSE tích hợp điện mặt trời, điện gió và hệ thống lưu trữ năng lượng BESS vào một nền tảng quản lý thống nhất, giúp doanh nghiệp theo dõi, tối ưu chi phí năng lượng và từng bước tiến tới vận hành Net Zero.
- **LeSM — DI CHUYỂN THÔNG MINH** (`lesm-di-chuyen-thong-minh`): LeSM xây dựng hạ tầng di chuyển xanh gồm trạm sạc xe điện thông minh và trạm đổi pin tự động, kết hợp dữ liệu vận hành để tối ưu tuyến, đội xe và chi phí logistics.
- **LeGM — VẬT LIỆU XANH** (`legm-vat-lieu-xanh`): LeGM chuyển hóa phụ phẩm và chất thải công nghiệp thành vật liệu xây dựng xanh: bê tông tươi cấp phối tối ưu, gạch không nung, thép xanh và bê tông chống xâm thực nước biển — giảm phát thải mà vẫn đáp ứng yêu cầu kỹ thuật.
- **LeSC — ĐÔ THỊ THÔNG MINH** (`lesc-do-thi-thong-minh`): LeSC kết nối dữ liệu hạ tầng, năng lượng, giao thông và môi trường để quy hoạch, vận hành đô thị sinh thái thông minh và khu công nghiệp sinh thái theo mô hình kinh tế tuần hoàn.

## Trang khác
- **Liên hệ** (`public/landing/lien-he/index.html`): Bạn cần tư vấn giải pháp công nghệ xanh, hợp tác dự án hay tìm hiểu sản phẩm LeTRON? Hãy để lại thông tin — đội ngũ LeTRON sẽ phản hồi sớm nhất.
- **Công ty thành viên** (`public/landing/cong-ty-thanh-vien/index.html`): Các công ty thành viên của LeTRON cùng vận hành hệ sinh thái công nghiệp xanh — từ công nghệ, vật liệu, năng lượng đến hạ tầng — trên nền tảng dữ liệu LeOS.
- **Giới thiệu — hero** (`src/messages/vi.json` → `about.heroDescription`): Tập đoàn công nghiệp thế hệ mới, ứng dụng dữ liệu và trí tuệ nhân tạo để biến chất thải thành tài nguyên và vận hành chuỗi giá trị công nghiệp xanh.
  - Bản tiếng Anh (`en.json`): A new-generation industrial group using data and artificial intelligence to turn waste into resources and run a green industrial value chain.
- **Tuyển dụng — hero** (`src/components/recruitment/RecruitmentPage.tsx`): Cùng LeTRON kiến tạo nền công nghiệp xanh và tương lai Net Zero. Chúng tôi tìm kiếm những người muốn dùng công nghệ và dữ liệu để giải quyết các bài toán thật về tài nguyên, năng lượng và môi trường.

## Cần anh/chị kiểm tra kỹ
- FAQ **"Việc thiết lập LeTRON mất bao lâu?"**: chưa có số liệu thật nên câu trả lời đang để chung chung.
- FAQ về tích hợp: liệt kê ERP/SCADA/IoT — xác nhận đúng phạm vi tích hợp thực tế.
- Danh sách ngành hưởng lợi: điều chỉnh theo khách hàng mục tiêu.
