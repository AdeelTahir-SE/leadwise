"use client";

import React from "react";
import { Search, Database, Zap, ShieldCheck, Cpu, Share2, Sparkles } from "lucide-react";

export default function FeaturesGrid() {
  const features = [
    {
      icon: Search,
      title: "Autonomous Discovery",
      desc: "Find companies that match your exact ideal customer profile across the open web, industry directories, and social platforms.",
    },
    {
      icon: Database,
      title: "Multi-Source Data",
      desc: "Crawl and cross-reference multiple live channels to ensure high fidelity company and contact information.",
    },
    {
      icon: Zap,
      title: "Intent Signals",
      desc: "Detect real-time buying signals like website visits, executive hiring, tech stack migration, and funding rounds.",
    },
    {
      icon: ShieldCheck,
      title: "Deep Enrichment",
      desc: "Get verified decision-maker emails, verified direct dials, revenue estimates, and tech stacks for every lead.",
    },
    {
      icon: Cpu,
      title: "Smart Qualification",
      desc: "Score and prioritize leads automatically using LLM reasoning tailored to your specific ICP guidelines.",
    },
    {
      icon: Share2,
      title: "Seamless Integrations",
      desc: "Connect directly with HubSpot, Salesforce, Outreach, Pipedrive, Slack, and your existing sales stack.",
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A36]">
              Features
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Everything You Need to Build a Predictable Pipeline
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Powerful features, built with AI, to help you find, qualify, and engage the right prospects — automatically.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group p-8 rounded-3xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/70 flex items-center justify-center text-[#FF5A36] mb-6 group-hover:bg-[#FF5A36] group-hover:text-white transition-all shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
