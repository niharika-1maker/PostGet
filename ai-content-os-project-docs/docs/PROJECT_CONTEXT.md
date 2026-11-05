# Project Context — AI Content OS

## Product summary

AI Content OS is a multi-user AI content planning, production and publishing SaaS. It helps a creator or business move from market-informed content ideas to approved, platform-ready video content and measurable outcomes.

The user remains the decision-maker. The system researches, recommends, drafts, generates and coordinates; it does not publish without explicit approval.

## Supported content categories

The system must support multiple categories through configurable profiles and reusable templates, not separate hardcoded products:

- Educational and explainer videos
- Cartoon and animated entertainment
- Advertisements and product showcases
- Personal brand content
- Stories and narrative content
- Documentary-style content
- Other future categories

## Core product loop

Brand Profile → Market Intelligence → Topic Approval → Script Options → Script Approval → Storyboard → Scene Review → AI Video Generation per Scene → Video Assembly → Final Video Approval → Platform-Specific Post Packages → Per-Platform Approval → Publishing → Analytics → Improved Recommendations.

## Confirmed product requirements

- Multi-user SaaS with isolated accounts/workspaces.
- Brand profile can define niches, audience, languages, tone, categories, visual style, colors, logo, products, recurring characters, references, voice, platform preferences and restrictions.
- Faceless workflows must be supported; an AI avatar/twin is optional.
- Daily recommendations should use market/search/trend signals and show sources and timestamps.
- Do not fabricate search volume, competitor analytics, trend metrics or guaranteed virality.
- User can select, reject, save, edit or request alternative ideas.
- Generate multiple script options; user selects, edits and approves.
- Storyboards contain structured scenes with continuity details.
- User can approve/regenerate individual scenes.
- Every scene must receive an actual AI-generated video clip.
- Assemble scenes with narration/voice, subtitles, music, transitions and format exports.
- User approves final video before social packaging/publishing.
- Generate platform-specific captions, titles, hashtags and thumbnail guidance.
- Each platform has a separate approval and publishing status.
- Analytics are used to inform future recommendations, not silently rewrite brand settings.

## Default operating model

- One active production session per user by default.
- Sessions are resumable.
- A session represents one content idea from recommendation through publishing.
- User can cancel a session; failed/cancelled sessions must be auditable.
- User can explicitly start another session after the previous active session reaches a terminal state.

## Product quality principles

- User control over autonomous action.
- Evidence-backed research.
- Visual and character/product continuity.
- Transparent cost estimates and usage.
- Honest status and error reporting.
- Provider independence.
- Privacy and secure multi-tenancy.
- Progressive implementation; avoid building every integration at once.

## Unknowns requiring repository/user confirmation

- Existing repository URL, stack and implementation state.
- Workspace vs individual account ownership and collaboration model.
- Final identity/branding and supported languages for initial launch.
- Initial supported social platforms and account eligibility.
- Initial image, video, voice and research providers.
- Billing provider and commercial plan definitions.
- Data retention, content licensing and moderation policy.
- Whether scheduling and approval can be delegated to team members.
