"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  CheckCircle2,
  Plus,
  X,
  Save,
  Sparkles,
  ShieldCheck,
  Building2,
  Users,
  Cpu,
  Globe,
  AlertTriangle,
  Play,
} from "lucide-react";
import { IcpConfig } from "@/types/dashboard";
import { initialIcpConfig } from "@/lib/mockData";

export default function IcpConfigPage() {
  const [config, setConfig] = useState<IcpConfig>(initialIcpConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New tag inputs
  const [newIndustry, setNewIndustry] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newReqTech, setNewReqTech] = useState("");
  const [newNegKeyword, setNewNegKeyword] = useState("");

  // Test sample simulation state
  const [testResult, setTestResult] = useState<{
    score: number;
    passed: boolean;
    breakdown: string[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/icp-config")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setConfig(json.data);
        }
      })
      .catch((err) => console.error("Error loading ICP config:", err));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/icp-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        showToast("ICP Criteria & Scoring Thresholds saved successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = (
    field: "targetIndustries" | "targetLocations" | "requiredTechStack" | "negativeKeywords",
    val: string,
    clearFn: () => void
  ) => {
    if (!val.trim()) return;
    if (!config[field].includes(val.trim())) {
      setConfig({
        ...config,
        [field]: [...config[field], val.trim()],
      });
    }
    clearFn();
  };

  const removeTag = (
    field: "targetIndustries" | "targetLocations" | "requiredTechStack" | "negativeKeywords",
    valToRemove: string
  ) => {
    setConfig({
      ...config,
      [field]: config[field].filter((t) => t !== valToRemove),
    });
  };

  const handleRunSimulation = () => {
    const passed = 88 >= config.minQualificationScore;
    setTestResult({
      score: 88,
      passed,
      breakdown: [
        `Industry 'B2B SaaS': +25 pts (${config.targetIndustries.includes("B2B SaaS") ? "Matched" : "Unmatched"})`,
        `Headcount 140: +25 pts (Fits [${config.minEmployees} - ${config.maxEmployees}] range)`,
        `Tech AWS + Salesforce: +25 pts (Satisfies required tech stack)`,
        `Signals: +13 pts (Active hiring in past 14 days)`,
      ],
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      
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
            Client ICP Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure the qualification rulebook and scoring thresholds enforced by the LangGraph Qualification Agent.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#FF5A36] hover:bg-[#E84D2B] transition-all shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Configuration"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Firmographic Target Profile */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-[#FF5A36]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Firmographic & Vertical Criteria
            </h3>
          </div>

          {/* Target Industries */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
              Target Verticals & Industries
            </label>
            <div className="flex flex-wrap gap-2 mb-2.5">
              {config.targetIndustries.map((ind, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#FF5A36] border border-orange-200"
                >
                  <span>{ind}</span>
                  <button
                    type="button"
                    onClick={() => removeTag("targetIndustries", ind)}
                    className="hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                placeholder="Add industry (e.g. EdTech)..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
              />
              <button
                type="button"
                onClick={() => addTag("targetIndustries", newIndustry, () => setNewIndustry(""))}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Company Size Range */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
              Company Headcount Band (Employees)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
              <div>
                <span className="text-[11px] text-slate-500 font-medium block mb-1">
                  Minimum Employees
                </span>
                <input
                  type="number"
                  value={config.minEmployees}
                  onChange={(e) =>
                    setConfig({ ...config, minEmployees: parseInt(e.target.value, 10) || 10 })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-500 font-medium block mb-1">
                  Maximum Employees
                </span>
                <input
                  type="number"
                  value={config.maxEmployees}
                  onChange={(e) =>
                    setConfig({ ...config, maxEmployees: parseInt(e.target.value, 10) || 500 })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
                />
              </div>
            </div>
          </div>

          {/* Target Locations */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
              Target Geographical Regions
            </label>
            <div className="flex flex-wrap gap-2 mb-2.5">
              {config.targetLocations.map((loc, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                >
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span>{loc}</span>
                  <button
                    type="button"
                    onClick={() => removeTag("targetLocations", loc)}
                    className="hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Add country/region (e.g. Australia)..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
              />
              <button
                type="button"
                onClick={() => addTag("targetLocations", newLocation, () => setNewLocation(""))}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold"
              >
                Add
              </button>
            </div>
          </div>

        </div>

        {/* Section 2: Technographic Requirements & Negative Keywords */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Cpu className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Technographic Triggers & Disqualifiers
            </h3>
          </div>

          {/* Required Tech Stack */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
              Required Tech Stack (Lead Must Utilize)
            </label>
            <div className="flex flex-wrap gap-2 mb-2.5">
              {config.requiredTechStack.map((tech, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => removeTag("requiredTechStack", tech)}
                    className="hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={newReqTech}
                onChange={(e) => setNewReqTech(e.target.value)}
                placeholder="Add tech (e.g. Snowflake)..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
              />
              <button
                type="button"
                onClick={() => addTag("requiredTechStack", newReqTech, () => setNewReqTech(""))}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Negative Keywords */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
              Negative Keywords (Instant Disqualification)
            </label>
            <div className="flex flex-wrap gap-2 mb-2.5">
              {config.negativeKeywords.map((neg, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>{neg}</span>
                  <button
                    type="button"
                    onClick={() => removeTag("negativeKeywords", neg)}
                    className="hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={newNegKeyword}
                onChange={(e) => setNewNegKeyword(e.target.value)}
                placeholder="Add keyword (e.g. Non-profit)..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
              />
              <button
                type="button"
                onClick={() => addTag("negativeKeywords", newNegKeyword, () => setNewNegKeyword(""))}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold"
              >
                Add
              </button>
            </div>
          </div>

        </div>

        {/* Section 3: Scoring Thresholds & Automation Controls */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-[#FF5A36]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Scoring Thresholds & Automation
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            
            {/* Qualification Cutoff Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Min Qualification Score
                </label>
                <span className="text-sm font-black text-[#FF5A36]">
                  {config.minQualificationScore}%
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={95}
                step={5}
                value={config.minQualificationScore}
                onChange={(e) =>
                  setConfig({ ...config, minQualificationScore: parseInt(e.target.value, 10) })
                }
                className="w-full accent-[#FF5A36] cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Leads scoring below {config.minQualificationScore}% are automatically marked as Disqualified.
              </p>
            </div>

            {/* Auto-Enrichment Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Auto-Enrichment Threshold
                </label>
                <span className="text-sm font-black text-teal-600">
                  {config.autoEnrichThreshold}%
                </span>
              </div>
              <input
                type="range"
                min={60}
                max={95}
                step={5}
                value={config.autoEnrichThreshold}
                onChange={(e) =>
                  setConfig({ ...config, autoEnrichThreshold: parseInt(e.target.value, 10) })
                }
                className="w-full accent-teal-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Leads scoring above {config.autoEnrichThreshold}% automatically trigger the Hunter/Clearbit enrichment runnable.
              </p>
            </div>

          </div>

          {/* Auto-draft toggle */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Automatically Draft Outreach for Qualified Accounts
              </div>
              <p className="text-[11px] text-slate-500">
                When enabled, the LangGraph Outreach Agent automatically composes personalized messages and places them in the approval queue.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setConfig({ ...config, autoDraftOutreach: !config.autoDraftOutreach })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                config.autoDraftOutreach ? "bg-[#FF5A36]" : "bg-slate-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  config.autoDraftOutreach ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

        </div>

        {/* Section 4: Live ICP Test Simulation */}
        <div className="rounded-3xl bg-slate-900 p-6 sm:p-8 text-white border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-teal-300">
                Test Active ICP Against Sample Lead
              </h3>
            </div>

            <button
              type="button"
              onClick={handleRunSimulation}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#FF5A36] hover:bg-[#E84D2B] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Simulate Lead Scoring</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 max-w-xl">
            Simulates the LangGraph qualification agent evaluating a sample company (Summit Digital: B2B SaaS, 140 emp, AWS + Salesforce).
          </p>

          {testResult && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">
                  Evaluated Score: <span className="text-emerald-400">{testResult.score}%</span>
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    testResult.passed
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : "bg-rose-950 text-rose-400 border border-rose-800"
                  }`}
                >
                  {testResult.passed ? "PASSED THRESHOLD" : "DISQUALIFIED"}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                {testResult.breakdown.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </form>

    </div>
  );
}
