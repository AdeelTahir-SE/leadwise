"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Globe, Cpu, Target, CheckCircle2, Sparkles, X } from "lucide-react";
import RobotMascot from "./RobotMascot";

export default function HeroSection() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-orange-50/30 via-white to-slate-50/50">
      {/* Background radial decorations */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-200/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-teal-200/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column: Exact copy & typography from design-one.png */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* AI-POWERED LEAD GENERATION Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-orange-50/90 border border-orange-200/80 shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF5A36]"></span>
              </span>
              <span className="text-xs font-bold tracking-wide uppercase text-[#FF5A36]">
                AI-Powered Lead Generation
              </span>
            </div>

            {/* Headline matching design-one.png */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Find. Qualify. Enrich.{" "}
              <span className="text-[#FF5A36] block sm:inline">On Autopilot.</span>
            </h1>

            {/* Subtitle matching design-one.png */}
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Leadwise is an AI-powered lead generation system that autonomously
              discovers, qualifies, and enriches sales leads without manual
              prospecting.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-base font-semibold text-white bg-[#FF5A36] hover:bg-[#E84D2B] transition-all shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Start for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setDemoModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-xs hover:shadow-sm hover:-translate-y-0.5"
              >
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[#FF5A36]">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-4 flex items-center gap-4 border-t border-slate-100">
              <div className="flex -space-x-2.5 overflow-hidden">
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-200 overflow-hidden relative shadow-xs">
                  <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User 1" fill className="object-cover" />
                </div>
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-200 overflow-hidden relative shadow-xs">
                  <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="User 2" fill className="object-cover" />
                </div>
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-200 overflow-hidden relative shadow-xs">
                  <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="User 3" fill className="object-cover" />
                </div>
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-200 overflow-hidden relative shadow-xs">
                  <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="User 4" fill className="object-cover" />
                </div>
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-200 overflow-hidden relative shadow-xs">
                  <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" alt="User 5" fill className="object-cover" />
                </div>
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-800">Trusted by 2,500+ teams</p>
                <p className="text-slate-500 text-xs">From startups to enterprises</p>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Visual composition from design-one.png */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* Center Robot with surrounding visual cards */}
            <div className="relative w-full max-w-lg min-h-[460px] flex items-center justify-center">
              
              {/* Center Robot Mascot */}
              <div className="relative z-10 -mt-10 sm:-mt-12">
                <RobotMascot size={260} />
              </div>

              {/* Floating Pill 1: Searches the web & social profiles (Top Left) */}
              <div className="absolute -top-3 left-0 sm:left-4 z-20 animate-float bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl py-2 px-3.5 shadow-lg shadow-slate-200/50 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0B191E] flex items-center justify-center text-teal-300 shadow-xs">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    Searches the web
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    & social profiles
                  </p>
                </div>
              </div>

              {/* Floating Pill 2: Analyzes ICP fit with LLMs (Top Right) */}
              <div className="absolute top-2 right-0 sm:right-2 z-20 animate-float-delayed bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl py-2 px-3.5 shadow-lg shadow-slate-200/50 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0B191E] flex items-center justify-center text-cyan-300 shadow-xs">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    Analyzes ICP fit
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    with LLMs
                  </p>
                </div>
              </div>

              {/* Floating Pill 3: Finds qualified leads automatically (Right Center) */}
              <div className="absolute top-36 -right-2 sm:right-0 z-20 animate-float bg-white/95 backdrop-blur-md border border-orange-200/80 rounded-2xl py-2 px-3.5 shadow-lg shadow-orange-100/50 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF5A36] shadow-xs">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    Finds qualified
                  </p>
                  <p className="text-[10px] text-orange-600 font-medium leading-tight">
                    leads automatically
                  </p>
                </div>
              </div>

              {/* Floating "Qualified Leads" Card (Bottom Center / Right, from design-one.png) */}
              <div className="absolute -bottom-6 left-2 sm:left-12 right-2 sm:right-6 z-20 bg-white/95 backdrop-blur-lg border border-slate-200/80 rounded-2xl p-4 shadow-xl shadow-slate-300/40">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Qualified Leads
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-[10px] font-semibold text-teal-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                    Live stream
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Lead 1: Acme Inc. */}
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-700 font-bold text-xs flex items-center justify-center border border-teal-200">
                        A
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">
                          Acme Inc.
                        </div>
                        <div className="text-[11px] text-slate-500 leading-tight">
                          SaaS · 200–500 · React
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      High Fit
                    </span>
                  </div>

                  {/* Lead 2: BrightLab */}
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                        B
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">
                          BrightLab
                        </div>
                        <div className="text-[11px] text-slate-500 leading-tight">
                          FinTech · 50–200 · AWS
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      High Fit
                    </span>
                  </div>

                  {/* Lead 3: NovaTech */}
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-700 font-bold text-xs flex items-center justify-center border border-amber-200">
                        N
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-tight">
                          NovaTech
                        </div>
                        <div className="text-[11px] text-slate-500 leading-tight">
                          HealthTech · 100–500 · GCP
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
                      Medium Fit
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Demo Video Modal */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF5A36]" />
                <h3 className="font-bold text-slate-900 text-sm">Leadwise Product Demo</h3>
              </div>
              <button
                onClick={() => setDemoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content - Live interactive video mockup */}
            <div className="p-6 space-y-4">
              <div className="aspect-video w-full rounded-2xl bg-[#0B191E] flex flex-col items-center justify-center text-white relative overflow-hidden p-6 border border-slate-800">
                <div className="w-16 h-16 rounded-full bg-[#FF5A36] flex items-center justify-center shadow-lg shadow-orange-500/40 mb-4 animate-bounce">
                  <Play className="w-8 h-8 fill-current ml-1 text-white" />
                </div>
                <h4 className="text-xl font-bold">Watch Autonomous Lead Prospecting</h4>
                <p className="text-slate-400 text-sm max-w-md text-center mt-2">
                  See how Leadwise reads websites, verifies ICP criteria, extracts intent signals, and populates your CRM in seconds.
                </p>
                <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Multi-Source Discovery</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 92%+ ICP Precision</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Direct CRM Push</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDemoModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                <Link
                  href="/signup"
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#FF5A36] hover:bg-[#E84D2B] rounded-xl shadow-xs"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
