"use client";

import React, { useState, useEffect } from "react";
import { fetchBrandProfile, updateBrandProfile, BrandProfile } from "@/lib/api";
import { Save, Sparkles, Sliders, Volume2, ShieldCheck, Check } from "lucide-react";

export const BrandProfileEditor: React.FC = () => {
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const data = await fetchBrandProfile();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    try {
      setSaving(true);
      setError(null);
      const updated = await updateBrandProfile(profile);
      setProfile(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl animate-pulse">
        Loading Brand Profile configuration...
      </div>
    );
  }

  if (!profile) return null;

  return (
    <form onSubmit={handleSave} className="p-6 rounded-2xl glass-panel space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            Brand Profile & Guardrails
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configures the AI persona, creative direction, voice synthesis, and safety rules.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-950" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Profile"}
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Brand / Creator Name
          </label>
          <input
            type="text"
            value={profile.brand_name}
            onChange={(e) => setProfile({ ...profile, brand_name: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
            required
          />
        </div>

        {/* Primary Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Primary Content Category
          </label>
          <select
            value={profile.primary_category}
            onChange={(e) => setProfile({ ...profile, primary_category: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
          >
            <option value="educational">Educational & Explainer</option>
            <option value="entertainment">Entertainment & Cartoon</option>
            <option value="storytelling">Storytelling & Narrative</option>
            <option value="product_showcase">Product Showcase & Ad</option>
            <option value="personal_brand">Personal Brand</option>
          </select>
        </div>

        {/* Production Style (Faceless vs Avatar) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Production Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setProfile({ ...profile, production_style: "faceless" })}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                profile.production_style === "faceless"
                  ? "bg-sky-500/20 border-sky-500/50 text-sky-300"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Faceless (B-Roll + Text)
            </button>
            <button
              type="button"
              onClick={() => setProfile({ ...profile, production_style: "avatar" })}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                profile.production_style === "avatar"
                  ? "bg-sky-500/20 border-sky-500/50 text-sky-300"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              AI Avatar Presenter
            </button>
          </div>
        </div>

        {/* Neural Voice Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-sky-400" />
            Neural Voiceover (Free Edge-TTS)
          </label>
          <select
            value={profile.preferred_voice_id || "en-US-ChristopherNeural"}
            onChange={(e) => setProfile({ ...profile, preferred_voice_id: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
          >
            <option value="en-US-ChristopherNeural">Christopher (Natural, Energetic Male)</option>
            <option value="en-US-GuyNeural">Guy (Deep, Authoritative Male)</option>
            <option value="en-US-JennyNeural">Jenny (Engaging, Friendly Female)</option>
            <option value="en-GB-SoniaNeural">Sonia (British Accent, Sophisticated)</option>
          </select>
        </div>
      </div>

      {/* Niches & Keywords */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Content Niches & Target Topics (comma separated)
        </label>
        <input
          type="text"
          value={profile.niches.join(", ")}
          onChange={(e) =>
            setProfile({
              ...profile,
              niches: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
          className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
          placeholder="e.g. artificial-intelligence, productivity, coding-agents"
        />
      </div>

      {/* Tone & Style */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Brand Tone (comma separated)
        </label>
        <input
          type="text"
          value={profile.tone.join(", ")}
          onChange={(e) =>
            setProfile({
              ...profile,
              tone: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
          className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
          placeholder="e.g. concise, authoritative, witty, educational"
        />
      </div>

      {/* Content Restrictions / Guardrails */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Content Restrictions & Guardrails (comma separated)
        </label>
        <input
          type="text"
          value={profile.content_restrictions.join(", ")}
          onChange={(e) =>
            setProfile({
              ...profile,
              content_restrictions: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
          className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
          placeholder="e.g. no financial advice, no exaggerated claims, no controversial politics"
        />
      </div>
    </form>
  );
};
