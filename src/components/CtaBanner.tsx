"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Play, CheckCircle2, Sparkles } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="py-20 lg:py-28 bg-[#0B191E] relative overflow-hidden text-white border-t border-slate-800">
      {/* Radiant glow spots */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Star sparkles */}
      <div className="absolute top-12 left-1/3 text-teal-300/30 animate-pulse text-lg">✦</div>
      <div className="absolute bottom-12 left-1/4 text-orange-300/30 animate-pulse text-xl">✦</div>
      <div className="absolute top-16 right-1/4 text-teal-300/40 animate-pulse text-2xl">✦</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: CTA copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/80 border border-teal-500/30 shadow-xs">
              <span className="text-xs font-bold tracking-wider uppercase text-teal-400">
                Ready to Get Started?
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Let Leadwise find your next best customers.
            </h2>

            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              Set your ICP, relax, and let our autonomous AI agents deliver qualified, enriched buyer accounts straight into your CRM.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold text-white bg-[#FF5A36] hover:bg-[#E84D2B] transition-all shadow-lg shadow-orange-500/30 hover:-translate-y-0.5"
              >
                <span>Start for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-base font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Watch Demo</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Floating 145 Qualified Leads badge card (From design-one.png bottom banner) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-3xl bg-white/95 backdrop-blur-xl p-6 text-slate-900 shadow-2xl border border-white/40">
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    145 Qualified Leads
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Ready
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                      A
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Acme Inc.</div>
                      <div className="text-[10px] text-slate-500">SaaS &middot; 200–500</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                    High Fit
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                      B
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">BrightLab</div>
                      <div className="text-[10px] text-slate-500">FinTech &middot; 50–200</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                    High Fit
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                      N
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">NovaTech</div>
                      <div className="text-[10px] text-slate-500">HealthTech &middot; 100–500</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800">
                    Medium Fit
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
