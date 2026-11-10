import React, { useState } from "react";
import { Check, X, RotateCw, Flame, Video, CheckCircle2, ArrowRight } from "lucide-react";

export const SpatialControlDeck: React.FC = () => {
  const [stage, setStage] = useState<"topic" | "script" | "scenes" | "ready">("topic");
  const [topicStatus, setTopicStatus] = useState<"pending" | "approved">("pending");
  const [scriptStatus, setScriptStatus] = useState<"pending" | "approved">("pending");

  return (
    <div className="space-y-6">
      {/* Deck Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Executive Production Deck
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30">
              Semi-Autonomous Mode
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            The AI automation engine generates; you inspect and approve each creative checkpoint.
          </p>
        </div>
      </div>

      {/* Spatial Progress Flow (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Market Intelligence */}
        <div
          className={`p-5 rounded-2xl glass-panel transition-all ${
            topicStatus === "approved"
              ? "border-emerald-500/40 bg-emerald-950/10"
              : "border-sky-500/40 bg-slate-900/60 shadow-lg shadow-sky-950/20"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Stage 1: Topic Discovery
            </span>
            {topicStatus === "approved" ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" /> Approved
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Action Required
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-100 text-sm mb-2">
            "5 Secret AI Prompts That Replace 10 Hours of Weekly Work"
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Signal: Google Trends +420% breakout, Reddit productivity viral thread, validated audience match.
          </p>

          {topicStatus === "pending" ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTopicStatus("approved");
                  setStage("script");
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Check className="w-4 h-4" /> Accept Idea
              </button>
              <button className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1 transition">
                <RotateCw className="w-3.5 h-3.5" /> Next Idea
              </button>
            </div>
          ) : (
            <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Topic locked into session v1
            </div>
          )}
        </div>

        {/* Card 2: Script & Narration */}
        <div
          className={`p-5 rounded-2xl glass-panel transition-all ${
            topicStatus !== "approved"
              ? "opacity-50 pointer-events-none"
              : scriptStatus === "approved"
              ? "border-emerald-500/40 bg-emerald-950/10"
              : "border-sky-500/40 bg-slate-900/60 shadow-lg shadow-sky-950/20"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              Stage 2: Scriptwriting
            </span>
            {scriptStatus === "approved" ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" /> Approved
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Ready for Review
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-100 text-sm mb-1">
            Contrarian Hook Draft (45 sec)
          </h3>
          <p className="text-xs text-slate-400 italic mb-4">
            "Stop using ChatGPT like a search engine. Here is the single prompt framework top creators use..."
          </p>

          {scriptStatus === "pending" ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setScriptStatus("approved");
                  setStage("scenes");
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Check className="w-4 h-4" /> Approve Script
              </button>
              <button className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1 transition">
                <RotateCw className="w-3.5 h-3.5" /> Re-Draft
              </button>
            </div>
          ) : (
            <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Script v1 approved by Director
            </div>
          )}
        </div>

        {/* Card 3: Scene Generation & Assembly */}
        <div
          className={`p-5 rounded-2xl glass-panel transition-all ${
            scriptStatus !== "approved"
              ? "opacity-50 pointer-events-none"
              : "border-sky-500/40 bg-slate-900/60 shadow-lg shadow-sky-950/20"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-indigo-400" />
              Stage 3: AI Video Clips
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              3 Clips Ready
            </span>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300">Scene 1 (Hook Video)</span>
              <span className="text-[10px] font-mono text-emerald-400">5.0s MP4</span>
            </div>
            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300">Scene 2 (Framework)</span>
              <span className="text-[10px] font-mono text-emerald-400">5.0s MP4</span>
            </div>
            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-800/60">
              <span className="text-slate-300">Scene 3 (CTA Beat)</span>
              <span className="text-[10px] font-mono text-emerald-400">5.0s MP4</span>
            </div>
          </div>
          <button
            onClick={() => setStage("ready")}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            Review Final Cut <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

