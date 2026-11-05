# AI Agent Operating Instructions — AI Content OS

## 1. Mandatory reading order

Before editing any code, read:

1. `README.md`
2. `AGENTS.md`
3. `docs/PROJECT_CONTEXT.md`
4. `docs/PRD.md`
5. `docs/ARCHITECTURE.md`
6. `docs/TECH_STACK.md`
7. The relevant domain document(s): database, API, AI workflows, security, testing, deployment.
8. Existing source code and tests related to the requested task.

If repository instructions exist in nested `AGENTS.md` files, follow the most specific applicable instructions as well.

## 2. First action in an unfamiliar repository

Perform a read-only audit before implementation:

- Inspect the repository tree, package manifests, lockfiles, environment examples, migrations, routes, components, tests, CI and deployment configuration.
- Identify the actual stack and versions.
- Report implemented, partially implemented, missing, broken and unknown functionality separately.
- Cite exact file paths and relevant symbols as evidence.
- Run only safe, non-destructive inspection commands.
- Do not claim tests passed unless they were actually run and their results observed.
- Do not invent files, commits, deployment status, API credentials, analytics or product capabilities.

Wait for user approval before major architecture changes, destructive changes, migrations that may lose data, or paid provider integration.

## 3. Change discipline

- Make the smallest coherent change that satisfies the task.
- Preserve unrelated working functionality and established conventions.
- Do not rewrite the application, replace frameworks, or reorganize directories without explicit approval.
- Do not add dependencies if existing tools can solve the problem safely.
- Do not introduce placeholder buttons, fake data presented as real, mocked publishing, or hardcoded success states.
- Keep types, validation, error handling, accessibility and loading/empty/error states consistent.
- Update documentation when behavior, API contracts, schemas, configuration or architecture changes.
- Never silently change product requirements. Record conflicts and ask for a decision.

## 4. Product invariants — never violate

1. AI Content OS is a multi-user SaaS product, not a single-user personal script.
2. User approval is required at each major creative gate.
3. Never publish content without explicit final user approval for that platform and content version.
4. Every storyboard scene must result in a genuine AI-generated video clip. A still image with pan/zoom or an image animation effect does not satisfy this requirement.
5. The database is the source of truth. n8n, if used, orchestrates jobs; it is not the authoritative application database.
6. Long-running generation must run asynchronously, not inside a normal web request.
7. Provider integrations must be replaceable through adapters.
8. Backend authorization and state-transition rules must not rely on frontend controls.
9. Each platform has an independent approval and publishing state.
10. Mark a platform post as published only after verifying platform confirmation and storing the returned post identifier.
11. Preserve approved unaffected scenes when regenerating one scene.
12. Track versions and invalidate only downstream assets affected by an upstream change.
13. Enforce one active content session per user using a race-safe database/transactional mechanism.
14. Do not expose provider secrets or service-role credentials to the browser.
15. Never trigger expensive generation without showing an estimate and obtaining any required confirmation.

## 5. AI generation and external services

- Verify current provider documentation, API access, pricing, quotas, geographic availability and commercial-use terms before implementation.
- Do not assume a web UI subscription includes API access.
- Do not claim a provider is free unless verified.
- Use mock adapters only in tests and label them clearly.
- Store provider, model, request ID, status, estimated cost and actual usage where available.
- Use idempotency keys and retry policies for external jobs.
- Treat external model output and user-uploaded content as untrusted input.
- Validate structured model output against schemas before persisting or executing it.
- Do not let generated text execute SQL, shell commands, arbitrary URLs or privileged operations.

## 6. Security and privacy

- Enforce tenant/user ownership on the server and database.
- Validate every incoming request.
- Use least-privilege credentials.
- Keep secrets in environment variables or a secret manager.
- Never commit `.env`, API keys, tokens, private media or personal data.
- Sanitize rendered user/model content.
- Add rate limits and abuse controls to expensive endpoints.
- Record audit events for approvals, publishing and sensitive account actions.
- Follow `docs/SECURITY.md`.

## 7. Workflow and approval rules

- Only backend services may advance workflow states.
- Every approval must record user, timestamp, asset/version and decision.
- A stale approval cannot authorize a newer version.
- Failed jobs must not bypass approval gates.
- Publishing must re-check ownership, approval, content version, platform connection and scheduling constraints immediately before submission.
- A network timeout must not be interpreted as a failed publish or successful publish without reconciliation.

## 8. Database and migration rules

- Migrations must be additive and reversible where practical.
- Never reset or drop production data.
- Review RLS policies for both allowed and denied access.
- Use database constraints for invariants that must survive concurrent requests.
- Do not implement one-active-session-per-user as a frontend-only check.
- Do not store large media binaries in relational database rows; store object-storage references and metadata.
- Keep schema documentation synchronized with migrations.

## 9. Testing requirements

For every change:
- Add or update relevant unit tests.
- Add integration tests for database and provider boundaries.
- Add authorization tests for cross-user access.
- Add negative tests for invalid state transitions and missing approvals.
- Run lint, type-check, tests and build where configured.
- Report exact commands and outcomes.
- If a command cannot be run, state why; do not imply success.

## 10. Required completion report

At the end of every task, report:

1. What changed.
2. Files created/modified.
3. Requirements satisfied and evidence.
4. Commands/tests actually run and results.
5. Security and data-migration implications.
6. Known limitations and unresolved decisions.
7. Suggested next smallest task.

Do not mark a task complete if acceptance criteria are not met.
