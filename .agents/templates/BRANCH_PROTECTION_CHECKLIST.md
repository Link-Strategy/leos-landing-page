# ADVANCED GITHUB HARDENING CHECKLIST (OPTIONAL)

Tài liệu này chỉ dùng khi Brain muốn nâng cấp Satellite repo lên mô hình PR/protected branch. Đây **không phải** yêu cầu Phase 1.

Trong lifecycle mặc định hiện tại:

- Brain Project chỉ harvest các mapping trong `slicing-profile.json` từ Satellite commit đã PASS gate.
- Satellite `main` là execution lane của Hands.
- Hands nộp bài bằng `npm run ls-gitpush`, tool push lên `origin/main`; GitHub Actions xác minh receipt/hash và Brain chỉ harvest commit đã PASS.
- GitHub Actions chạy trên push vào `main`.
- Brain chỉ harvest commit có `verification-gate` success.

## Optional Branch Protection

- [ ] Require a pull request before merging.
- [ ] Require status checks to pass before merging.
- [ ] Required check: `verification-gate (ubuntu-latest)` from `.github/workflows/link-strategy-ci.yml`.
- [ ] Required check: `verification-gate (windows-latest)` from `.github/workflows/link-strategy-ci.yml`.
- [ ] Required check: `verification-gate (macos-latest)` from `.github/workflows/link-strategy-ci.yml`.
- [ ] Governance path protection remains enabled inside `.github/workflows/link-strategy-ci.yml`.
- [ ] Optional hardening: restrict direct pushes nếu plan GitHub hỗ trợ. Nếu không, Brain harvest vẫn chặn commit fail qua CI status.

## Permissions

- [ ] Hands/Freelancers only have `Read` or `Write` access.
- [ ] Hands/Freelancers do not have `Maintain` or `Admin`.
- [ ] Bots use least-privilege permissions.

---
**Status:** OPTIONAL HARDENING TEMPLATE  
**Owner:** Brain Delegate
