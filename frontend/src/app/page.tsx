"use client";

import React, { useState } from "react";
import { SpatialControlDeck } from "@/components/SpatialControlDeck";
import { BrandProfileEditor } from "@/components/BrandProfileEditor";
import { MobileDevicePreview } from "@/components/MobileDevicePreview";
import { Layers, Sliders, Smartphone, CheckCircle, Zap } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"deck" | "profile">("deck");

  return (
    <div className="space-y-8">
      {/* Studio Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-sky-400" />
            Executive Studio Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Autonomous multi-category content production engine. You act as the Executive Director
            approving topics, scripts, and video clips before publishing.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-2xl bg-slate-900/90 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("deck")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === "deck"
                ? "bg-sky-500 text-slate-950 shadow-md font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4" /> Production Deck
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === "profile"
                ? "bg-sky-500 text-slate-950 shadow-md font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sliders className="w-4 h-4" /> Brand Profile
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left Studio Canvas + Right Mobile Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Deck or Brand Profile Editor) */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === "deck" ? (
            <div className="space-y-6">
              <SpatialControlDeck />
              
              {/* Quick Status Bar */}
              <div className="p-4 rounded-2xl glass-panel flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Zero-cost Mock Video Engine & Edge-TTS Active
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  Target: 9:16 Shorts / Reels
                </span>
              </div>
            </div>
          ) : (
            <BrandProfileEditor />
          )}
        </div>

        {/* Right Column (Floating Smartphone Preview Simulator) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <Smartphone className="w-4 h-4 text-sky-400" />
              Live Phone Simulator
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              9:16 Feed
            </span>
          </div>

          {/* Smartphone Simulator */}
          <MobileDevicePreview
            title="5 Secret AI Prompts for Creators"
            caption="Stop using AI like a basic search engine. Here is the exact framework to automate your production pipeline #ai #contentos"
            author="@ai.content.os"
          />
        </div>
      </div>
    </div>
  );
}

