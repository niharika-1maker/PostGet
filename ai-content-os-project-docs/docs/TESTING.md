# Testing and Quality Strategy

## Test layers

### Unit tests
- State transition rules.
- Approval/version matching.
- Cost/credit calculations.
- Scoring with missing source signals.
- Provider error normalization.
- Schema validation.

### Integration tests
- Database transactions and constraints.
- Authentication and RLS.
- Job creation, retries and idempotency.
- Storage permissions.
- Provider adapters using test doubles.
- Publishing reconciliation.

### End-to-end tests
- Signup → Brand Profile → idea → topic approval → script approval.
- Storyboard review → scene generation → final assembly → approval.
- Per-platform package approval.
- Publishing is blocked without final approval.
- Session resume after refresh/re-login.

## Mandatory negative tests

- User A cannot read or update User B's profile/session/assets.
- Client cannot force a session into an approved or published state.
- Old approval cannot approve a newer asset version.
- Two concurrent session-create requests cannot create two active sessions for one owner.
- Duplicate job submission with same idempotency key does not create duplicate provider work.
- Retry after timeout does not duplicate a published post.
- Static image output is rejected where a video clip is required.
- Failed job does not advance workflow.
- Expired/invalid platform credentials block publishing safely.

## Quality gates

Run configured:
- Formatter
- Linter
- Type checker
- Unit tests
- Integration tests
- Production build
- Migration checks

Report exact commands, test counts and failures. Do not claim a check passed if it was not executed.
