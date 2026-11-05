# System Architecture — AI Content OS

## 1. Architecture principles

- Modular monolith first; split services only when scale or operational needs justify it.
- Database is the source of truth.
- Background workers handle long-running jobs.
- n8n is optional orchestration, not the authoritative state store.
- AI providers are accessed through adapters.
- All state transitions and approvals are server-side.
- Media binaries live in object storage; database stores metadata and references.
- UI reads durable state and subscribes/polls for progress.

## 2. Logical components

1. Web application: onboarding, dashboard, editor, approvals and analytics.
2. Application API: authentication, authorization, validation and domain commands.
3. Domain layer: brand profiles, sessions, approvals, assets, platform packages.
4. Database: users/workspaces, session state, versions, audit events and usage ledger.
5. Job queue: durable asynchronous tasks, retries and idempotency.
6. Workers: research, scripts, storyboards, image references, video, voice, assembly, publishing and analytics.
7. Provider adapters: search, LLM, image, video, voice, storage and social platforms.
8. Object storage: uploads, generated assets, previews and exports.
9. Observability: structured logs, traces, error monitoring and usage metrics.

## 3. Suggested request flow

Browser → authenticated API → domain validation → database transaction → enqueue job → worker → provider adapter → persist result → notify UI.

Do not hold a normal HTTP request open while a video provider renders a clip.

## 4. Provider adapter contract

Each adapter should expose a typed, provider-neutral interface for:
- Capability discovery/configuration
- Request validation
- Job submission
- Job status lookup or webhook handling
- Result retrieval
- Error normalization
- Usage/cost metadata when available

Provider-specific IDs and raw responses may be stored for debugging, with secrets removed.

## 5. Job lifecycle

Suggested job states: `QUEUED`, `RUNNING`, `WAITING_PROVIDER`, `SUCCEEDED`, `FAILED`, `CANCELLED`, `REQUIRES_RECONCILIATION`.

Requirements:
- Unique idempotency key per logical operation.
- Retry only retryable errors.
- Exponential backoff with limits.
- Provider polling/webhook signature validation.
- Timeout and stale-job detection.
- Persist provider job ID before polling.
- Never create duplicate expensive jobs because a browser refreshed.
- Record estimated and actual cost/credits where available.

## 6. Version and invalidation model

Every generated artifact should reference its source versions:
- Script version
- Storyboard version
- Scene prompt version
- Character/product reference version
- Generated clip version
- Final render version
- Platform package version

When an upstream artifact changes, mark only dependent downstream artifacts as stale. Preserve old versions and approval history. A prior approval never approves a changed version.

## 7. Multi-tenancy

Choose and document whether the primary tenant is a user or workspace. Every tenant-owned record must have an ownership key and server-side authorization. Enforce database row-level security where supported. One-active-session enforcement must match the confirmed ownership scope and be race-safe.

## 8. Initial deployment shape

A practical early deployment can use one web app, one worker process, one relational database, object storage and a durable job queue. Add separate services only when required. Keep local development possible without paid external AI providers by using explicit test adapters.
