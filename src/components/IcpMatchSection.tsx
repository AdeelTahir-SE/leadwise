"use client";

import React, { useState } from "react";
import { CheckCircle2, TrendingUp, Sparkles, Building2, Users, Layers, MapPin, Eye, DollarSign, Briefcase, Plus, Check } from "lucide-react";

export default function IcpMatchSection() {
  const [addedToCampaign, setAddedToCampaign] = useState(false);

  return (
    <section id="icp-match" className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A36]">
              Target The Right Companies
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Match Your Ideal Customer Profile with Precision
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Stop wasting time on generic cold outbound. Our AI evaluates nuanced buyer intent, tech stack compatibility, and growth markers with 90%+ qualification accuracy.
          </p>
        </div>

        {/* 2-Column Match Card showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto bg-slate-50/80 rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl shadow-slate-200/40">
          
          {/* Left Column: 92% ICP Circular Score & Match Reasons */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col items-center sm:items-start text-center sm:text-left">
            
            {/* Circular Gauge */}
            <div className="w-full flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                  />
                  {/* Progress circle 92% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#0D9488"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="20.1"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900 leading-none">92%</span>
                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mt-1">ICP Match</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
                  <TrendingUp className="w-3.5 h-3.5" /> High Intent Detected
                </span>
                <h4 className="text-lg font-bold text-slate-900">Summit Health, Inc.</h4>
                <p className="text-xs text-slate-500">Digital Health Platform &middot; Series A</p>
              </div>
            </div>

            {/* Why This Lead Matches */}
            <div className="w-full pt-6 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-left">
                Why this lead matches
              </h5>

              <div className="space-y-2.5 text-left">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Right Industry:</strong> Healthcare & B2B SaaS</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Company Size:</strong> 120 employees (50–200 range)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Tech Stack:</strong> AWS, React, Salesforce CRM</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Geography:</strong> United States (HQ: Boston, MA)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Buying Intent Signals & Action */}
          <div className="lg:col-span-6 space-y-6">
            
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Detected Buying Intent Signals
              </h5>
              
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
                    <Eye className="w-4 h-4 text-teal-600" />
                    <span>Visited Pricing Page</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    High
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
                    <Briefcase className="w-4 h-4 text-orange-600" />
                    <span>Hiring 4 GTM & SDR Roles</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                    High
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2.5 text-sm font-medium text-slate-800">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Series A Funding ($12M closed)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Recent
                  </span>
                </div>
              </div>
            </div>

            {/* Fit Summary Box */}
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80">
              <p className="text-xs font-bold text-teal-900 mb-1">
                AI Recommendation
              </p>
              <p className="text-xs text-teal-800 leading-relaxed">
                This company matches your core ICP criteria and shows high intent activity in the past 14 days. Ideal for outbound sequence initiation.
              </p>
            </div>

            {/* Add to Campaign Button */}
            <button
              type="button"
              onClick={() => setAddedToCampaign(!addedToCampaign)}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                addedToCampaign
                  ? "bg-emerald-600 text-white shadow-emerald-600/20"
                  : "bg-[#FF5A36] hover:bg-[#E84D2B] text-white shadow-orange-500/20"
              }`}
            >
              {addedToCampaign ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Outbound Campaign</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Campaign</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
