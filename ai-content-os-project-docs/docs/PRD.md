# Product Requirements Document — AI Content OS

**Status:** Product baseline; implementation status must be audited.

## 1. Goal

Provide a guided AI content operating system that takes a user from market-informed idea discovery to high-quality, approved video publication and analytics.

## 2. User roles

Initial role: account owner/creator.

Future roles may include workspace owner, editor, reviewer, publisher and analyst. Do not implement role complexity until the ownership model is confirmed.

## 3. Functional modules

### 3.1 Authentication and workspace
- Signup, login, logout, password recovery and protected routes.
- Secure user/workspace ownership.
- Account settings and connected platform accounts.
- No client-controlled role escalation.

### 3.2 Brand Profile
Capture:
- Brand/account name and description.
- Categories, niches and target audience.
- Languages, tone and content goals.
- Preferred platforms and formats.
- Brand colors, logo and visual references.
- Products, packaging and protected brand assets.
- Recurring characters and character references.
- Voice preferences; authorized voice cloning only.
- Intro/outro, CTA and content restrictions.
- Faceless/avatar preference.

### 3.3 Market Intelligence
- Discover ideas using permitted search, trend, public content and first-party analytics sources.
- Store source, retrieval timestamp, query and evidence for each recommendation.
- Show why an idea is recommended.
- Allow save, reject, edit, select and request alternatives.
- Clearly label estimates and unavailable data.

Suggested initial opportunity score (configurable, not scientifically predictive):
- Niche relevance: 25%
- Search demand: 20%
- Trend momentum: 15%
- Audience engagement signals: 15%
- Originality: 10%
- Platform suitability: 10%
- Seasonal relevance: 5%

Do not display a numeric component when the underlying source data is unavailable.

### 3.4 Script generation
Each option should include:
- Hook
- Core message and narration
- Scene outline
- CTA
- Target duration
- Target platform(s)
- Tone and creative direction
- Sources/citations for factual claims where applicable

Default to three options, configurable by product policy. User can edit and approve one version.

### 3.5 Storyboard
Each scene should include:
- Stable scene ID and sequence
- Target duration
- Narration/dialogue
- Visual description
- Character/product references
- Location/background
- Camera, framing and movement
- Lighting and art direction
- Video prompt and negative prompt
- Sound/music direction
- Transition
- Continuity references
- Generation status and version

### 3.6 Scene generation
- User reviews and approves scene prompts/references.
- User can regenerate one scene without regenerating unaffected approved scenes.
- Enforce visual identity and product accuracy.
- Generate a genuine video clip for every scene.
- Store provider job identifiers, status, output reference and usage.
- Validate output dimensions, duration, file type and availability.

### 3.7 Video assembly
- Join scene clips in storyboard order.
- Add voice/narration, subtitles, music, transitions and branding.
- Normalize audio and validate final output.
- Export 9:16, 16:9, 1:1 and 4:5 where required.
- User reviews and approves a specific final video version.

### 3.8 Social packaging
Generate per platform:
- Title/caption/description
- Hashtags/keywords
- Thumbnail concept or asset
- Call to action
- Format and metadata checks

Each platform package has its own editable version and approval.

### 3.9 Publishing
- Connect accounts through official supported authorization flows.
- Validate platform requirements before publishing.
- Require explicit user approval for exact content version and target platform.
- Support immediate publishing and scheduling only where the platform/API permits.
- Store provider response, platform post ID, timestamp and result.
- Reconcile uncertain outcomes; never blindly duplicate a publish request.

### 3.10 Analytics
Collect only metrics permitted by platform APIs and user authorization, such as views, reach, impressions, likes, comments, shares, saves, watch time, average view duration, CTR and follower growth where available.
- Store source and collection time.
- Distinguish unavailable metrics from zero.
- Feed observed results into future recommendations.
- Never silently alter Brand Profile based on analytics.

## 4. Workflow and approvals

A session follows a backend-enforced state machine. Suggested states:

`IDLE → RESEARCH_READY → TOPIC_PENDING → TOPIC_APPROVED → SCRIPT_GENERATING → SCRIPT_PENDING → SCRIPT_APPROVED → STORYBOARD_GENERATING → STORYBOARD_PENDING → STORYBOARD_APPROVED → SCENES_GENERATING → SCENES_PENDING → SCENES_APPROVED → VIDEO_ASSEMBLING → VIDEO_PENDING → VIDEO_APPROVED → POST_GENERATING → POST_PENDING → POST_APPROVED → SCHEDULED → PUBLISHING → PUBLISHED`

Terminal/error states: `FAILED`, `CANCELLED`.

Implementation may refine states, but it must preserve the approval gates and audit history. Scene and platform statuses should also be tracked individually.

## 5. Non-functional requirements

- Tenant isolation and server-side authorization.
- Resumable asynchronous jobs.
- Idempotent external operations.
- Observable logs, errors and job states.
- Accessible, responsive UI.
- Secure secrets management.
- Cost visibility and budget controls.
- Data export/deletion policy to be defined.
- No unsupported claims about API capability or metrics.

## 6. MVP acceptance criteria

1. A user can create and manage a Brand Profile.
2. User data cannot be accessed by another user.
3. A recommendation includes source and timestamp or is explicitly marked as generated without external evidence.
4. Topic and script approvals are persisted and version-specific.
5. Storyboard scenes can be reviewed independently.
6. Every scene generation result is a video clip, not only an image.
7. Failed jobs can be retried safely.
8. Final video approval is version-specific.
9. Platform packages have separate approvals.
10. Publishing cannot occur without exact-version approval.
11. Successful publication stores platform confirmation/ID.
12. Analytics distinguish missing data from zero.
