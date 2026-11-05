# AI Content OS — Project Documentation

This documentation pack defines the product, engineering constraints, AI-agent operating rules, and delivery standards for AI Content OS.

## Start here

1. [`AGENTS.md`](./AGENTS.md) — mandatory instructions for every AI coding agent.
2. [`docs/PROJECT_CONTEXT.md`](./docs/PROJECT_CONTEXT.md) — product context and confirmed requirements.
3. [`docs/PRD.md`](./docs/PRD.md) — functional requirements and acceptance criteria.
4. [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — system boundaries and architecture.
5. [`docs/TECH_STACK.md`](./docs/TECH_STACK.md) — proposed stack; verify against repository before adopting.
6. [`docs/ROADMAP.md`](./docs/ROADMAP.md) — staged implementation plan.

## Documentation status

These documents describe the intended product and proposed engineering direction. They do **not** prove that any feature is implemented. The coding agent must inspect the repository and update the implementation status with file paths, tests, and evidence.

## Suggested repository layout

```text
/
├── AGENTS.md
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── docs/
│   ├── PROJECT_CONTEXT.md
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── TECH_STACK.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_CONTRACTS.md
│   ├── AI_WORKFLOWS.md
│   ├── SECURITY.md
│   ├── TESTING.md
│   ├── DEPLOYMENT.md
│   ├── ROADMAP.md
│   └── decisions/
│       └── ADR-0001-architecture-baseline.md
└── .github/
    └── PULL_REQUEST_TEMPLATE.md
```

## Before implementation

The first agent task must be a read-only repository audit. Do not implement the entire product in one prompt. Do not replace an existing stack merely because this pack proposes another one.
