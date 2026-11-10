-- ==============================================================================
-- AI CONTENT OS — CORE DATABASE SCHEMA & ROW-LEVEL SECURITY MIGRATION
-- Migration: 0001_initial_core_schema.sql
-- Description: Sets up multi-tenant workspaces, brand profiles, audit log,
--              session table baseline with race-safe one-active-session index,
--              and strict Row-Level Security (RLS) policies.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. WORKSPACES (Tenant Root)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    owner_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for owner lookups
CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON public.workspaces(owner_id);

-- ------------------------------------------------------------------------------
-- 3. WORKSPACE MEMBERS (Tenancy Membership & RBAC)
-- ------------------------------------------------------------------------------
CREATE TYPE public.workspace_role AS ENUM ('owner', 'admin', 'editor', 'viewer');

CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role public.workspace_role NOT NULL DEFAULT 'editor',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_workspace_user UNIQUE (workspace_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON public.workspace_members(workspace_id);

-- Helper function to check workspace membership in RLS policies
CREATE OR REPLACE FUNCTION public.is_workspace_member(ws_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.workspace_members 
        WHERE workspace_id = ws_id 
          AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 4. BRAND PROFILES (PRD 3.2 Specification)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.brand_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    brand_name VARCHAR(120) NOT NULL,
    description TEXT,
    primary_category VARCHAR(50) NOT NULL DEFAULT 'educational',
    niches TEXT[] NOT NULL DEFAULT '{}',
    target_audience TEXT,
    languages TEXT[] NOT NULL DEFAULT '{"en"}',
    tone TEXT[] NOT NULL DEFAULT '{"engaging", "informative"}',
    content_goals TEXT[] NOT NULL DEFAULT '{}',
    production_style VARCHAR(30) NOT NULL DEFAULT 'faceless',
    preferred_aspect_ratios TEXT[] NOT NULL DEFAULT '{"9:16"}',
    brand_colors TEXT[] NOT NULL DEFAULT '{}',
    logo_url TEXT,
    preferred_voice_id VARCHAR(100) DEFAULT 'en-US-ChristopherNeural',
    voice_provider VARCHAR(50) DEFAULT 'edge-tts',
    recurring_characters JSONB NOT NULL DEFAULT '[]',
    default_call_to_action TEXT,
    content_restrictions TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_brand_profile_workspace UNIQUE (workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_brand_profiles_workspace ON public.brand_profiles(workspace_id);

-- ------------------------------------------------------------------------------
-- 5. CONTENT SESSIONS (Phase 2 Baseline with Race-Safe Concurrency Lock)
-- ------------------------------------------------------------------------------
CREATE TYPE public.session_status AS ENUM (
    'IDLE',
    'RESEARCH_READY',
    'TOPIC_PENDING',
    'TOPIC_APPROVED',
    'SCRIPT_GENERATING',
    'SCRIPT_PENDING',
    'SCRIPT_APPROVED',
    'STORYBOARD_GENERATING',
    'STORYBOARD_PENDING',
    'STORYBOARD_APPROVED',
    'SCENES_GENERATING',
    'SCENES_PENDING',
    'SCENES_APPROVED',
    'VIDEO_ASSEMBLING',
    'VIDEO_PENDING',
    'VIDEO_APPROVED',
    'POST_GENERATING',
    'POST_PENDING',
    'POST_APPROVED',
    'SCHEDULED',
    'PUBLISHING',
    'PUBLISHED',
    'FAILED',
    'CANCELLED'
);

CREATE TABLE IF NOT EXISTS public.content_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    created_by UUID NOT NULL,
    title VARCHAR(200),
    status public.session_status NOT NULL DEFAULT 'IDLE',
    automation_mode VARCHAR(30) NOT NULL DEFAULT 'guided', -- guided, semi_auto, scheduled
    current_step VARCHAR(50) NOT NULL DEFAULT 'topic',
    error_message TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_content_sessions_workspace ON public.content_sessions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_content_sessions_status ON public.content_sessions(status);

-- CRITICAL INVARIANT 13: Exact-safe partial unique index enforcing 
-- ONE ACTIVE SESSION per workspace at the database engine level.
CREATE UNIQUE INDEX IF NOT EXISTS uq_one_active_session_per_workspace 
ON public.content_sessions (workspace_id) 
WHERE status NOT IN ('PUBLISHED', 'FAILED', 'CANCELLED');

-- ------------------------------------------------------------------------------
-- 6. AUDIT LOGGING (Security & Action History)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL, -- e.g. 'brand_profile.update', 'session.approve_topic'
    resource_type VARCHAR(60) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_events_workspace ON public.audit_events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON public.audit_events(created_at DESC);

-- ------------------------------------------------------------------------------
-- 7. ROW-LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- WORKSPACES POLICIES
CREATE POLICY "Users can view workspaces they belong to"
    ON public.workspaces FOR SELECT
    USING (public.is_workspace_member(id) OR owner_id = auth.uid());

CREATE POLICY "Owners can update their workspaces"
    ON public.workspaces FOR UPDATE
    USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create workspaces"
    ON public.workspaces FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

-- WORKSPACE MEMBERS POLICIES
CREATE POLICY "Members can view workspace member lists"
    ON public.workspace_members FOR SELECT
    USING (public.is_workspace_member(workspace_id));

-- BRAND PROFILES POLICIES
CREATE POLICY "Workspace members can view their brand profile"
    ON public.brand_profiles FOR SELECT
    USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace members can update their brand profile"
    ON public.brand_profiles FOR UPDATE
    USING (public.is_workspace_member(workspace_id))
    WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace members can insert their brand profile"
    ON public.brand_profiles FOR INSERT
    WITH CHECK (public.is_workspace_member(workspace_id));

-- CONTENT SESSIONS POLICIES
CREATE POLICY "Workspace members can view content sessions"
    ON public.content_sessions FOR SELECT
    USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace members can create content sessions"
    ON public.content_sessions FOR INSERT
    WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace members can update content sessions"
    ON public.content_sessions FOR UPDATE
    USING (public.is_workspace_member(workspace_id));

-- AUDIT EVENTS POLICIES
CREATE POLICY "Workspace members can view audit events"
    ON public.audit_events FOR SELECT
    USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace members can create audit records"
    ON public.audit_events FOR INSERT
    WITH CHECK (public.is_workspace_member(workspace_id));

