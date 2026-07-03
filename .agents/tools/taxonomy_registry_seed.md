## taxonomy_registry seed

Nguồn chuẩn của collection `taxonomy_registry` là:
- `.docs/strategy/03-Content Strategy Reference.md` cho `TH-*`, `MM-*`, `CL-*`
- `.docs/strategy/02-Marketing Strategy & KPI.md` cho `PL-*`

Mục tiêu của tài liệu này:
- hướng dẫn nạp dữ liệu chuẩn vào MongoDB thủ công
- tạo read model cho `internal_validate_references`
- làm nền trước khi dựng tiếp `save_brief` và các tool khóa taxonomy

## 1. Khi nào cần làm bước này

Bạn nên seed `taxonomy_registry` trước khi:
- nâng `internal_validate_references` từ format-check lên existence-check
- dựng `save_brief`
- cho agent hoặc workflow bắt đầu khóa taxonomy thật vào record

Bạn chưa cần bước này nếu:
- mới chỉ test `save_idea` ở mức regex format
- chưa dùng taxonomy như dữ liệu chuẩn để quyết định lưu record

## 2. Collection contract

Contract này bám theo `Agent/Agent.md`, mục `taxonomy_registry`.

Mỗi document trong `taxonomy_registry` có dạng:

```json
{
  "_id": "TH-01",
  "code": "TH-01",
  "type": "thesis",
  "label": "Tên hiển thị của taxonomy",
  "owner_doc": ".docs/strategy/03-Content Strategy Reference.md",
  "owner_doc_id": "DOC-03",
  "status": "active",
  "effective_date": "2026-03-08T00:00:00.000Z"
}
```

Các giá trị hợp lệ:
- `type`: `thesis | mental_model | cluster | goal`
- `status`: `active | deprecated | draft`

Quy ước:
- `_id` trùng với `code`
- `code` là mã chuẩn như `TH-01`, `MM-01`, `CL-01`, `PL-01`
- `label` là tên người đọc và agent sẽ nhìn thấy
- `owner_doc` là file sở hữu định nghĩa chuẩn
- `owner_doc_id` lấy từ `.docs/_registry.yaml`
- `effective_date` nên dùng ngày hiệu lực của owner doc, không dùng ngày insert

## 3. Map từ prefix sang owner doc

Map chuẩn từ các tài liệu chiến lược:

| Prefix | type | owner_doc | owner_doc_id |
| --- | --- | --- | --- |
| `TH` | `thesis` | `.docs/strategy/03-Content Strategy Reference.md` | `DOC-03` |
| `MM` | `mental_model` | `.docs/strategy/03-Content Strategy Reference.md` | `DOC-03` |
| `CL` | `cluster` | `.docs/strategy/03-Content Strategy Reference.md` | `DOC-03` |
| `PL` | `goal` | `.docs/strategy/02-Marketing Strategy & KPI.md` | `DOC-02` |

Ngày hiệu lực hiện tại từ tài liệu:
- `DOC-03`: `2026-03-08`
- `DOC-02`: `2026-03-08`

## 4. Dữ liệu nào cần extract từ docs

Từ owner docs, bạn cần extract tối thiểu:
- `code`
- `label`
- `type`

Bạn không cần extract toàn bộ mô tả dài vào collection này nếu mục tiêu hiện tại chỉ là validation.

Tức là mỗi taxonomy entry chỉ cần đủ để:
- check tồn tại
- hiển thị label
- biết nó thuộc loại gì
- biết ai là owner doc

## 5. Cấu trúc file seed khuyên dùng

Trước khi insert vào Mongo, nên chuẩn bị một file JSON riêng, ví dụ:

`scripts/taxonomy_registry.seed.json`

Mẫu:

```json
[
  {
    "_id": "TH-01",
    "code": "TH-01",
    "type": "thesis",
    "label": "Coordination cost destroys growth before talent becomes the bottleneck",
    "owner_doc": ".docs/strategy/03-Content Strategy Reference.md",
    "owner_doc_id": "DOC-03",
    "status": "active",
    "effective_date": "2026-03-08T00:00:00.000Z"
  },
  {
    "_id": "MM-01",
    "code": "MM-01",
    "type": "mental_model",
    "label": "Coordination Cost",
    "owner_doc": ".docs/strategy/03-Content Strategy Reference.md",
    "owner_doc_id": "DOC-03",
    "status": "active",
    "effective_date": "2026-03-08T00:00:00.000Z"
  },
  {
    "_id": "CL-01",
    "code": "CL-01",
    "type": "cluster",
    "label": "Marketing Operations Bottlenecks",
    "owner_doc": ".docs/strategy/03-Content Strategy Reference.md",
    "owner_doc_id": "DOC-03",
    "status": "active",
    "effective_date": "2026-03-08T00:00:00.000Z"
  },
  {
    "_id": "PL-01",
    "code": "PL-01",
    "type": "goal",
    "label": "Problem Awareness",
    "owner_doc": ".docs/strategy/02-Marketing Strategy & KPI.md",
    "owner_doc_id": "DOC-02",
    "status": "active",
    "effective_date": "2026-03-08T00:00:00.000Z"
  }
]
```

Ghi chú:
- `label` ở trên chỉ là ví dụ
- bạn phải thay bằng label thật lấy từ standard docs

## 6. Cách insert thủ công vào MongoDB

### Cách 1: dùng Mongo shell / mongosh

Nếu đã có file JSON seed:

```javascript
use linkstrategy

db.taxonomy_registry.insertMany([
  {
    _id: "TH-01",
    code: "TH-01",
    type: "thesis",
    label: "Coordination cost destroys growth before talent becomes the bottleneck",
    owner_doc: ".docs/strategy/03-Content Strategy Reference.md",
    owner_doc_id: "DOC-03",
    status: "active",
    effective_date: ISODate("2026-03-08T00:00:00.000Z")
  },
  {
    _id: "MM-01",
    code: "MM-01",
    type: "mental_model",
    label: "Coordination Cost",
    owner_doc: ".docs/strategy/03-Content Strategy Reference.md",
    owner_doc_id: "DOC-03",
    status: "active",
    effective_date: ISODate("2026-03-08T00:00:00.000Z")
  },
  {
    _id: "CL-01",
    code: "CL-01",
    type: "cluster",
    label: "Marketing Operations Bottlenecks",
    owner_doc: ".docs/strategy/03-Content Strategy Reference.md",
    owner_doc_id: "DOC-03",
    status: "active",
    effective_date: ISODate("2026-03-08T00:00:00.000Z")
  },
  {
    _id: "PL-01",
    code: "PL-01",
    type: "goal",
    label: "Problem Awareness",
    owner_doc: ".docs/strategy/02-Marketing Strategy & KPI.md",
    owner_doc_id: "DOC-02",
    status: "active",
    effective_date: ISODate("2026-03-08T00:00:00.000Z")
  }
])
```

### Cách 2: insert tay trên MongoDB Compass

Với mỗi document:
1. mở database `linkstrategy`
2. mở collection `taxonomy_registry`
3. bấm `Add Data`
4. chọn `Insert Document`
5. paste document JSON
6. đổi `effective_date` sang kiểu Date nếu Compass chưa tự nhận

## 7. Index nên tạo ngay

Nên tạo các index đúng theo PRD:

```javascript
db.taxonomy_registry.createIndex({ type: 1 })
db.taxonomy_registry.createIndex({ code: 1 }, { unique: true })
db.taxonomy_registry.createIndex({ status: 1 })
```

Nếu `_id` đã trùng `code`, unique index ở `code` vẫn đáng giữ để query rõ ràng hơn.

## 8. Query kiểm tra sau khi seed

Kiểm tra tổng số lượng:

```javascript
db.taxonomy_registry.countDocuments()
```

Kiểm tra một mã cụ thể:

```javascript
db.taxonomy_registry.findOne({ code: "TH-01" })
```

Kiểm tra theo loại:

```javascript
db.taxonomy_registry.find({ type: "thesis", status: "active" })
```

Kiểm tra các prefix chính:

```javascript
db.taxonomy_registry.find({
  code: { $in: ["TH-01", "MM-01", "CL-01", "PL-01"] }
})
```

## 9. Cách `internal_validate_references` nên dùng collection này

Sau khi đã seed xong, `internal_validate_references` nên nâng cấp theo logic:

1. gom các field taxonomy có mặt trong payload
2. check format
3. query `taxonomy_registry` bằng `code`
4. fail nếu không tìm thấy
5. fail nếu tìm thấy nhưng `status != active`
6. pass nếu tất cả reference hợp lệ

Tối thiểu nên hỗ trợ 2 dạng:

### Dạng nested như `save_idea`

```json
{
  "suggested_taxonomy": {
    "thesis_id": "TH-01",
    "mental_model_id": "MM-01",
    "cluster_id": "CL-01",
    "goal_id": "PL-01"
  }
}
```

### Dạng root như `save_brief`

```json
{
  "thesis_id": "TH-01",
  "mental_model_id": "MM-01",
  "cluster_id": "CL-01",
  "goal_id": "PL-01"
}
```

## 10. Checklist hoàn tất

Bạn có thể coi bước seed hoàn tất khi:
- đã có collection `taxonomy_registry`
- đã insert toàn bộ `TH-*`, `MM-*`, `CL-*`, `PL-*` cần dùng
- `_id` và `code` đều đúng mã chuẩn
- `owner_doc` và `owner_doc_id` map đúng theo tài liệu chiến lược
- `status` được set rõ ràng
- `effective_date` dùng ngày hiệu lực của owner doc
- query `findOne({ code: "TH-01" })` trả đúng document
- sẵn sàng nối `internal_validate_references` vào Mongo để existence-check

## 11. Quyết định thực dụng nên chốt trước khi seed

Có 3 quyết định bạn nên chốt sớm:

1. `label` lưu bằng tiếng Việt hay tiếng Anh
   Khuyến nghị: lưu đúng ngôn ngữ đang dùng trong owner docs

2. có lưu thêm `description` không
   Khuyến nghị: chưa cần, chỉ lưu khi thật sự cần cho reasoning/query

3. có seed toàn bộ taxonomy ngay hay chỉ seed tập đang dùng
   Khuyến nghị: nếu docs đã ổn định, seed toàn bộ một lần

Kết luận thực dụng:
- nếu bạn muốn đi nhanh, hãy seed tối thiểu toàn bộ mã đang có trong docs
- sau đó mới nâng `internal_validate_references`
- rồi mới dựng `save_brief`
