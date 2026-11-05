# Technical Gap Analysis & Architecture Strategy — AI Content OS

**Document Version:** 1.0.0  
**Date:** 2026-11-05  
**Author:** Lead Software Architect & Senior Full-Stack Engineer  
**Scope:** Deep-dive analysis of architectural decisions, failure modes, integration prerequisites, and the phased implementation strategy.

---

## 1. Architectural Gaps & Decision Framework

### 1.1 Multi-Tenancy Scope: User vs Workspace
- **Current State:** `PROJECT_CONTEXT.md` mentions accounts/workspaces, but `PRD.md` specifies an initial single role: account owner/creator.
- **Architectural Gap:** Deciding whether the primary foreign key is `user_id` or `workspace_id`.
- **Recommended Resolution:** Implement a 1:1 default workspace per user upon registration (`workspaces` table with `owner_id = user_id`, and `workspace_members` linking users to workspaces). All domain entities (`brand_profiles`, `content_sessions`, `assets`, `platform_connections`) reference `workspace_id`. This cleanly satisfies the MVP single-user model while allowing frictionless upgrade to multi-user team collaboration in Phase 9 without schema rewrites.

### 1.2 Asynchronous Job Queue & Worker Topology
- **Current State:** `ARCHITECTURE.md` mandates asynchronous execution for all long-running generation. No queue runner or worker process exists.
- **Architectural Gap:** Standard serverless functions (e.g. Next.js on Vercel) terminate execution after 15–60 seconds, which is incompatible with video rendering (60–180s) and FFmpeg assembly.
- **Recommended Resolution:**
  - **Phase 1–4:** Use a Postgres-backed durable queue (e.g., `generation_jobs` table with `status IN ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED')` and row-level locking `FOR UPDATE SKIP LOCKED`) executed via scheduled worker loops or webhook callbacks.
  - **Phase 5–6:** Run a lightweight dedicated Node.js/Python container worker equipped with FFmpeg to process CPU-intensive media assembly.

### 1.3 Media Storage & Object Governance
- **Current State:** Media binaries must never be stored in PostgreSQL rows (Invariant 101).
- **Architectural Gap:** Storage buckets, upload permissions, and presigned URL pipelines are unconfigured.
- **Recommended Resolution:** Configure Supabase Storage / S3-compatible private buckets (`raw-uploads`, `generated-clips`, `assembled-renders`). Clients access media exclusively through short-lived presigned URLs (60 minutes expiry) generated server-side.

---

## 2. Critical Technical Risks & Failure Mode Mitigations

### 2.1 Concurrency Race Condition on "One Active Session per User" (Invariant 13)
- **The Danger:** If multiple requests to `POST /api/sessions` execute simultaneously, application-level checks (`SELECT COUNT(*) ...`) can race, resulting in two concurrent active sessions.
- **Root-Level Mitigation:** Enforce a database-level partial unique index in PostgreSQL:
  ```sql
  CREATE UNIQUE INDEX uq_one_active_session_per_workspace 
  ON content_sessions (workspace_id) 
  WHERE status NOT IN ('PUBLISHED', 'FAILED', 'CANCELLED');
  ```
  Any concurrent `INSERT` attempting to create a second active session fails immediately at the database transaction layer with an idempotency error, completely race-safe.

### 2.2 Genuine AI Video Enforcement vs Image Animation (Invariant 4)
- **The Danger:** Providers or developers might fallback to Pan/Zoom ("Ken Burns") image animations to save money or simplify pipelines, directly violating Invariant 4.
- **Root-Level Mitigation:**
  1. The `VideoProviderAdapter` contract must strictly return video container streams (MP4/WebM) generated from genuine text-to-video / image-to-video diffusion models (e.g. Luma, Runway, Kling, Minimax).
  2. Implement an automated media probe using `ffprobe` in the worker pipeline that verifies frame-to-frame optical flow / motion vectors, rejecting static single-frame pans.

### 2.3 Upstream Mutation & Downstream Invalidation (Invariant 12)
- **The Danger:** A user edits a script after scenes or video clips have already been generated, causing continuity mismatches or generating orphaned clips.
- **Root-Level Mitigation:** Implement an explicit asset version DAG (Directed Acyclic Graph):
  - `Topic (v1)` → `Script (v1)` → `Storyboard (v1)` → `Scene 1..N (v1)` → `Render (v1)` → `Post Package (v1)`.
  - When `Script` updates to `v2`, all downstream entities (`Storyboard`, `Scenes`, `Renders`, `Post Packages`) are tagged `is_stale = true`.
  - Prior approvals for `v1` remain recorded in history but cannot authorize `v2`.

### 2.4 Social Publishing Timeout Ambiguity (Invariants 10 & 92)
- **The Danger:** If a network timeout occurs while calling YouTube or TikTok API, retrying blindly can double-post the content.
- **Root-Level Mitigation:**
  1. Record a `publish_attempts` row with a client-supplied UUID `idempotency_key` and state `PUBLISHING` prior to dispatching the HTTP call.
  2. In the event of a network timeout, transition to `REQUIRES_RECONCILIATION`.
  3. The reconciliation worker queries the platform API using the external idempotency key or recent uploads before any retry is permitted.
  4. Only transition `platform_posts.status` to `PUBLISHED` when the external platform post ID is confirmed and persisted.

---

## 3. External Integration Prerequisites

Before live provider integrations are activated, each integration must provide a local test double (Mock Adapter) so test suites and local development function without API costs or internet dependency.

| Domain | Candidate External Providers | Mock Adapter Requirement | Integration Gate |
|---|---|---|---|
| **AI Reasoning & Scripts** | Google Gemini (Gemini 2.5/3.0 Pro/Flash), Anthropic Claude, OpenAI | `MockLLMAdapter` returning deterministic JSON fixtures | Phase 3 |
| **Market Research** | SerpAPI, Google Trends, Perplexity, Tavily | `MockSearchAdapter` returning static provenance items | Phase 3 |
| **Image Keyframes** | Recraft, Midjourney (via proxy), FLUX.1 | `MockImageAdapter` returning SVG/PNG test cards | Phase 4 |
| **Scene Video Generation** | Luma Dream Machine, Runway Gen-3, Kling, Minimax | `MockVideoAdapter` returning 5-second test MP4 clips | Phase 5 |
| **TTS / Narration** | ElevenLabs, Cartesia, OpenAI TTS | `MockTTSAdapter` generating silent or tone MP3 files | Phase 6 |
| **Video Assembly** | Local FFmpeg binary / FFmpeg container | Local FFmpeg executable installed on host/worker | Phase 6 |
| **Social Publishing** | YouTube Data API v3, TikTok Content Posting API, Meta Graph API | `MockPublishingAdapter` recording mock post IDs | Phase 7 |

---

## 4. Recommended Smallest Safe Implementation Plan

To ensure maximum engineering quality, zero breaking changes, and complete audit compliance, we recommend implementing the system in focused, reviewable phases.

### Phase 1: Foundation (Recommended Next Step)
*Goal: Establish version control, development toolchains, core database schemas with RLS, authentication, and Brand Profile CRUD.*

1. **Step 1.1: Workspace Environment & Git Initialization**
   - Initialize Git in the project workspace (`git init`).
   - Configure `.gitignore` (ignoring `.env*`, `node_modules`, `.next`, `dist`, temp media files).
   - Resolve local Node.js environment paths.
   - Establish `.env.example` with safe placeholder variable names.

2. **Step 1.2: Modern Web Application Baseline**
   - Initialize Next.js 14/15 App Router with TypeScript and Tailwind CSS.
   - Install shadcn/ui components (Radix primitives for accessible dialogs, forms, cards, tabs).
   - Configure Vitest / Jest for unit and integration testing.

3. **Step 1.3: Database Schemas & Row-Level Security (PostgreSQL)**
   - Author versioned additive migration `0001_initial_core_schema.sql`:
     - `users` (auth identity reference)
     - `workspaces` & `workspace_members` (multi-tenant baseline)
     - `brand_profiles` (complete profile fields from PRD 3.2)
     - `audit_events` (audit logging baseline)
   - Enable PostgreSQL RLS on all tables with explicit tenant ownership checks (`workspace_id`).

4. **Step 1.4: Authentication & Protected Route Middleware**
   - Implement Supabase Auth client and server session helpers.
   - Create Next.js `middleware.ts` guarding `/dashboard/*` and `/api/*` routes.
   - Build accessible Login, Signup, and Password Recovery pages.

5. **Step 1.5: Brand Profile Domain Service & UI**
   - Create Zod validation schema for Brand Profile (voice, audience, colors, niche, constraints).
   - Implement `GET /api/brand-profile` and `PUT /api/brand-profile` Route Handlers.
   - Build Brand Profile onboarding and settings dashboard view.
   - Author unit tests for validation schemas and RLS integration tests.

### Phase 2: Content Session & Approval State Engine (Preview)
- Create `content_sessions`, `session_events`, and `approvals` tables.
- Implement the partial unique index enforcing one active session per user.
- Build the backend state machine for managing linear workflow transitions.

---

## 5. Execution Boundary Notice

In accordance with mandatory project instructions:
> **STOP AFTER THE AUDIT. WAIT FOR MY APPROVAL BEFORE IMPLEMENTING PHASE 1.**

No application code, packages, or database migrations will be created or executed until explicit user review and approval of this audit and plan are provided.

