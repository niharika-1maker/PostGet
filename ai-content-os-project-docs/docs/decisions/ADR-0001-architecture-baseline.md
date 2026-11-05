# ADR-0001: Modular, Approval-First AI Content Platform

- Status: Proposed
- Date: 2026-11-05

## Context

AI Content OS must coordinate research, creative generation, expensive asynchronous media jobs, approvals and external publishing across multiple users and platforms.

## Decision

Adopt a modular architecture with:
- Database as source of truth.
- Backend-enforced workflow state machine and approvals.
- Durable asynchronous jobs for long-running generation.
- Replaceable provider adapters.
- Object storage for media.
- Explicit human approval at creative checkpoints and before each platform publish.
- Separate platform publishing states.
- Versioned assets and dependency-aware invalidation.

## Consequences

Positive:
- Providers can be replaced without rewriting product workflows.
- Long-running jobs can survive browser disconnects.
- Approval history is auditable.
- Publishing and cost controls can be enforced centrally.

Trade-offs:
- More schema and job lifecycle design is required.
- Provider adapters and reconciliation need testing.
- Version/dependency tracking adds complexity.

## Open questions

- Is tenant ownership user-based or workspace-based?
- Which database/hosting stack already exists?
- Which providers are available through API and affordable for the initial launch?
- Which platforms are in the first release?
