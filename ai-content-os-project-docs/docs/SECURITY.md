# Security, Privacy and Trust

## Authentication
- Use established authentication libraries/providers.
- Protect server routes and background job entry points.
- Do not trust user IDs, roles or tenant IDs supplied by the browser.
- Rotate/revoke tokens when connections are removed.

## Authorization and multi-tenancy
- Verify tenant ownership on every read/write.
- Apply RLS or equivalent database enforcement.
- Test cross-tenant access denial.
- Restrict worker/service-role access to the minimum required operations.

## Secrets
- Keep secrets in environment variables or managed secret storage.
- Never commit `.env` files or print secrets in logs.
- Use separate development, staging and production credentials.
- Do not expose service-role keys in client bundles.

## User content and uploads
- Validate file type, size and content.
- Use private storage by default and signed URLs with expiry.
- Scan or moderate uploads where appropriate.
- Prevent path traversal and unsafe file handling.
- Apply retention and deletion policies.

## AI and prompt injection
- Treat prompts, uploads, retrieved webpages and model output as untrusted.
- Do not let model output invoke arbitrary tools or privileged APIs.
- Use allowlisted tool functions and strict argument schemas.
- Keep authorization decisions outside the LLM.
- Do not expose internal prompts or secrets to retrieved content.

## Publishing
- Encrypt/manage OAuth tokens securely.
- Request only necessary scopes.
- Record who approved what and when.
- Revalidate approval and content version immediately before publish.
- Reconcile ambiguous provider outcomes to prevent duplicate posts.

## Cost and abuse controls
- Rate-limit expensive endpoints.
- Enforce account/workspace budgets and credit checks server-side.
- Require confirmation for high-cost regeneration.
- Log estimated and actual usage.
- Add cancellation and stale-job controls.

## Audit and incident response
- Audit approvals, connection changes, publishing and administrative actions.
- Avoid logging sensitive content unless necessary.
- Document incident response and credential revocation procedures before production.
