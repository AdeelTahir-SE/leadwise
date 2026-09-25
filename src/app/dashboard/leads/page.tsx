"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Bot,
  Zap,
  Globe,
  Mail,
  Building2,
  Users,
  X,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import { Lead, LeadStage } from "@/types/dashboard";
import { initialLeads } from "@/lib/mockData";

export default function LeadManagementPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(initialLeads[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch leads based on search & filters
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (selectedStage !== "all") params.append("stage", selectedStage);

    fetch(`/api/leads?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setLeads(json.data);
        }
      })
      .catch((err) => console.error("Error fetching leads:", err))
      .finally(() => setLoading(false));
  }, [searchTerm, selectedStage]);

  const handleStageChange = async (leadId: string, newStage: LeadStage) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead({ ...selectedLead, stage: newStage });
        }
      }
    } catch (err) {
      console.error("Failed to update stage:", err);
    }
  };

  const stageBadges: Record<LeadStage, { label: string; class: string }> = {
    discovered: { label: "Discovered", class: "bg-slate-100 text-slate-700 border-slate-200" },
    researching: { label: "Researching", class: "bg-sky-50 text-sky-700 border-sky-200" },
    qualified: { label: "Qualified", class: "bg-teal-50 text-teal-700 border-teal-200" },
    enriched: { label: "Enriched", class: "bg-blue-50 text-blue-700 border-blue-200" },
    scored: { label: "Scored", class: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    outreach_ready: { label: "Outreach Ready", class: "bg-orange-50 text-[#FF5A36] border-orange-200" },
    contacted: { label: "Contacted", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    disqualified: { label: "Disqualified", class: "bg-rose-50 text-rose-700 border-rose-200" },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lead Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor and audit all prospect accounts progressing through the autonomous qualification pipeline.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
          Showing <strong>{leads.length}</strong> active prospect records
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company, contact, or email..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 focus:border-[#FF5A36]"
          />
        </div>

        {/* Stage Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {["all", "qualified", "enriched", "outreach_ready", "disqualified"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStage(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStage === st
                  ? "bg-[#0B191E] text-white shadow-2xs"
                  : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              {st === "all" ? "All Stages" : st.replace("_", " ")}
            </button>
          ))}
        </div>

      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Company & Domain</th>
                <th className="py-3.5 px-6">Decision Maker</th>
                <th className="py-3.5 px-6">Industry & Size</th>
                <th className="py-3.5 px-6">ICP Score</th>
                <th className="py-3.5 px-6">Stage</th>
                <th className="py-3.5 px-6 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {leads.map((lead) => {
                const stageInfo = stageBadges[lead.stage] || {
                  label: lead.stage,
                  class: "bg-slate-100 text-slate-700",
                };

                return (
                  <tr
                    key={lead.id}
                    onClick={() => {
                      setSelectedLead(lead);
                      setIsDrawerOpen(true);
                    }}
                    className="hover:bg-orange-50/20 cursor-pointer transition-colors group"
                  >
                    {/* Company */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                        {lead.companyName}
                      </div>
                      <a
                        href={lead.website}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 mt-0.5"
                      >
                        {lead.website.replace("https://", "")} <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>

                    {/* Decision Maker */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">
                        {lead.contactName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {lead.contactTitle}
                      </div>
                    </td>

                    {/* Industry */}
                    <td className="py-4 px-6">
                      <div className="text-slate-800 font-medium">
                        {lead.industry}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {lead.employeeCount} employees &middot; {lead.location.split(",")[0]}
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-xs border ${
                            lead.score >= 85
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : lead.score >= 70
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {lead.score}%
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {lead.confidence}% conf
                        </span>
                      </div>
                    </td>

                    {/* Stage */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${stageInfo.class}`}
                      >
                        {stageInfo.label}
                      </span>
                    </td>

                    {/* Action Arrow */}
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <span>Audit Log</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Detail Drawer (Score Breakdown & Audit Logs) */}
      {isDrawerOpen && selectedLead && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Window */}
          <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedLead.companyName}
                  </h3>
                  <a
                    href={selectedLead.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#FF5A36] hover:underline flex items-center gap-0.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-500">
                  {selectedLead.industry} &middot; {selectedLead.employeeCount} employees &middot; {selectedLead.location}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Stage selector */}
                <select
                  value={selectedLead.stage}
                  onChange={(e) =>
                    handleStageChange(selectedLead.id, e.target.value as LeadStage)
                  }
                  className="text-xs font-bold rounded-xl border border-slate-200 px-3 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30"
                >
                  <option value="discovered">Discovered</option>
                  <option value="researching">Researching</option>
                  <option value="qualified">Qualified</option>
                  <option value="enriched">Enriched</option>
                  <option value="outreach_ready">Outreach Ready</option>
                  <option value="contacted">Contacted</option>
                  <option value="disqualified">Disqualified</option>
                </select>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body Scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* Score Breakdown Component (User Requirement) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  ICP Score Breakdown & Confidence
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Industry Match</span>
                    <span className="text-lg font-black text-slate-900">
                      {selectedLead.scoreBreakdown.industryMatch}%
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Company Size</span>
                    <span className="text-lg font-black text-slate-900">
                      {selectedLead.scoreBreakdown.companySize}%
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Tech Stack</span>
                    <span className="text-lg font-black text-slate-900">
                      {selectedLead.scoreBreakdown.techStack}%
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Intent Signals</span>
                    <span className="text-lg font-black text-slate-900">
                      {selectedLead.scoreBreakdown.intentSignals}%
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-950 text-xs block">
                      Overall Composite Score: {selectedLead.score}/100
                    </span>
                    <span className="text-[11px] text-emerald-800">
                      Model confidence level evaluated at {selectedLead.confidence}%
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white">
                    {selectedLead.score >= 80 ? "HIGH ICP FIT" : "QUALIFIED"}
                  </span>
                </div>
              </div>

              {/* Decision Maker & Contact Info */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Enriched Decision Maker
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Name & Title</span>
                    <span className="font-bold text-slate-900">{selectedLead.contactName}</span>
                    <span className="text-slate-500 block">{selectedLead.contactTitle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Verified Email</span>
                    <a href={`mailto:${selectedLead.contactEmail}`} className="font-semibold text-[#FF5A36] hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {selectedLead.contactEmail}
                    </a>
                    <span className="text-[10px] text-emerald-600 font-medium">✓ SMTP Verified deliverable</span>
                  </div>
                </div>
              </div>

              {/* Tech Stack & Intent Signals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Verified Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLead.technologies.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Active Intent Triggers
                  </h4>
                  <div className="space-y-1.5">
                    {selectedLead.intentSignals.map((sig, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-700 text-[11px] font-medium">
                        <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>{sig}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Audit Logs & Reasoning Chain (User Requirement) */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#FF5A36]" />
                    Autonomous Agent Audit Logs & Reasoning Chain
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {selectedLead.auditLogs.length} state checkpoints
                  </span>
                </div>

                <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedLead.auditLogs.map((log) => (
                    <div key={log.id} className="relative pl-8 space-y-1">
                      {/* Checkpoint indicator dot */}
                      <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#FF5A36] -translate-x-1/2" />

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">
                          {log.agentName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                            {log.confidence}% Confidence
                          </span>
                          <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                        </div>
                      </div>

                      {/* Reasoning paragraph */}
                      <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {log.reasoning}
                      </p>

                      {/* Citations if available */}
                      {log.citations && log.citations.length > 0 && (
                        <div className="pt-1 flex flex-wrap items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Citations:</span>
                          {log.citations.map((cite, i) => (
                            <a
                              key={i}
                              href={cite.startsWith("http") ? cite : "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-[#FF5A36] hover:underline inline-flex items-center gap-1 font-medium bg-orange-50/50 px-2 py-0.5 rounded border border-orange-200/50"
                            >
                              {cite.replace("https://", "")} <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleStageChange(selectedLead.id, "disqualified")}
                className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200"
              >
                Disqualify Lead
              </button>

              <button
                type="button"
                onClick={() => handleStageChange(selectedLead.id, "outreach_ready")}
                className="px-5 py-2 text-xs font-bold text-white bg-[#FF5A36] hover:bg-[#E84D2B] rounded-xl transition-colors shadow-xs"
              >
                Send to Outreach Queue
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
