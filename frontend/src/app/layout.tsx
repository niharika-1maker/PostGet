import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Content OS — Spatial Executive Studio",
  description: "Autonomous content planning, production and publishing operating system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        <div className="fixed inset-0 bg-spatial-radial pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Top Spatial Navigation Bar */}
          <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-black text-slate-950 text-sm shadow-lg shadow-sky-500/20">
                OS
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                  AI Content OS
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Phase 1 Foundation
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400">Spatial Executive Production Studio</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px]">Backend API: Connected</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono text-[11px]">
                Workspace: Default
              </div>
            </div>
          </header>

          {/* Main Body */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

