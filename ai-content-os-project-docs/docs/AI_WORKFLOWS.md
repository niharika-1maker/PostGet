# AI Workflows and Agent Design

## 1. Agent roles

Use modular responsibilities rather than one unrestricted agent:

- Research Agent — discovers and summarizes market opportunities with provenance.
- Strategy Agent — ranks ideas and explains fit.
- Script Agent — creates structured script alternatives.
- Storyboard Agent — converts approved script into scene specifications.
- Continuity Agent — checks characters, products, setting and style across scenes.
- Scene Prompt Agent — creates provider-specific prompts from provider-neutral scene data.
- Video Generation Worker — submits and monitors actual video jobs.
- Editorial/QA Agent — checks outputs against user brief and technical constraints.
- Social Packaging Agent — creates platform-specific metadata.
- Analytics Agent — summarizes permitted performance metrics.

Agents propose outputs; backend domain services validate and persist them. Agents do not grant approvals, bypass access control or publish autonomously.

## 2. Structured output

- Define JSON schemas for each agent task.
- Validate output before persistence.
- Reject malformed or incomplete output.
- Store prompt/template version and model/provider metadata.
- Keep source references for factual research claims.
- Treat generated output as untrusted.

## 3. Scene continuity

A scene prompt should reference stable IDs for:
- Character identity and reference assets.
- Product identity, packaging and logo assets.
- Location/environment.
- Art direction and color palette.
- Wardrobe/props where relevant.
- Camera and lighting language.

A scene regeneration should preserve approved scenes and their assets unless the user explicitly requests a broader regeneration.

## 4. Generation workflow

1. Check user ownership and approval state.
2. Estimate cost and required credits.
3. Obtain confirmation if policy requires it.
4. Create a durable job with idempotency key.
5. Submit to provider adapter.
6. Persist provider job ID and status.
7. Poll or receive authenticated webhook.
8. Retrieve output and validate media.
9. Store asset metadata and storage reference.
10. Update job and scene status.
11. Notify UI.
12. Request user review/approval.

## 5. Human approval boundaries

The system may autonomously research, draft and prepare previews within configured limits. It must stop for user approval at each major creative checkpoint. Publishing always requires explicit final approval for each platform package/version.

## 6. Research integrity

- Store source URL/name, timestamp, query and relevant excerpt/metadata.
- Respect source access rules and API terms.
- Do not claim private competitor data.
- Do not invent volume, rankings, engagement or trends.
- Explain score inputs and missing data.
