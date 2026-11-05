# ADR-0002: Confirmed Technical Stack, Operating Model & $0-Cost Baseline

- **Status:** Accepted  
- **Date:** 2026-11-06  
- **Decision Makers:** User & Lead Software Architect  

---

## 1. Context

In Phase 0, a comprehensive audit was performed on the specification baseline. In this decision record, the complete feature set, operating topology, and technology choices are locked in based on explicit user requirements to eliminate all assumptions.

---

## 2. Confirmed Decisions

### 2.1 Operating Model: Hybrid Single-User with Native Multi-Tenant Schema (Choice 1B)
- **Design:** The system will initially function as a streamlined in-house/personal content automation system dedicated to the creator.
- **Database Architecture:** All core tables will enforce `workspace_id` tenant isolation from day one. This guarantees that transitioning to a multi-tenant SaaS with teams and subscriptions requires zero schema refactoring.

### 2.2 Content Scope: Multi-Category & Configurable Formats (Choice 2D, 3C)
- **Supported Formats:** Faceless viral shorts, storytelling/cinematic narratives, educational explainers, and entertainment content.
- **Aspect Ratios:** Configurable per session — 9:16 (Shorts/Reels/TikTok), 16:9 (YouTube standard), 1:1 (Square), and 4:5 (Instagram portrait/LinkedIn).
- **Duration:** Dynamically configurable from 15 seconds to multi-minute long-form content.

### 2.3 LLM & Intelligence: Multi-Model BYOK with Gemini Free Tier Baseline (Choice 4D)
- **Engine:** Bring-Your-Own-Key (BYOK) provider-agnostic adapter.
- **Baseline Model:** Google Gemini (Gemini 2.5 / 3.0 Flash & Pro) via Google AI Studio free tier.
- **BYOK Expansion:** Supports user-supplied OpenAI (GPT-4o) and Anthropic (Claude 3.7 Sonnet) keys stored securely per workspace.

### 2.4 Video Generation: Multi-Provider Adapter + Zero-Cost Mock Engine (Choice 5C)
- **Contract:** Unified `VideoProviderAdapter` satisfying Invariant 4 (genuine AI video clips, rejecting pan/zoom image animations).
- **Local Dev Engine:** Built-in `MockVideoAdapter` generating real, valid 5-second test MP4 clips locally for instant, zero-cost development and testing.
- **Production Engines:** Pluggable adapters for Replicate, Luma Dream Machine, Kling AI, and Minimax Hailuo AI.

### 2.5 Voice Synthesis (TTS): Hybrid ElevenLabs + 100% Free Edge-TTS (Choice 6D)
- **Production Engine:** ElevenLabs API for voice cloning and emotional inflection.
- **Zero-Cost Engine:** Built-in `edge-tts` utilizing Microsoft Neural voices (e.g. Guy, Christopher, Jenny) with 0 API keys and $0 cost.

### 2.6 Assembly & Subtitles: Server-Side FFmpeg Worker Pipeline (Choice 7A)
- **Pipeline:** Native FFmpeg processing on the host/worker:
  - Lossless sequential concatenation of scene clips.
  - Subtitle generation and burning (dynamic SRT/ASS styled captions).
  - Audio normalization to EBU R128 standards.
  - Dynamic sidechain ducking of background music under voiceover.

### 2.7 Publishing Target: Short-Form Trio + LinkedIn/X Expansion + Download Hub (Choice 8A)
- **Phase 1 Platforms:** YouTube Shorts, Instagram Reels, TikTok.
- **Secondary Expansion:** LinkedIn and X (Twitter).
- **Review & Download Hub:** Full platform-ready packages (video + title + description + hashtags + thumbnail guidance) downloadable immediately, with direct OAuth auto-publishing when connected.

### 2.8 Technical Stack: Python FastAPI + Next.js 15 + Supabase (Choice 9B)
- **Frontend:** Next.js 15 (TypeScript, Tailwind CSS, shadcn/ui, Lucide icons).
- **Backend Services:** Python FastAPI (Python 3.14) for AI agent orchestration, FFmpeg media processing, `edge-tts` generation, and asynchronous job queues.
- **Database & Auth & Storage:** Supabase (PostgreSQL with RLS, Supabase Auth for session tokens, Supabase Storage for private media buckets).

### 2.9 Automation Modes: Triple-Mode Engine (Choice 10 A, B, C)
- The system supports 3 user-selectable workflow modes:
  1. **Step-by-Step Guided (Human-in-the-Loop):** Manual review at every gate (Topic → Script → Storyboard → Scene clips → Assembly → Post).
  2. **Semi-Autonomous (One-Click Pipeline):** Approve topic and script; system generates all clips, assembles video, and stops only at the final pre-publish screen.
  3. **Scheduled Autonomous Engine:** Background cron/worker runs daily market research and prepares draft candidates ready for one-click approval.

### 2.10 Cost Strategy: Zero-Cost Development (Choice 11)
- The entire system is engineered so local development, unit tests, and end-to-end dry runs function at **$0 cost** using:
  - Google Gemini Free Tier (Google AI Studio)
  - Edge-TTS (Free Microsoft Neural TTS)
  - Local Mock Video Adapter
  - Local FFmpeg
  - Supabase Free Tier

---

## 3. Consequences

### Positive
- Zero API cost barrier to build, test, and run the complete application.
- Decoupled Python backend gives optimal native performance for FFmpeg, media manipulation, and AI agent frameworks.
- Next.js provides a state-of-the-art creator studio UI.
- Native multi-tenant database design prevents expensive future migrations.

### Trade-offs
- Two runtimes (Node.js/Next.js for web UI, Python for backend/workers) coordinated via REST API / OpenAPI contracts.
- Local host requires FFmpeg installed for video assembly.

