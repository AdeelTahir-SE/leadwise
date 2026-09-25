"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  Mail,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  Zap,
  Edit3,
  Check,
  Clock,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { OutreachDraft } from "@/types/dashboard";
import { initialOutreachDrafts } from "@/lib/mockData";

function LinkedInIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export default function OutreachApprovalPage() {
  const [drafts, setDrafts] = useState<OutreachDraft[]>(initialOutreachDrafts);
  const [selectedDraft, setSelectedDraft] = useState<OutreachDraft | null>(
    initialOutreachDrafts[0]
  );
  const [subject, setSubject] = useState(initialOutreachDrafts[0]?.subject || "");
  const [body, setBody] = useState(initialOutreachDrafts[0]?.body || "");
  const [channel, setChannel] = useState<"email" | "linkedin">(
    initialOutreachDrafts[0]?.channel || "email"
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDraft) {
      setSubject(selectedDraft.subject);
      setBody(selectedDraft.body);
      setChannel(selectedDraft.channel);
    }
  }, [selectedDraft]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = async () => {
    if (!selectedDraft) return;
    setIsSaving(true);

    try {
      const res = await fetch(`/api/outreach/${selectedDraft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "approved",
          subject,
          body,
          channel,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDrafts((prev) =>
          prev.map((d) => (d.id === selectedDraft.id ? { ...d, status: "approved" } : d))
        );
        setSelectedDraft({ ...selectedDraft, status: "approved" });
        showToast(`Draft for ${selectedDraft.contactName} approved and queued for dispatch!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDraft) return;
    setIsSaving(true);
    try {
      await fetch(`/api/outreach/${selectedDraft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      setDrafts((prev) =>
        prev.map((d) => (d.id === selectedDraft.id ? { ...d, status: "rejected" } : d))
      );
      setSelectedDraft({ ...selectedDraft, status: "rejected" });
      showToast(`Draft for ${selectedDraft.contactName} marked as rejected.`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = () => {
    if (!selectedDraft) return;
    setIsSaving(true);
    setTimeout(() => {
      const regeneratedBody = `Hi ${selectedDraft.contactName.split(" ")[0]},

Saw that ${selectedDraft.companyName} is actively accelerating outbound prospecting. Given your recent growth signals and tech infrastructure, Leadwise can automate your lead qualification and pipeline generation on autopilot.

Would you be open to a quick 5-minute preview of target buyer accounts we mapped out for your team?

Best,
The Leadwise Outbound Team`;

      setBody(regeneratedBody);
      setIsSaving(false);
      showToast("Draft regenerated using updated LLM prompt context!");
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0B191E] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Outreach Approval Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Human-in-the-loop review queue for AI-generated personalized messaging before outbound dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["all", "pending_approval", "approved", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? "bg-[#0B191E] text-white shadow-2xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {st === "all" ? "All Drafts" : st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Queue on Left (5 cols), Editor & Grounded Context on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Drafts Queue (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="px-2 pb-2 border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Pending Approval Queue
            </span>
            <span className="text-slate-400">
              {drafts.filter((d) => d.status === "pending_approval").length} awaiting review
            </span>
          </div>

          <div className="space-y-2.5">
            {drafts
              .filter((d) => statusFilter === "all" || d.status === statusFilter)
              .map((draft) => {
                const isSelected = selectedDraft?.id === draft.id;
                return (
                  <div
                    key={draft.id}
                    onClick={() => setSelectedDraft(draft)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-orange-50/50 border-[#FF5A36] shadow-xs"
                        : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">
                          {draft.contactName}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {draft.contactTitle} &middot; {draft.companyName}
                        </p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          draft.status === "pending_approval"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : draft.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {draft.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 italic font-medium">
                      &ldquo;{draft.subject}&rdquo;
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        {draft.channel === "email" ? (
                          <Mail className="w-3 h-3 text-[#FF5A36]" />
                        ) : (
                          <LinkedInIcon className="w-3 h-3 text-blue-600" />
                        )}
                        {draft.channel.toUpperCase()}
                      </span>
                      <span>Generated {draft.generatedAt}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right Column: Review & Edit Pane (7 cols) */}
        {selectedDraft ? (
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            
            {/* Grounded Context Header (Citing reason & signals) */}
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-teal-900">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Grounded AI Reasoning & Intent Context
              </div>
              <p className="text-xs text-teal-900 leading-relaxed font-medium">
                {selectedDraft.personalizedHook}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedDraft.signalsCited.map((sig, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-teal-800 border border-teal-200"
                  >
                    <Zap className="w-2.5 h-2.5 text-amber-500" /> {sig}
                  </span>
                ))}
              </div>
            </div>

            {/* Channel and Subject Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                  Outreach Channel
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel("email")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      channel === "email"
                        ? "bg-[#0B191E] text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Mail className="w-3 h-3" /> Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel("linkedin")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      channel === "linkedin"
                        ? "bg-[#0B191E] text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <LinkedInIcon className="w-3 h-3 text-blue-500" /> LinkedIn InMail
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 focus:border-[#FF5A36]"
                />
              </div>

              {/* Message Body Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider">
                    Message Body (Personalized Draft)
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5A36] hover:text-[#E84D2B]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate with AI</span>
                  </button>
                </div>
                <textarea
                  rows={9}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 focus:border-[#FF5A36] bg-slate-50/30"
                />
              </div>
            </div>

            {/* Recipient Snapshot */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Dispatch Target: <strong>{selectedDraft.contactName}</strong> ({selectedDraft.contactEmail})
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                Ready for SMTP Relay
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleReject}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
              >
                Reject & Discard
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF5A36] hover:bg-[#E84D2B] transition-all shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Approve & Dispatch"}</span>
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
            Select a draft from the queue to review and approve.
          </div>
        )}

      </div>

    </div>
  );
}
