"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-slate-50/60 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A36]">
              Pricing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Choose the Plan That Fits Your Growth
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Start free, upgrade as you grow. All plans include core AI discovery and verified email enrichment.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                !isAnnual
                  ? "bg-[#0B191E] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                isAnnual
                  ? "bg-[#0B191E] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual</span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Plan 1: Starter */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Starter
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-slate-900">
                  ${isAnnual ? "39" : "49"}
                </span>
                <span className="text-sm font-medium text-slate-500">/month</span>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Perfect for small teams and solo founders getting started.
              </p>

              <div className="mt-8 pt-8 border-t border-slate-100 space-y-3.5 text-xs text-slate-700">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>500</strong> qualified leads / month</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Basic firmographic enrichment</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Email deliverability verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Standard email support</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                href="/signup"
                className="w-full inline-flex items-center justify-center py-3 px-6 rounded-2xl text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Plan 2: Growth (Most Popular) */}
          <div className="relative bg-white rounded-3xl p-8 border-2 border-[#FF5A36] shadow-xl shadow-orange-500/10 flex flex-col justify-between -translate-y-2 lg:-translate-y-3">
            
            {/* Most Popular Ribbon */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-[#FF5A36] text-white shadow-md shadow-orange-500/30">
                Most Popular
              </span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A36]">
                Growth
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-slate-900">
                  ${isAnnual ? "119" : "149"}
                </span>
                <span className="text-sm font-medium text-slate-500">/month</span>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                For growing sales teams that need volume and predictive intent.
              </p>

              <div className="mt-8 pt-8 border-t border-slate-100 space-y-3.5 text-xs text-slate-700">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>2,500</strong> qualified leads / month</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Advanced ICP reasoning & tech stack audit</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Real-time hiring & funding intent signals</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Native CRM 2-way sync (HubSpot, Salesforce)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Priority 24/7 Slack & chat support</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                href="/signup"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-xs font-bold text-white bg-[#FF5A36] hover:bg-[#E84D2B] transition-all shadow-md shadow-orange-500/25"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Plan 3: Enterprise */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Enterprise
              </span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-slate-900">
                  Custom
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                For large revenue teams with custom security, compliance and volume.
              </p>

              <div className="mt-8 pt-8 border-t border-slate-100 space-y-3.5 text-xs text-slate-700">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Unlimited</strong> lead discovery & scoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Full waterfall data enrichment</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Dedicated customer success manager</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Custom AI agent tuning & web crawlers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>99.9% uptime SLA & SOC-2 compliance</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                href="/signup"
                className="w-full inline-flex items-center justify-center py-3 px-6 rounded-2xl text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
