# Deployment and Operations

## Environments

Maintain separate local, staging and production environments. Never point local experiments at production data by default.

## Required configuration categories

- Database URL and public client configuration.
- Server-only database/service credentials.
- Authentication secrets and callback URLs.
- Object storage credentials.
- Queue/worker configuration.
- AI provider API keys.
- Search/research provider keys.
- Social platform OAuth credentials.
- Webhook signing secrets.
- Monitoring and error-reporting DSNs.

Create `.env.example` with variable names and safe placeholders only. Never include real secrets.

## Deployment components

- Web application.
- Background worker(s).
- Relational database.
- Object storage.
- Durable queue/scheduler.
- Webhook endpoints.
- Monitoring/logging.

Long-running video jobs must be handled by a worker/provider job flow. Do not depend on a short-lived serverless request to complete a render.

## Operational requirements

- Health checks for web and workers.
- Structured logs with correlation/request/job IDs.
- Retry and dead-letter handling.
- Backup and restore procedure.
- Database migration procedure.
- Secret rotation procedure.
- Storage lifecycle/retention policy.
- Cost and usage monitoring.
- Provider outage handling.

## Release checklist

- [ ] Tests and build pass.
- [ ] Migrations reviewed and applied to staging.
- [ ] RLS and authorization tests pass.
- [ ] Secrets configured in deployment environment.
- [ ] Webhook signatures validated.
- [ ] Worker can process and retry jobs.
- [ ] Rollback/recovery plan exists.
- [ ] No debug credentials or test data exposed.
