---
trigger: on_demand
description: Secret and dependency safety policy for Link Strategy Satellite work.
---

# LS-RULE-SECRET-MANAGEMENT

Quy tắc này bảo vệ secret, credential và dependency surface trong Satellite.

## 1. No Secrets In Git

- Không commit API key, password, database URI, token, private key, certificate thật.
- Không commit `.env`, `.env.local`, `.env.production`, `.pem`, `.p12`, `.pfx`, `.key`.
- `.env.example` chỉ chứa key name và dummy/empty value.
- Nếu phát hiện secret đã lộ, phải xóa khỏi code, revoke key và ghi sự cố vào `03_LOGS.md`.

## 2. Environment Isolation

- Hands/Freelancer không có production access.
- Dùng mock, sandbox hoặc dummy config trong local development.
- Không đưa production credential vào test fixture.

## 3. Node Package / Dependency Policy

Hands Agent được thêm dependency khi cần cho implementation, nhưng phải tuân thủ:

- Không xóa hoặc đổi `verify-gate`, `ls-gitpush` trong `package.json`.
- Không thêm Brain-only scripts vào Satellite.
- Không thêm lifecycle scripts nguy hiểm như `preinstall`, `install`, `postinstall`, `prepare` nếu không được Spec/Brain cho phép.
- Không thêm dependency không rõ mục đích; nếu dependency ảnh hưởng kiến trúc hoặc security, ghi lý do vào `02_DECISION_LOGS.md`.
- Lockfile được phép commit nếu nó phản ánh dependency hợp lệ của project.

## 4. Phase 1 Gate Review

Phase 1 gate có secret scan cơ bản. Nếu fail, Hands Agent phải sửa trong phạm vi project files; không sửa gate để né scan.

Full SAST/dependency scan thuộc Phase 2+ hoặc Brain review, trừ khi Spec yêu cầu rõ.

---
**Status:** ACTIVE SECURITY RULE  
**Priority:** LEVEL 1
