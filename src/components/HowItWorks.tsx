"use client";

import React from "react";
import { Search, Brain, CheckCircle, Database, ArrowRight, Sparkles, Cpu, Layers } from "lucide-react";
import RobotMascot from "./RobotMascot";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Discover",
      desc: "Searches the web, directories, and social profiles to locate relevant companies matching initial filters.",
      icon: Search,
      badge: "Open Web Search",
    },
    {
      number: "2",
      title: "Analyze",
      desc: "Reads company websites, career portals, and news releases to extract deep structural signals.",
      icon: Brain,
      badge: "Semantic Reading",
    },
    {
      number: "3",
      title: "Qualify",
      desc: "Evaluates ICP fit using multi-factor AI reasoning: size, revenue, tech stack, and intent triggers.",
      icon: CheckCircle,
      badge: "LLM Reasoning",
    },
    {
      number: "4",
      title: "Enrich",
      desc: "Appends verified decision-maker emails, direct phone numbers, and formats ready for your CRM.",
      icon: Database,
      badge: "Direct CRM Push",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50/70 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A36]">
              How It Works
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
            From Search to Qualified Leads in 4 Simple Steps
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Our autonomous AI agents handle the heavy lifting of prospecting so your sales team can focus on closing deals.
          </p>
        </div>

        {/* 4 Steps Timeline / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#FF5A36] font-bold shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-slate-200">
                      0{step.number}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#FF5A36] mb-1.5">
                    {step.badge}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                    {step.number}. {step.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Step transition subtle arrow for desktop */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom AI Architecture Callout Card (From design-two / design-three) */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#0B191E] via-[#0F242A] to-[#162D35] p-8 sm:p-10 text-white relative overflow-hidden border border-slate-800 shadow-xl">
          <div className="absolute -right-10 -bottom-10 opacity-15">
            <RobotMascot size={280} />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-4 border border-teal-400/30">
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              Autonomous Agent Orchestration
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
              Powered by advanced LLMs and real-time web intelligence
            </h3>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Unlike static database scrapers that serve stale phone numbers, Leadwise actively crawls live digital footprints, verifies email deliverability, and dynamically calculates fit against your unique value proposition.
            </p>

            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span>LangChain + Frontier LLM Agents</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span>Custom ICP Reasoning Engine</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Real-Time Web & Registry Sync</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
