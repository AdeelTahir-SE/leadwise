"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Target,
  Send,
  Zap,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Bot,
  Sparkles,
  BarChart3,
  Layers,
} from "lucide-react";
import { PipelineMetrics } from "@/types/dashboard";
import { initialMetrics } from "@/lib/mockData";

export default function CrmDashboardPage() {
  const [metrics, setMetrics] = useState<PipelineMetrics>(initialMetrics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setMetrics(json.data);
        }
      })
      .catch((err) => console.error("Failed to load metrics:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pipeline Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time telemetry from your LangGraph autonomous lead generation engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/outreach"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF5A36] hover:bg-[#E84D2B] transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Review Drafts ({metrics.totalOutreachPending})</span>
          </Link>
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Leads / Hour */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Throughput
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#FF5A36]">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {metrics.leadsPerHour}
            </span>
            <span className="text-xs font-medium text-slate-500">leads / hr</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% vs yesterday</span>
          </div>
        </div>

        {/* KPI 2: Qualification Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Qualification Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {metrics.qualificationRate}%
            </span>
            <span className="text-xs font-medium text-slate-500">ICP match</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>978 of 1,248 qualified</span>
          </div>
        </div>

        {/* KPI 3: Active Agent Runs */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Agent Orchestration
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {metrics.activeAgentRuns}
            </span>
            <span className="text-xs font-medium text-slate-500">runs active</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Research &rarr; Enrich &rarr; Score</span>
          </div>
        </div>

        {/* KPI 4: Pending Outreach */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Outreach Approval
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {metrics.totalOutreachPending}
            </span>
            <span className="text-xs font-medium text-slate-500">pending review</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-orange-600 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Avg approval time: 3.2m</span>
          </div>
        </div>

      </div>

      {/* Main Charts & Telemetry Grid (8 cols / 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Hourly Pipeline Throughput Chart & Funnel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Throughput Bar Chart */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#FF5A36]" />
                  Hourly Pipeline Throughput (Leads/Hour)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison between raw discovered leads and ICP qualified leads
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" /> Discovered
                </span>
                <span className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FF5A36]" /> Qualified
                </span>
              </div>
            </div>

            {/* Visual Bars */}
            <div className="pt-6">
              <div className="grid grid-cols-8 gap-3 sm:gap-4 items-end h-56 pb-6 border-b border-slate-100">
                {metrics.throughputHistory.map((item, i) => {
                  const maxVal = 70;
                  const discHeight = `${(item.discovered / maxVal) * 100}%`;
                  const qualHeight = `${(item.qualified / maxVal) * 100}%`;
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1 h-full">
                        {/* Discovered bar */}
                        <div
                          style={{ height: discHeight }}
                          className="w-1/2 max-w-[14px] bg-slate-200 rounded-t-md group-hover:bg-slate-300 transition-all relative"
                          title={`Discovered: ${item.discovered}`}
                        />
                        {/* Qualified bar */}
                        <div
                          style={{ height: qualHeight }}
                          className="w-1/2 max-w-[14px] bg-[#FF5A36] rounded-t-md group-hover:bg-[#E84D2B] transition-all relative shadow-xs"
                          title={`Qualified: ${item.qualified}`}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {item.hour}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Peak processing: <strong>14:00 (62 leads discovered)</strong></span>
                <span className="text-emerald-600 font-semibold">Average conversion efficiency: 77.8%</span>
              </div>
            </div>
          </div>

          {/* Pipeline Stage Distribution Funnel */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                Pipeline Stage Distribution
              </h3>
              <span className="text-xs text-slate-400">Total 1,248 accounts</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {metrics.stageDistribution.map((st, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                    <span className="text-[11px] font-bold text-slate-600">{st.label}</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {st.count}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {((st.count / metrics.totalLeadsDiscovered) * 100).toFixed(1)}% of total
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 4 Cols: Live Autonomous Agent Stream */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF5A36]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Live Agent Stream
                  </h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="space-y-4">
                {metrics.recentActivity.map((act) => (
                  <div key={act.id} className="flex gap-3 text-xs">
                    <div className="w-7 h-7 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#FF5A36] shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 leading-tight">
                        {act.title}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {act.description}
                      </p>
                      <span className="text-[10px] text-slate-400 block">
                        {act.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <Link
                href="/dashboard/icp"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <span>Tune Qualification Thresholds</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Health Status Card */}
          <div className="rounded-3xl bg-[#0B191E] p-6 text-white border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 uppercase font-bold tracking-wider">
                System Reliability
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                100% Healthy
              </span>
            </div>
            <div className="text-lg font-bold">Postgres & LangGraph Checkpointer</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              pgvector similarity indexing active with state rollback checkpoints intact.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
