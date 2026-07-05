#!/usr/bin/env node
/**
 * Seed 5 Letron blog articles trực tiếp vào MongoDB.
 * Chạy: node scripts/seed-letron-articles.mjs
 */

import { MongoClient } from "mongodb";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env
const envPath = path.resolve(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf8");
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const [key, ...value] = trimmed.split("=");
  process.env[key.trim()] = value.join("=").trim().replace(/^"|"$/g, "");
});

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri || !dbName) {
  console.error("Missing MONGODB_URI or MONGODB_DB_NAME in .env");
  process.exit(1);
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function readingTime(markdown) {
  const wordCount = markdown.split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / 200));
}

const articles = [
  {
    externalId: crypto.randomUUID(),
    title: "IoT trong quản lý chất thải: Giám sát thời gian thực và tối ưu vận hành",
    slug: "iot-trong-quan-ly-chat-thai-giam-sat-thoi-gian-thuc",
    excerpt:
      "Khám phá cách IoT và cảm biến thông minh giúp doanh nghiệp tài nguyên & môi trường giám sát chất thải theo thời gian thực, giảm thất thoát vận hành lên đến 30%.",
    category: "Công nghệ xanh",
    categorySlug: "cong-nghe-xanh",
    tags: ["IoT", "cảm biến thông minh", "quản lý chất thải", "vận hành thông minh", "LeOS"],
    seoTitle: "IoT trong quản lý chất thải: Giám sát thời gian thực | LeOS",
    seoDescription:
      "IoT và cảm biến thông minh đang thay đổi cách doanh nghiệp quản lý chất thải. Tìm hiểu giải pháp giám sát thời gian thực từ LeOS.",
    contentMarkdown: `# IoT trong quản lý chất thải: Giám sát thời gian thực và tối ưu vận hành

## Nỗi đau: "Tôi không biết chất thải của mình đang ở đâu"

Hóa đơn xử lý chất thải mỗi tháng một tăng. Xe thu gom đến không đúng lịch. Khối lượng chất thải phát sinh vượt xa dự tính. Đây là thực tế quen thuộc của nhiều doanh nghiệp sản xuất, khu công nghiệp và nhà máy chế biến tại Việt Nam.

Vấn đề không phải là thiếu quy trình — mà là **không nhìn thấy được dòng chảy chất thải** trong thời gian thực.

## Vấn đề thực sự: Thông tin bị trễ

Hầu hết doanh nghiệp hiện nay vẫn ghi nhận dữ liệu chất thải bằng giấy tờ hoặc bảng tính Excel, cập nhật theo tuần hoặc theo tháng. Khi một container chất thải đầy, phải mất vài giờ đến vài ngày để đội vận hành biết và điều phối xe thu gom.

Sự chậm trễ này dẫn đến:
- **Tắc nghẽn tồn trữ**: Chất thải tồn đọng quá lâu, gây mùi và vi phạm vệ sinh
- **Chi phí phát sinh**: Xe thu gom phải chạy thêm chuyến không cần thiết
- **Rủi ro môi trường**: Rò rỉ, phát tán chất thải ra ngoài khu vực lưu trữ
- **Mất dữ liệu**: Không có cơ sở để tối ưu hóa quy trình về sau

## Đảo ngược niềm tin: Chất thải là tài nguyên — nếu bạn đo lường được nó

Theo mô hình **Waste Value Curve (MM-01)**, giá trị của chất thải thay đổi theo vị trí trong chuỗi xử lý. Ở điểm phát sinh, chất thải có giá trị âm (bạn phải trả tiền để xử lý). Nhưng ở điểm phân loại và tái chế, nó có thể trở thành tài nguyên có giá trị dương.

Chìa khóa để di chuyển trên đường cong này là **dữ liệu thời gian thực**. Khi bạn biết chính xác khối lượng, thành phần và vị trí của chất thải tại mọi thời điểm, bạn có thể đưa ra quyết định tối ưu.

## Mô hình: Operational Leakage (MM-02)

Thất thoát vận hành đến từ điểm giao giữa con người và hệ thống. Trong quản lý chất thải, điều này thể hiện qua 3 dạng:

1. **Thất thoát thông tin**: Không biết khi nào thùng chứa đầy
2. **Thất thoát thời gian**: Chờ đợi, điều phối thủ công
3. **Thất thoát tài nguyên**: Chất thải có thể tái chế bị trộn lẫn và đem chôn lấp

IoT giải quyết cả ba loại thất thoát này bằng cách tự động hóa thu thập dữ liệu từ khâu phát sinh đến khâu xử lý cuối cùng.

## Tác động kinh doanh

Theo khảo sát từ các dự án triển khai IoT trong quản lý chất thải tại khu vực Đông Nam Á:

| Chỉ số | Cải thiện |
|:-------|:----------|
| Chi phí thu gom | Giảm 25–35% |
| Thời gian phản ứng | Từ vài giờ xuống còn vài phút |
| Tỷ lệ tái chế | Tăng 15–20% |
| Sai sót dữ liệu | Giảm 90% |
| Vi phạm môi trường | Giảm 80% |

## Giải pháp từ LeOS

**LeOS Platform** tích hợp IoT sensing layer với AI analytics để cung cấp giải pháp quản lý chất thải toàn diện:

- **Cảm biến mức đầy** gắn trên thùng chứa, gửi tín hiệu khi đạt ngưỡng
- **Dashboard thời gian thực** hiển thị toàn bộ dòng chảy chất thải trên một màn hình
- **AI dự báo** khối lượng phát sinh theo mùa vụ, lịch sản xuất
- **Tự động điều phối** xe thu gom dựa trên mức độ ưu tiên và lộ trình tối ưu

👉 Tìm hiểu thêm về [LeOS Platform](/san-pham) và đặt lịch tư vấn demo.`,
    coverImage: "https://letron-blog-content-dev.s3.ap-southeast-1.amazonaws.com/media/blog/placeholder-iot-waste.webp",
    canonicalUrl: "https://linkstrategy.io.vn/blog/iot-trong-quan-ly-chat-thai-giam-sat-thoi-gian-thuc",
    authorName: "LeOS Team",
    publishedAt: new Date("2026-07-06T08:00:00Z"),
    noindex: false,
  },
  {
    externalId: crypto.randomUUID(),
    title: "Kinh tế tuần hoàn trong ngành vật liệu xây dựng: Cơ hội và thách thức",
    slug: "kinh-te-tuan-hoan-nganh-vat-lieu-xay-dung",
    excerpt:
      "Ngành vật liệu xây dựng đang đứng trước áp lực chuyển đổi sang mô hình kinh tế tuần hoàn. Cơ hội tiết kiệm chi phí và giảm phát thải là rất lớn — nhưng thách thức về công nghệ và vận hành cần được giải quyết.",
    category: "Vật liệu xanh",
    categorySlug: "vat-lieu-xanh",
    tags: ["kinh tế tuần hoàn", "vật liệu xây dựng xanh", "chuyển hóa chất thải", "bền vững", "LeOS"],
    seoTitle: "Kinh tế tuần hoàn trong ngành vật liệu xây dựng | LeOS",
    seoDescription:
      "Cơ hội và thách thức khi áp dụng kinh tế tuần hoàn trong ngành vật liệu xây dựng. Giải pháp chuyển hóa chất thải thành tài nguyên từ LeOS.",
    contentMarkdown: `# Kinh tế tuần hoàn trong ngành vật liệu xây dựng: Cơ hội và thách thức

## Thực trạng: Một ngành "thẳng" trong thế giới "tròn"

Ngành vật liệu xây dựng là một trong những ngành tiêu tốn nhiều tài nguyên nhất: hơn 50% tổng lượng nguyên liệu thô khai thác trên toàn cầu được dùng cho xây dựng. Mô hình kinh tế tuyến tính truyền thống — "khai thác → sản xuất → sử dụng → thải bỏ" — đang tạo ra áp lực khổng lồ lên môi trường.

Tại Việt Nam, mỗi năm có khoảng 12 triệu tấn chất thải xây dựng phát sinh, nhưng tỷ lệ tái chế chỉ đạt dưới 15%.

## Vấn đề thực sự: Chi phí ẩn của chất thải

Hầu hết doanh nghiệp vật liệu xây dựng chỉ nhìn thấy chi phí xử lý chất thải trực tiếp — tiền thuê xe, phí chôn lấp. Nhưng chi phí ẩn mới là phần lớn:

- **Chi phí nguyên liệu thô**: Giá cát, đá, sỏi tăng liên tục do khan hiếm
- **Chi phí năng lượng**: Sản xuất từ nguyên liệu thô tốn nhiều năng lượng hơn tái chế
- **Chi phí tuân thủ**: Phí phát thải, phí môi trường ngày càng tăng
- **Rủi ro danh tiếng**: Nhà đầu tư và khách hàng quay lưng với sản phẩm không bền vững

## Đảo ngược niềm tin: Chất thải xây dựng là mỏ tài nguyên đô thị

Theo **Green ROI (MM-04)**, lợi nhuận từ chuyển đổi xanh đến từ chi phí thấp hơn và tài nguyên tuần hoàn. Một tấn bê tông phế thải, nếu được nghiền và sàng lọc đúng cách, có thể trở thành cốt liệu tái chế có giá trị bằng 60–80% cốt liệu tự nhiên — với chi phí sản xuất thấp hơn 30–40%.

## Cơ hội cụ thể

### 1. Tro bay và xỉ than — Từ phế thải thành phụ gia xi măng

Nhiệt điện than thải ra hàng triệu tấn tro bay mỗi năm. Công nghệ xử lý và tuyển nổi cho phép biến tro bay thành phụ gia xi măng đạt tiêu chuẩn TCVN, giảm 20% lượng clinker — đồng nghĩa với giảm 20% phát thải CO₂.

### 2. Phế thải nhựa — Cốt liệu nhẹ cho bê tông

Nghiên cứu từ các trường đại học cho thấy thay thế 10–15% cốt liệu bằng nhựa tái chế có thể tạo ra bê tông nhẹ hơn 15–20% mà vẫn đảm bảo cường độ chịu lực.

### 3. Bùn thải công nghiệp — Nguyên liệu cho gạch không nung

Bùn thải từ nhà máy giấy, nhà máy bia, khu công nghiệp chế biến thủy sản có thể được xử lý và ép thành gạch không nung — vừa giải quyết bài toán xử lý bùn, vừa tạo ra sản phẩm xây dựng giá rẻ.

## Thách thức cần vượt qua

| Thách thức | Mức độ | Giải pháp |
|:-----------|:-------|:----------|
| Công nghệ xử lý | Cao | Đầu tư dây chuyền nghiền, sàng, tuyển nổi tự động |
| Tiêu chuẩn kỹ thuật | Trung bình | Phối hợp với viện nghiên cứu để chứng nhận |
| Chi phí logistics | Cao | Tối ưu chuỗi cung ứng, xử lý tại chỗ |
| Nhận thức thị trường | Thấp | Truyền thông, chứng chỉ xanh cho công trình |

## LeOS đồng hành cùng doanh nghiệp

**LeOS Platform** cung cấp nền tảng quản lý vận hành cho các nhà máy chuyển hóa chất thải thành vật liệu xây dựng:

- **Quản lý đầu vào**: Theo dõi nguồn chất thải, khối lượng, thành phần
- **Tối ưu sản xuất**: AI điều chỉnh thông số dây chuyền theo chất lượng nguyên liệu
- **Truy xuất nguồn gốc**: Mỗi viên gạch, mỗi tấn cốt liệu đều có mã định danh
- **Báo cáo ESG**: Tự động tính toán lượng CO₂ tiết kiệm, khối lượng tái chế

👉 Khám phá giải pháp LeOS cho ngành vật liệu xây dựng tại [letron.vn](/san-pham).`,
    coverImage: "https://letron-blog-content-dev.s3.ap-southeast-1.amazonaws.com/media/blog/placeholder-circular-economy.webp",
    canonicalUrl: "https://linkstrategy.io.vn/blog/kinh-te-tuan-hoan-nganh-vat-lieu-xay-dung",
    authorName: "LeOS Team",
    publishedAt: new Date("2026-07-07T08:00:00Z"),
    noindex: false,
  },
  {
    externalId: crypto.randomUUID(),
    title: "ESG và doanh nghiệp tài nguyên: Làm thế nào để bắt đầu?",
    slug: "esg-doanh-nghiep-tai-nguyen-bat-dau",
    excerpt:
      "ESG không còn là lựa chọn — đã trở thành yêu cầu bắt buộc đối với doanh nghiệp tài nguyên và môi trường. Bài viết này hướng dẫn lộ trình 5 bước để bắt đầu hành trình ESG một cách thực tế và hiệu quả.",
    category: "ESG & Compliance",
    categorySlug: "esg-compliance",
    tags: ["ESG", "bền vững", "tuân thủ môi trường", "báo cáo phát thải", "LeOS"],
    seoTitle: "ESG cho doanh nghiệp tài nguyên: Lộ trình 5 bước | LeOS",
    seoDescription:
      "Hướng dẫn doanh nghiệp tài nguyên và môi trường bắt đầu hành trình ESG với lộ trình thực tế 5 bước. Giải pháp báo cáo ESG từ LeOS.",
    contentMarkdown: `# ESG và doanh nghiệp tài nguyên: Làm thế nào để bắt đầu?

## Áp lực từ nhiều phía

Năm 2026 đánh dấu một bước ngoặt: các doanh nghiệp xuất khẩu sang EU buộc phải có báo cáo ESG tuân thủ CSRD (Corporate Sustainability Reporting Directive). Các ngân hàng trong nước bắt đầu xếp hạng tín dụng xanh dựa trên điểm ESG. Nhà đầu tư tổ chức yêu cầu minh bạch dữ liệu phát thải.

Với doanh nghiệp tài nguyên và môi trường — nơi hoạt động sản xuất có tác động môi trường trực tiếp — ESG không còn là "nice-to-have" nữa. Đó là yêu cầu sống còn.

## Vấn đề thực sự: Không biết bắt đầu từ đâu

Khảo sát của PwC (2025) cho thấy 78% doanh nghiệp vừa và nhỏ tại Việt Nam chưa có lộ trình ESG rõ ràng. Lý do phổ biến:

- "ESG là khái niệm mơ hồ, không biết đo lường thế nào"
- "Nhân sự môi trường không đủ năng lực làm báo cáo"
- "Chi phí thuê tư vấn ESG quá cao"
- "Không có hệ thống thu thập dữ liệu phát thải"

## Đảo ngược niềm tin: ESG không phải một dự án — là một hệ thống vận hành

Theo mô hình **ESG Flywheel (MM-05)**: ESG tốt → thu hút đầu tư xanh → tối ưu vận hành → giảm chi phí → ESG tốt hơn. Đây là vòng lặp tích lũy, không phải báo cáo một lần.

## Lộ trình 5 bước cho doanh nghiệp tài nguyên

### Bước 1: Xác định trọng tâm — Đừng làm tất cả cùng lúc

Với doanh nghiệp tài nguyên, không phải tất cả các khía cạnh ESG đều quan trọng như nhau. Hãy tập trung vào:

- **E (Environment)**: Phát thải khí nhà kính (Scope 1 & 2), quản lý chất thải, sử dụng nước
- **S (Social)**: An toàn lao động, quan hệ cộng đồng địa phương
- **G (Governance):** Minh bạch báo cáo, chống tham nhũng

**Khuyến nghị:** Năm đầu tiên, chỉ tập trung vào Environmental — đây là nơi tác động lớn nhất và dễ đo lường nhất.

### Bước 2: Thiết lập hệ thống thu thập dữ liệu

Không thể quản lý thứ không đo lường được (TH-04). Xây dựng hệ thống thu thập dữ liệu phát thải cơ bản:

1. **Sử dụng điện**: Đọc hóa đơn điện hàng tháng
2. **Nhiên liệu hóa thạch**: Ghi nhận lượng xăng dầu, gas tiêu thụ
3. **Chất thải**: Cân khối lượng chất thải phát sinh và xử lý

> Dữ liệu thô còn tốt hơn không có dữ liệu. Đừng để "sự hoàn hảo" cản trở sự tiến bộ.

### Bước 3: Tính toán baseline phát thải

Sử dụng công cụ tính toán carbon footprint đơn giản (GHG Protocol) với:

$$\\text{CO₂e} = \\text{Dữ liệu hoạt động} \\times \\text{Hệ số phát thải}$$

Ví dụ:
- 10,000 kWh điện × 0.6767 kg CO₂/kWh = 6,767 kg CO₂e
- 1,000 lít dầu DO × 2.65 kg CO₂/lít = 2,650 kg CO₂e

### Bước 4: Xác định cơ hội cắt giảm

Phân tích baseline để tìm "low-hanging fruit":

| Khoản mục | Tỷ trọng | Giải pháp cắt giảm | Tiết kiệm dự kiến |
|:----------|:---------|:-------------------|:-----------------|
| Điện năng | 45% | Biến tần, đèn LED, năng lượng mặt trời | 20–30% |
| Nhiên liệu | 35% | Chuyển đổi xe điện, tối ưu lộ trình | 15–25% |
| Xử lý chất thải | 20% | Phân loại tại nguồn, tái chế | 30–50% |

### Bước 5: Lập kế hoạch cải thiện và báo cáo

Xây dựng lộ trình 3 năm với các mục tiêu cụ thể:
- **Năm 1**: Hoàn thành baseline, cắt giảm 10% phát thải
- **Năm 2**: Triển khai năng lượng tái tạo, cắt giảm 20%
- **Năm 3**: Hướng tới trung hòa carbon (Net Zero) cho Scope 1 & 2

## Vai trò của công nghệ

Giải pháp ESG manual với Excel và email sẽ không thể scale. Khi số lượng nhà máy và chỉ số tăng lên, bạn cần một nền tảng:

- **LeOS ESG Module** — Tự động thu thập dữ liệu từ IoT sensors
- **AI Analytics** — Phát hiện bất thường, đề xuất cải thiện
- **Templates báo cáo** — Tuân thủ GRI, CSRD, TCFD
- **Dashboard real-time** — Board of Directors có thể xem bất cứ lúc nào

👉 Đăng ký tư vấn ESG tại [letron.vn/lien-he](/lien-he) để nhận lộ trình cá nhân hóa cho doanh nghiệp của bạn.`,
    coverImage: "https://letron-blog-content-dev.s3.ap-southeast-1.amazonaws.com/media/blog/placeholder-esg.webp",
    canonicalUrl: "https://linkstrategy.io.vn/blog/esg-doanh-nghiep-tai-nguyen-bat-dau",
    authorName: "LeOS Team",
    publishedAt: new Date("2026-07-08T08:00:00Z"),
    noindex: false,
  },
  {
    externalId: crypto.randomUUID(),
    title: "Chuyển đổi số trong ngành môi trường: Từ dữ liệu đến quyết định",
    slug: "chuyen-doi-so-nganh-moi-tuong-du-lieu-den-quyet-dinh",
    excerpt:
      "Chuyển đổi số trong ngành môi trường không phải là số hóa giấy tờ. Đó là xây dựng một hệ thống vận hành nơi dữ liệu được thu thập tự động, phân tích thông minh và hỗ trợ ra quyết định theo thời gian thực.",
    category: "Chuyển đổi số",
    categorySlug: "chuyen-doi-so",
    tags: ["chuyển đổi số", "ngành môi trường", "dữ liệu vận hành", "AI", "LeOS", "IoT"],
    seoTitle: "Chuyển đổi số ngành môi trường: Từ dữ liệu đến quyết định | LeOS",
    seoDescription:
      "Lộ trình chuyển đổi số cho doanh nghiệp ngành môi trường: từ thu thập dữ liệu tự động đến ra quyết định thông minh với AI.",
    contentMarkdown: `# Chuyển đổi số trong ngành môi trường: Từ dữ liệu đến quyết định

## Hiểu đúng về chuyển đổi số

Nhiều doanh nghiệp môi trường nghĩ chuyển đổi số là "chuyển từ sổ sách giấy sang Excel" hoặc "lắp camera giám sát". Đó là **số hóa** (digitization), không phải chuyển đổi số (digital transformation).

Chuyển đổi số thực sự là khi dữ liệu vận hành được tự động thu thập, xử lý và phân tích để đưa ra quyết định tốt hơn — nhanh hơn — chính xác hơn.

## Vấn đề thực sự: Không thiếu dữ liệu — thiếu hệ thống

Vòng đời xử lý chất thải của một nhà máy trung bình tạo ra hàng trăm điểm dữ liệu mỗi ngày: khối lượng đầu vào, thông số máy móc, nhiệt độ lò đốt, độ ẩm bùn thải, lịch trình xe thu gom, kết quả kiểm tra môi trường...

Nhưng những dữ liệu này nằm rải rác ở:
- Sổ ghi chép tay của công nhân vận hành
- File Excel của kỹ thuật viên
- Email báo cáo gửi cuối tuần
- Cảm biến không kết nối mạng

Kết quả: Lãnh đạo nhìn vào dashboard thấy số liệu đã cũ từ 3 ngày trước, và không thể đưa ra quyết định kịp thời.

## Đảo ngược niềm tin: Hệ thống trước — công nghệ sau

Theo thesis **System over Technology (TH-02)**, doanh nghiệp không thiếu công nghệ — thiếu hệ thống vận hành. Trước khi mua cảm biến hay phần mềm, hãy trả lời 3 câu hỏi:

1. **Dữ liệu nào quan trọng nhất** cho hoạt động của tôi?
2. **Ai cần dữ liệu đó**, và khi nào?
3. **Quyết định gì** sẽ được đưa ra dựa trên dữ liệu đó?

## Kiến trúc chuyển đổi số 3 lớp

### Lớp 1: Thu thập (Sensing Layer)

Cảm biến và thiết bị IoT tự động ghi nhận:

- Cân điện tử kết nối mạng cho khối lượng chất thải
- Cảm biến nhiệt, áp suất, độ ẩm trên dây chuyền xử lý
- GPS tracking cho đội xe thu gom
- Camera AI nhận diện thành phần chất thải

### Lớp 2: Xử lý (Integration Layer)

Dữ liệu từ nhiều nguồn được tập trung và chuẩn hóa:

| Nguồn dữ liệu | Giao thức | Tần suất |
|:-------------|:----------|:---------|
| Cảm biến IoT | MQTT/HTTP | Real-time |
| Cân điện tử | Serial/TCP | Mỗi lần cân |
| GPS | API | 30 giây/lần |
| Nhập tay | Mobile app | Theo ca |

### Lớp 3: Phân tích & Quyết định (Intelligence Layer)

AI và dashboard biến dữ liệu thành quyết định:

- **AI dự báo** khối lượng chất thải 7 ngày tới
- **Cảnh báo sớm** khi thông số vượt ngưỡng
- **Đề xuất tối ưu** lịch trình thu gom, vận hành
- **Báo cáo tự động** cho cơ quan quản lý

## 3 lợi ích thấy ngay trong 3 tháng đầu

### 1. Giảm thời gian báo cáo 80%

Thay vì 2 ngày cuối tháng để tổng hợp số liệu, hệ thống tự động xuất báo cáo với 1 cú click. Nhân sự tập trung vào phân tích thay vì gõ số.

### 2. Phát hiện bất thường sớm 24h

Cảm biến nhiệt độ lò đốt tăng bất thường → hệ thống gửi cảnh báo ngay lập tức qua Zalo/SMS → kỹ thuật viên can thiệp kịp thời → tránh hỏng thiết bị.

### 3. Tối ưu chi phí thu gom

AI phân tích lịch sử đầy thùng và đề xuất lộ trình thu gom thông minh, cắt giảm 25% số chuyến xe không cần thiết.

## Bắt đầu từ đâu?

Đừng chọn một "siêu dự án" kéo dài 2 năm. Hãy bắt đầu với:

1. Chọn một quy trình cụ thể (ví dụ: quản lý xe thu gom)
2. Gắn cảm biến và theo dõi trong 30 ngày
3. Phân tích dữ liệu và tối ưu
4. Mở rộng sang quy trình tiếp theo

👉 LeOS cung cấp nền tảng tích hợp sẵn 3 lớp — triển khai trong 4 tuần. [Tìm hiểu thêm](/san-pham).`,
    coverImage: "https://letron-blog-content-dev.s3.ap-southeast-1.amazonaws.com/media/blog/placeholder-digital-transformation.webp",
    canonicalUrl: "https://linkstrategy.io.vn/blog/chuyen-doi-so-nganh-moi-tuong-du-lieu-den-quyet-dinh",
    authorName: "LeOS Team",
    publishedAt: new Date("2026-07-09T08:00:00Z"),
    noindex: false,
  },
  {
    externalId: crypto.randomUUID(),
    title: "Tối ưu hóa vận hành nhà máy xử lý chất thải với AI",
    slug: "toi-uu-van-hanh-nha-may-xu-ly-chat-thai-ai",
    excerpt:
      "AI đang thay đổi cách vận hành nhà máy xử lý chất thải: từ bảo trì dự đoán, tối ưu năng lượng đến kiểm soát chất lượng tự động. Tìm hiểu các ứng dụng thực tế và lợi ích cụ thể.",
    category: "Vận hành & Tự động hóa",
    categorySlug: "van-hanh-tu-dong-hoa",
    tags: ["AI", "vận hành nhà máy", "xử lý chất thải", "bảo trì dự đoán", "tối ưu năng lượng", "LeOS"],
    seoTitle: "Tối ưu hóa vận hành nhà máy xử lý chất thải với AI | LeOS",
    seoDescription:
      "AI đang cách mạng hóa vận hành nhà máy xử lý chất thải: bảo trì dự đoán, tối ưu năng lượng, kiểm soát chất lượng. Giải pháp từ LeOS.",
    contentMarkdown: `# Tối ưu hóa vận hành nhà máy xử lý chất thải với AI

## Nỗi đau: Chi phí vận hành vượt kiểm soát

Vận hành một nhà máy xử lý chất thải (đốt rác, ủ compost, tái chế) là bài toán phức tạp. Áp lực lên ban điều hành là rất lớn:

- **Năng lượng** chiếm 40–50% chi phí vận hành
- **Bảo trì đột xuất** gây dừng máy, mất doanh thu
- **Chất lượng đầu ra** không ổn định, bị khách hàng từ chối
- **Nhân công** khó tuyển, khó giữ

## Vấn đề thực sự: Vận hành theo cảm tính

Nhiều nhà máy vận hành dựa trên kinh nghiệm của kỹ thuật viên — không có dữ liệu, không có hệ thống. Khi kỹ thuật viên giàu kinh nghiệm nghỉ việc, hiệu suất nhà máy giảm rõ rệt.

Theo **Technology Absorption (MM-03)**, công nghệ chỉ có giá trị khi được hấp thụ vào quy trình thực tế. Không phải AI thay thế con người — AI hỗ trợ con người ra quyết định tốt hơn.

## 4 ứng dụng AI thực tế trong nhà máy xử lý chất thải

### 1. Bảo trì dự đoán (Predictive Maintenance)

**Vấn đề:** Thiết bị hỏng đột xuất gây dừng dây chuyền 6–12 giờ, thiệt hại hàng trăm triệu đồng mỗi lần.

**Giải pháp:** AI phân tích dữ liệu rung động, nhiệt độ, dòng điện từ cảm biến gắn trên thiết bị:

- Phát hiện dấu hiệu bất thường trước khi hỏng 7–14 ngày
- Đề xuất lịch bảo trì tối ưu — không quá sớm (lãng phí) và không quá muộn (hỏng hóc)
- Tự động đặt lịch bảo trì vào giờ thấp điểm

> **Kết quả:** Giảm 60% thời gian dừng máy ngoài kế hoạch, tiết kiệm 30% chi phí bảo trì.

### 2. Tối ưu năng lượng (Energy Optimization)

**Vấn đề:** Lò đốt, máy nghiền, băng tải tiêu thụ điện không đều theo từng ca, khó xác định điểm lãng phí.

**Giải pháp:** AI học mô hình tiêu thụ năng lượng theo sản lượng và điều kiện vận hành:

| Thông số | Trước AI | Sau AI | Cải thiện |
|:---------|:---------|:-------|:----------|
| Điện năng/tấn rác | 85 kWh | 62 kWh | -27% |
| Biến thiên nhiệt độ lò | ±45°C | ±12°C | -73% |
| Dầu đốt phụ trợ | 15 lít/tấn | 8 lít/tấn | -47% |

### 3. Kiểm soát chất lượng tự động (Quality Control)

**Vấn đề:** Phân loại rác đầu vào không đồng đều, ảnh hưởng đến chất lượng compost hoặc nhiệt trị.

**Giải pháp:** Camera AI kết hợp computer vision:

- Nhận diện thành phần rác trên băng tải trong 0.2 giây
- Phân loại theo 12 chủng loại: hữu cơ, nhựa, kim loại, thủy tinh...
- Điều chỉnh tự động tốc độ và hướng phân loại

> **Kết quả:** Độ chính xác phân loại đạt 95%, tăng tỷ lệ tái chế thêm 25%.

### 4. Tối ưu chuỗi cung ứng (Supply Chain AI)

**Vấn đề:** Xe thu gom đến không đều — khi thì quá tải, khi thì thiếu nguyên liệu.

**Giải pháp:** AI phân tích lịch sử thu gom, thời tiết, mùa vụ để dự báo khối lượng:

- Lập lịch thu gom động theo nhu cầu thực tế
- Điều phối xe theo real-time data từ GPS và cảm biến thùng
- Cân bằng công suất giữa các dây chuyền xử lý

## Lộ trình triển khai

### Giai đoạn 1: Nền tảng — 4 tuần

- Lắp đặt cảm biến IoT trên thiết bị chính (motor, băng tải, lò)
- Kết nối SCADA/DCS hiện có lên LeOS Platform
- Xây dựng dashboard vận hành cơ bản

### Giai đoạn 2: AI cơ bản — 8 tuần

- Train mô hình bảo trì dự đoán (Predictive Maintenance)
- Baseline năng lượng và tối ưu cơ bản
- Cảnh báo tự động qua Zalo/Email

### Giai đoạn 3: AI nâng cao — 12 tuần

- Computer vision cho phân loại rác
- AI tối ưu toàn diện (năng lượng + bảo trì + chuỗi cung ứng)
- Báo cáo ESG tự động

## Tác động kinh doanh tổng thể

| KPI | Trước | Sau 6 tháng |
|:----|:-----|:-----------|
| OEE (Overall Equipment Effectiveness) | 62% | 82% |
| Chi phí năng lượng/tấn | Giảm 50% |
| Dừng máy đột xuất | 8 giờ/tháng | 2 giờ/tháng |
| ROI | — | 3.2x trong 12 tháng |

## LeOS AI Operations Platform

LeOS tích hợp sẵn tất cả 4 ứng dụng AI trên vào một nền tảng duy nhất — không cần tích hợp nhiều vendor, không cần đội ngũ data science riêng.

👉 [Đặt lịch demo](/lien-he) để xem trực tiếp LeOS AI vận hành trên dữ liệu thực tế của nhà máy.`,
    coverImage: "https://letron-blog-content-dev.s3.ap-southeast-1.amazonaws.com/media/blog/placeholder-ai-waste.webp",
    canonicalUrl: "https://linkstrategy.io.vn/blog/toi-uu-van-hanh-nha-may-xu-ly-chat-thai-ai",
    authorName: "LeOS Team",
    publishedAt: new Date("2026-07-10T08:00:00Z"),
    noindex: false,
  },
];

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("articles");

    // Kiểm tra slug trùng
    const slugs = articles.map((a) => a.slug);
    const existing = await collection
      .find({ slug: { $in: slugs } })
      .project({ slug: 1 })
      .toArray();
    const existingSlugs = new Set(existing.map((e) => e.slug));
    const conflicts = slugs.filter((s) => existingSlugs.has(s));

    if (conflicts.length > 0) {
      console.warn(`⚠️ Slug conflicts found: ${conflicts.join(", ")}`);
      console.warn("❌ Aborting. Resolve conflicts before re-running.");
      process.exit(1);
    }

    const now = new Date();
    let inserted = 0;

    for (const article of articles) {
      const doc = {
        externalId: article.externalId,
        slug: article.slug,
        previousSlug: null,
        title: article.title,
        excerpt: article.excerpt,
        contentMarkdown: article.contentMarkdown,
        status: "published",
        authorName: article.authorName,
        category: article.category,
        categorySlug: article.categorySlug,
        tags: article.tags,
        publishedAt: article.publishedAt,
        updatedAt: now,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        coverImage: article.coverImage,
        canonicalUrl: article.canonicalUrl,
        noindex: article.noindex,
        readingTimeMinutes: readingTime(article.contentMarkdown),
        createdAt: now,
      };

      await collection.insertOne(doc);
      inserted++;
      console.log(`✅ [${inserted}/5] Inserted: ${doc.slug}`);
    }

    console.log(`\n🎉 Successfully inserted ${inserted} articles!`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("❌ Fatal error:", err.message);
  process.exit(1);
});
