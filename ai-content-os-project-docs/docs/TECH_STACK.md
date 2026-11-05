# Technology Stack — Confirmed Baseline

**Status:** Confirmed & Approved (see [`ADR-0002`](./decisions/ADR-0002-confirmed-technical-architecture.md))

| Layer | Selected Technology | Operational Details |
|---|---|---|
| **Frontend Framework** | Next.js 15 (App Router, TypeScript) | Responsive creator studio, real-time generation previews |
| **UI Components** | Tailwind CSS + shadcn/ui | Radix accessible primitives, dark mode, high-density dashboard |
| **Backend API & Orchestration** | Python FastAPI (Python 3.14) | AI agents, media manipulation, async job runner |
| **Database** | PostgreSQL via Supabase | Relational source of truth, native RLS, tenant isolation (`workspace_id`) |
| **Authentication** | Supabase Auth | JWT session management, secure server verification |
| **Media Storage** | Supabase Storage (Private S3 buckets) | Video clips, voiceover tracks, rendered masters, signed URLs |
| **Job Queue** | Postgres-backed Durable Queue | Idempotent generation jobs with row-level locks (`FOR UPDATE SKIP LOCKED`) |
| **AI Reasoning & Scripts** | Multi-Model BYOK (Gemini / OpenAI / Claude) | Google Gemini 2.5/3.0 Free Tier baseline with BYOK for GPT-4o & Claude 3.7 |
| **Scene Video Generation** | Multi-Provider Adapter + Mock Engine | Unified adapter for Replicate / Luma / Kling + zero-cost local Mock Engine |
| **Voiceover & TTS** | Hybrid: Edge-TTS + ElevenLabs | 100% Free Edge-TTS (Microsoft Neural) baseline + ElevenLabs BYOK |
| **Video Assembly** | Server-Side FFmpeg Worker | Concatenation, EBU R128 audio normalization, dynamic subtitles, sidechain ducking |
| **Social Publishing** | Direct OAuth APIs + Package Hub | YouTube Shorts, TikTok, Instagram Reels, expanding to LinkedIn & X |
| **Cost Profile** | $0-Cost Development Ready | Complete local test suite and dry runs execute at zero external API cost |

## Selection rules

Before choosing a vendor, verify:
- API is available to this account and region.
- API is separate from consumer subscription access.
- Current pricing, quotas and rate limits.
- Commercial-use and output rights.
- Webhook/polling support and job duration.
- Data retention and privacy terms.
- Required social account type and platform permissions.

Do not hardcode plan prices or usage quotas. Keep them configurable.
