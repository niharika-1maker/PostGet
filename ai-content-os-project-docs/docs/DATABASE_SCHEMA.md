# Database Design — AI Content OS

This is a logical schema guide, not executable migration SQL. Inspect existing migrations before designing or changing tables.

## Core entities

### Identity and tenancy
- `users` — auth identity reference and account metadata.
- `workspaces` — tenant/workspace if collaboration is supported.
- `workspace_members` — user membership and role.
- `brand_profiles` — brand voice, categories, audience, platforms and preferences.

### Research and production
- `research_runs` — query, sources, retrieval time and status.
- `content_ideas` — candidate idea, evidence, score components and decision.
- `content_sessions` — one content production session and current state.
- `session_events` — append-only state transition and audit history.
- `scripts` / `script_versions` — script content and version history.
- `storyboards` / `storyboard_versions` — ordered scene plan.
- `scenes` / `scene_versions` — scene prompt, continuity references and status.
- `assets` — media metadata, storage key, type, provider and version.
- `generation_jobs` — asynchronous work and provider job IDs.
- `approvals` — actor, decision, timestamp, artifact type and exact version.

### Publishing and learning
- `platform_connections` — encrypted/managed credential references and scopes.
- `platform_posts` — platform-specific content package and status.
- `publish_attempts` — idempotency key, provider response and reconciliation state.
- `analytics_snapshots` — metric, value, source and collection timestamp.
- `usage_ledger` — estimated/actual credits and provider usage.

## Required data rules

- Every tenant-owned row has a tenant ownership key.
- Foreign keys must prevent orphaned production records.
- Use unique constraints for external IDs and idempotency keys.
- Store approval against an immutable artifact/version identifier.
- Store timestamps in UTC; render in user's timezone.
- Store money/usage as precise numeric values with currency/unit.
- Distinguish `NULL`/unavailable from numeric zero.
- Keep provider secrets out of ordinary application tables where possible.

## One active session

Do not rely on a frontend check. Confirm the ownership scope (user or workspace) and implement a race-safe constraint/transaction. One option is a dedicated lock table with a unique owner key for active sessions, released transactionally when a session reaches a terminal state. A partial unique index may also work if the status model and database semantics support it.

Do not copy an index that is unique only by `brand_profile_id` when the requirement is one active session per user.

## Row-level security

For every table, test:
- Owner can read/write permitted rows.
- Different user cannot read or mutate the row.
- Workspace member can access only records permitted by role.
- Anonymous user cannot access private records.
- Service-role operations are restricted to trusted server/worker contexts.

## Migration policy

- Use versioned migrations.
- Review generated SQL before applying.
- Test migrations on a disposable development database.
- Never reset production data as a shortcut.
- Include rollback or recovery notes for risky changes.
