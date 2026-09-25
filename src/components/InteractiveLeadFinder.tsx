"use client";

import React, { useState } from "react";
import { Search, Bot, Sparkles, CheckCircle2, ArrowRight, Building2, Globe, Users, ExternalLink, Bookmark, Check } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  tech: string[];
  fitScore: number;
  fitLabel: "High Fit" | "Medium Fit";
  signals: string[];
  website: string;
}

const SAMPLE_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Summit Health",
    industry: "Healthcare SaaS",
    size: "120 employees",
    location: "Boston, MA",
    tech: ["AWS", "React", "Salesforce"],
    fitScore: 96,
    fitLabel: "High Fit",
    signals: ["Hiring 4 GTM roles", "Series A ($12M)"],
    website: "https://summithealth.io",
  },
  {
    id: "lead-2",
    name: "BrightLab Analytics",
    industry: "FinTech & Data",
    size: "80 employees",
    location: "San Francisco, CA",
    tech: ["AWS", "PostgreSQL", "HubSpot"],
    fitScore: 94,
    fitLabel: "High Fit",
    signals: ["Visited Pricing Page", "New VP Sales"],
    website: "https://brightlab.ai",
  },
  {
    id: "lead-3",
    name: "Acme Cloud Corp",
    industry: "Enterprise B2B SaaS",
    size: "150 employees",
    location: "New York, NY",
    tech: ["AWS", "Docker", "Stripe"],
    fitScore: 91,
    fitLabel: "High Fit",
    signals: ["Product Launch", "Hiring SDRs"],
    website: "https://acmecloud.co",
  },
  {
    id: "lead-4",
    name: "NovaTech Solutions",
    industry: "HealthTech Platforms",
    size: "110 employees",
    location: "Austin, TX",
    tech: ["GCP", "Kubernetes", "Next.js"],
    fitScore: 82,
    fitLabel: "Medium Fit",
    signals: ["Expanding Engineering team"],
    website: "https://novatech.health",
  },
];

export default function InteractiveLeadFinder() {
  const [query, setQuery] = useState(
    "Find B2B SaaS companies in the US with 50-200 employees that use AWS and are showing buying intent."
  );
  const [selectedLead, setSelectedLead] = useState<Lead>(SAMPLE_LEADS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [savedLeads, setSavedLeads] = useState<Record<string, boolean>>({});

  const predefinedQueries = [
    "Find B2B SaaS companies in the US with 50-200 employees using AWS",
    "Find FinTech startups with Series A funding hiring sales leaders",
    "Find Healthcare tech providers using HubSpot with recent growth",
  ];

  const handleQuerySelect = (newQuery: string) => {
    setQuery(newQuery);
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  const toggleSave = (id: string) => {
    setSavedLeads((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 mb-4">
            <Bot className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A36]">
              Live Interactive Demo
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Try the AI Agent Command Center
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Prompt our autonomous agent in plain English. See how it identifies companies, dissects firmographics, and qualifies ICP criteria in real time.
          </p>
        </div>

        {/* Interactive Workspace Window (Matching design-three section 2 & 3) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-w-6xl mx-auto">
          
          {/* Top Window Bar */}
          <div className="bg-[#0B191E] px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-semibold text-slate-400 pl-2">
                Leadwise AI Agent &middot; Autonomous Search Workspace
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-teal-400 bg-teal-950/60 border border-teal-800/60 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Agent Ready</span>
            </div>
          </div>

          {/* Quick Query Pills */}
          <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider mr-1">
              Sample Prompts:
            </span>
            {predefinedQueries.map((pq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuerySelect(pq)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  query === pq
                    ? "bg-[#FF5A36] text-white border-[#FF5A36] font-medium"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                &ldquo;{pq}&rdquo;
              </button>
            ))}
          </div>

          {/* Search Input Bar */}
          <div className="p-6 border-b border-slate-200">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tell me what you're looking for, and I'll find the best leads for you..."
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 focus:border-[#FF5A36]"
              />
              <button
                type="button"
                onClick={() => handleQuerySelect(query)}
                className="absolute right-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF5A36] hover:bg-[#E84D2B] transition-colors"
              >
                Run Agent
              </button>
            </div>
          </div>

          {/* Two-Column Explorer Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            
            {/* Left Column: AI Stream & Leads List (7 cols) */}
            <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
              <div>
                
                {/* Simulated AI Agent Thought Steps */}
                <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 mb-6">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase text-teal-800">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    Autonomous Agent Pipeline Status
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-2 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Searched live web & registries across 1,800+ candidate domains
                    </p>
                    <p className="flex items-center gap-2 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Evaluated tech stacks (AWS Cloud verified) & firmographics
                    </p>
                    <p className="flex items-center gap-2 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Extracted recent hiring & funding intent signals
                    </p>
                  </div>
                </div>

                {/* Leads Heading */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Found {SAMPLE_LEADS.length} Qualified Target Leads
                  </h4>
                  <span className="text-xs text-slate-400">Click a lead to view details</span>
                </div>

                {/* Lead Items */}
                <div className="space-y-2.5">
                  {SAMPLE_LEADS.map((lead) => {
                    const isSelected = selectedLead.id === lead.id;
                    return (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-orange-50/40 border-[#FF5A36] shadow-sm"
                            : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl font-bold text-sm flex items-center justify-center ${
                              isSelected
                                ? "bg-[#FF5A36] text-white"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {lead.name[0]}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 leading-tight">
                              {lead.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {lead.industry} &middot; {lead.size}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span
                            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                              lead.fitLabel === "High Fit"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {lead.fitScore}% Fit
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Showing top qualified matches</span>
                <span className="text-[#FF5A36] font-semibold">12,480 leads available in plan</span>
              </div>
            </div>

            {/* Right Column: Lead Details / Enrichment View (5 cols, Matching Section 3) */}
            <div className="lg:col-span-5 p-6 bg-slate-50/50 flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0F242A] to-[#1E3A44] text-white font-black text-lg flex items-center justify-center shadow-md">
                      {selectedLead.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 leading-tight">
                        {selectedLead.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedLead.location} &middot; {selectedLead.size}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedLead.fitLabel}
                  </span>
                </div>

                {/* Profile Details List */}
                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                      Website
                    </span>
                    <a
                      href={selectedLead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF5A36] hover:underline font-medium inline-flex items-center gap-1"
                    >
                      {selectedLead.website} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                      Industry Category
                    </span>
                    <span className="text-slate-800 font-medium">{selectedLead.industry}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                      Verified Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedLead.tech.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                      Intent & Growth Signals
                    </span>
                    <div className="space-y-1">
                      {selectedLead.signals.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-200 space-y-2">
                <button
                  type="button"
                  onClick={() => toggleSave(selectedLead.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    savedLeads[selectedLead.id]
                      ? "bg-slate-900 text-white"
                      : "bg-[#FF5A36] hover:bg-[#E84D2B] text-white shadow-xs"
                  }`}
                >
                  {savedLeads[selectedLead.id] ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Saved to Pipeline
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5" /> Save Lead & Push to CRM
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
