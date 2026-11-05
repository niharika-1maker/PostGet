# Implementation Roadmap

Build incrementally. Do not ask an AI coding agent to implement every phase in one task.

## Phase 0 — Repository audit
- Inspect current stack and architecture.
- Map existing features to PRD.
- Identify security, data and deployment risks.
- Produce evidence-based gap report.
- No destructive changes.

## Phase 1 — Foundation
- Authentication and tenant ownership.
- Database migrations and RLS.
- Brand Profile CRUD and onboarding.
- Dashboard shell and protected routes.
- Audit logging baseline.

## Phase 2 — Session and approval engine
- Durable content sessions.
- Backend state machine.
- Race-safe one-active-session rule.
- Approval records tied to exact versions.
- Resume/cancel/failure handling.

## Phase 3 — Market intelligence and scripts
- Research adapters and provenance.
- Idea recommendation UI.
- Selection/rejection/saving.
- Script generation, editing and approval.

## Phase 4 — Storyboard and scene management
- Structured storyboard.
- Scene-level review and approval.
- Continuity references.
- Versioning and invalidation.

## Phase 5 — Actual AI video generation
- Provider evaluation and cost comparison.
- Provider adapter.
- Asynchronous job queue/worker.
- Real clip per scene.
- Retry, cancellation and validation.
- Cost/credit ledger.

## Phase 6 — Assembly and editorial review
- FFmpeg assembly worker.
- Voice, subtitles, sound and transitions.
- Aspect-ratio exports.
- Final video approval.

## Phase 7 — Social packaging and publishing
- Platform-specific packages.
- Separate approvals.
- OAuth connections.
- Official API/provider integrations.
- Idempotent publishing and reconciliation.

## Phase 8 — Analytics and learning
- Platform metric ingestion where permitted.
- Evidence-aware performance summaries.
- Recommendation feedback loop.

## Phase 9 — SaaS hardening
- Billing and plan entitlements.
- Rate limits and abuse controls.
- Monitoring, backups, privacy and support operations.

Each phase requires tests and acceptance evidence before moving on.
