"use client";

import React from "react";
import Image from "next/image";
import { Search, Brain, Database, RefreshCw, CheckCircle2, ShieldCheck, ExternalLink, Zap } from "lucide-react";

export default function WhyLeadwise() {
  const pillars = [
    {
      icon: Search,
      title: "Web Discovery",
      description:
        "Searches the open web, company sites and social profiles — no manual scraping.",
    },
    {
      icon: Brain,
      title: "LLM-Powered Qualification",
      description:
        "Understands your ICP and reasons about fit using advanced language models.",
    },
    {
      icon: Database,
      title: "Rich Enrichment",
      description:
        "Gathers key firmographic, technographic and intent data for complete profiles.",
    },
    {
      icon: RefreshCw,
      title: "Autonomous Pipeline",
      description:
        "Runs 24/7, so you get a steady flow of qualified leads.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Top Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A36]">
              Why Leadwise
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Smarter Lead Generation with AI Agents
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            We combine powerful AI with real-time web data to find and qualify leads
            that actually fit your business.
          </p>
        </div>

        {/* 2-Column Grid: 4 Pillars on Left, Enriched TechCorp Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* 4 Pillars */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="group p-6 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#FF5A36] mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Lead Profile Showcase: TechCorp Lead Details Card */}
          <div className="lg:col-span-6 relative">
            {/* Ambient blur */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 to-orange-400/10 rounded-3xl blur-2xl -z-10" />

            <div className="relative rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 overflow-hidden">
              
              {/* Header Banner / Company Visual */}
              <div className="relative h-36 w-full rounded-2xl overflow-hidden mb-6 bg-gradient-to-r from-[#0F242A] to-[#1E3A44] flex items-center justify-between px-6 text-white">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> High Fit
                  </div>
                  <h4 className="text-2xl font-bold">TechCorp Systems</h4>
                  <p className="text-xs text-slate-300 mt-0.5">SaaS · 100–200 employees · New York, US</p>
                </div>
                <div className="relative z-10 hidden sm:flex flex-col items-end">
                  <span className="text-xs text-slate-400 font-medium">ICP Match Score</span>
                  <span className="text-2xl font-black text-emerald-400">96%</span>
                </div>
              </div>

              {/* Technologies Badges */}
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                  Detected Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> AWS Cloud
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" /> React
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> PostgreSQL
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Salesforce
                  </span>
                </div>
              </div>

              {/* Verified ICP Checklist Criteria */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  AI Qualification Analysis
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>Industry Match</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>Company Size</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>Tech Stack</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>Buying Intent</span>
                  </div>
                </div>
              </div>

              {/* Intent Signals */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Active Signals: Hiring 3 GTM roles &middot; Recent funding
                </span>
                <span className="text-[#FF5A36] font-semibold flex items-center gap-1">
                  Enriched profile <ExternalLink className="w-3 h-3" />
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
