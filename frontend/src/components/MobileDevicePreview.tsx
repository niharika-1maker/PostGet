import React from "react";
import { Heart, MessageCircle, Share2, Music, Sparkles } from "lucide-react";

interface MobileDevicePreviewProps {
  title?: string;
  caption?: string;
  author?: string;
  aspectRatio?: string;
  videoUrl?: string;
}

export const MobileDevicePreview: React.FC<MobileDevicePreviewProps> = ({
  title = "AI Content OS Automation",
  caption = "Building an autonomous content pipeline from research to approved video #ai #buildinpublic",
  author = "@contentos.ai",
  aspectRatio = "9:16",
}) => {
  return (
    <div className="relative mx-auto w-[290px] h-[580px] bg-black rounded-[42px] border-[6px] border-slate-700/80 shadow-2xl overflow-hidden flex flex-col justify-between select-none">
      {/* Top Notch / Dynamic Island */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 mr-2" />
        <div className="w-2 h-2 rounded-full bg-blue-900/60" />
      </div>

      {/* Video Viewport Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 z-0 flex items-center justify-center">
        <div className="text-center p-6 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Live Preview</p>
          <p className="text-sm font-medium text-slate-200 line-clamp-2">{title}</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
            {aspectRatio} Full HD
          </span>
        </div>
      </div>

      {/* Right Action Rail (TikTok / Reels style) */}
      <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center space-y-4 text-white">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-rose-500/30 transition">
            <Heart className="w-5 h-5 text-rose-400" />
          </div>
          <span className="text-[10px] font-semibold mt-1">24.5k</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-slate-200" />
          </div>
          <span className="text-[10px] font-semibold mt-1">428</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-slate-200" />
          </div>
          <span className="text-[10px] font-semibold mt-1">Share</span>
        </div>
      </div>

      {/* Bottom Metadata & Captions */}
      <div className="relative z-20 p-4 pb-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-left">
        <div className="flex items-center space-x-2 mb-1.5">
          <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-[10px] font-bold text-slate-950">
            AI
          </div>
          <span className="text-xs font-bold text-white tracking-wide">{author}</span>
        </div>
        <p className="text-[11px] text-slate-200 line-clamp-3 leading-relaxed mb-2 font-normal">
          {caption}
        </p>
        <div className="flex items-center space-x-2 text-[10px] text-slate-400">
          <Music className="w-3 h-3 text-sky-400 animate-spin" style={{ animationDuration: "6s" }} />
          <span className="truncate">Original Sound • Neural Voiceover (Christopher)</span>
        </div>
      </div>
    </div>
  );
};

