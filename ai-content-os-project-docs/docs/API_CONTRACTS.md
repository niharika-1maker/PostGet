# API Contracts — AI Content OS

API routes are illustrative. Align naming and conventions with the existing repository. All protected routes require server-side authentication, authorization, validation and structured errors.

## API design rules

- Version public APIs where appropriate.
- Validate request and response payloads with shared schemas.
- Return stable error codes and request IDs.
- Use pagination for collections.
- Use idempotency keys for expensive or externally visible operations.
- Do not expose provider credentials or raw secret-bearing responses.
- Never accept a client-supplied status transition without domain validation.

## Suggested endpoints

| Method | Route | Purpose |
|---|---|---|
| GET/PUT | `/api/brand-profile` | Read/update current brand profile |
| GET | `/api/recommendations` | List research-backed ideas |
| POST | `/api/research-runs` | Start a research job |
| POST | `/api/ideas/:id/decision` | Select/reject/save idea |
| POST | `/api/sessions` | Create session with active-session guard |
| GET | `/api/sessions/:id` | Read session and progress |
| POST | `/api/sessions/:id/approve-topic` | Approve exact topic version |
| POST | `/api/sessions/:id/scripts` | Generate script options |
| POST | `/api/scripts/:id/approve` | Approve exact script version |
| POST | `/api/sessions/:id/storyboard` | Generate storyboard |
| POST | `/api/scenes/:id/approve` | Approve scene version |
| POST | `/api/scenes/:id/regenerate` | Regenerate one scene |
| POST | `/api/scenes/:id/video-jobs` | Queue actual video generation |
| GET | `/api/jobs/:id` | Read durable job status |
| POST | `/api/sessions/:id/renders` | Queue final assembly |
| POST | `/api/renders/:id/approve` | Approve exact final video version |
| POST | `/api/platform-posts` | Generate platform-specific packages |
| POST | `/api/platform-posts/:id/approve` | Approve one platform package version |
| POST | `/api/platform-posts/:id/publish` | Publish only after server revalidation |
| GET | `/api/analytics` | Read available analytics |

## Approval payload

An approval command should identify:
- Artifact type and immutable version ID.
- Decision (`APPROVE` or `REJECT`).
- Optional user feedback.
- Authenticated actor from server session, never trusted from request body.

## Publishing preconditions

Immediately before publishing, verify:
1. Authenticated actor owns or is authorized for the workspace.
2. Platform connection is valid and has required scopes.
3. Exact package version is approved.
4. Final video asset is approved and available.
5. Request idempotency key is unused or safely reconciled.
6. Platform-specific validation passes.

Only set `PUBLISHED` after confirmed platform response and persisted platform post ID. For ambiguous timeouts, reconcile before retrying.
