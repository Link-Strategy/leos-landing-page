# PROJECT EXECUTION GUIDE

This workspace is designed for the high-precision execution of technical specifications. Success is measured by adherence to the following operational discipline and interaction protocols.

## I. Entry Protocol

Before performing any technical actions, you must review the following core documents in order:
1. **[GEMINI.md](GEMINI.md)**: The governing constitution for this workspace.
2. **[01_TASK_SPEC.md](01_TASK_SPEC.md)**: The primary execution contract and technical specifications.
3. **[02_DECISION_LOGS.md](02_DECISION_LOGS.md)**: The historical record of all architectural and logic decisions.
4. **[.agents/rules/](.agents/rules/)**: The catalog of technical and security constraints.

## II. Execution Lifecycle

1. **Planning & Traceability:** Document every step, plan, and progress update in `03_LOGS.md`.
2. **Clarification:** If any part of the specification is ambiguous, post inquiries in `02_DECISION_LOGS.md`. Do not proceed on assumptions.
3. **Implementation:** Develop all source code in `src/` and comprehensive tests in `test/`.
4. **Validation:** Use `npm run verify-gate` to perform automated quality and governance checks.
5. **Submission:** Use `npm run ls-gitpush -- --title "feat: task description"` for secure delivery.

## III. Command Interface

- `npm run verify-gate`: Executes the technical gate (Quality, Security, and Governance).
- `npm run ls-gitpush`: The mandatory delivery portal. It enforces local verification before submission.

## IV. Operational Discipline

- **Specification Integrity:** `01_TASK_SPEC.md` is a read-only baseline for the executor. 
- **Tool-Only Delivery:** All submissions must go through the provided automation scripts. Manual pushes are prohibited.
- **Governance Integrity:** Any modification to the `.agents/` directory or `GEMINI.md` is a violation of the execution contract.
- **Evidence-Based Completion:** A task is considered complete only when the logs provide verification evidence and all tests PASS.

---
**Status:** ACTIVE WORKSPACE
