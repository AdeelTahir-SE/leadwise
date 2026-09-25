"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Send,
  Sliders,
  Play,
  Bell,
  Search,
  CheckCircle2,
  Sparkles,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [ingestModalOpen, setIngestModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navLinks = [
    {
      label: "CRM Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "Lead Management",
      href: "/dashboard/leads",
      icon: Users,
      badge: "5",
    },
    {
      label: "Outreach Approval",
      href: "/dashboard/outreach",
      icon: Send,
      badge: "2",
      badgeColor: "bg-[#FF5A36] text-white",
    },
    {
      label: "Client ICP Config",
      href: "/dashboard/icp",
      icon: Sliders,
      badge: null,
    },
  ];

  const handleQuickIngest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: newCompanyName,
        website: newWebsite,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setIsSubmitting(false);
        setIngestModalOpen(false);
        setNewCompanyName("");
        setNewWebsite("");
        window.location.reload();
      })
      .catch(() => setIsSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0B191E] text-slate-300 border-r border-slate-800 shrink-0">
        
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF5A36] flex items-center justify-center text-white font-black text-base shadow-sm">
              L
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Leadwise
            </span>
          </Link>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800/50">
            CRM
          </span>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Core Modules
          </div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#FF5A36] text-white shadow-sm shadow-orange-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.badgeColor || (isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300")
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Quick Action Button */}
          <div className="pt-6 px-1">
            <button
              type="button"
              onClick={() => setIngestModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-500/20 to-teal-400/10 hover:from-teal-500/30 hover:to-teal-400/20 border border-teal-500/30 text-teal-300 text-xs font-bold transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>+ Trigger Agent Run</span>
            </button>
          </div>
        </div>

        {/* Bottom AI Status & User Profile */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          {/* Active AI Agent Status Card */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LangGraph Pipeline
              </span>
              <span className="text-[10px] text-teal-400 font-semibold">Active</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              4 autonomous sub-agents currently scraping & scoring.
            </p>
          </div>

          {/* User Profile */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-[#FF5A36] font-bold text-xs flex items-center justify-center border border-orange-500/40">
                JD
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">Jane Doe</div>
                <div className="text-[10px] text-slate-400">Head of Growth</div>
              </div>
            </div>
            <Link
              href="/"
              title="Return to Landing Page"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/90 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads, domains, or intent signals..."
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF5A36]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Throughput: <strong>48 leads/hr</strong></span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              type="button"
              onClick={() => setIngestModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#FF5A36] hover:bg-[#E84D2B] transition-colors shadow-xs"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Run Agent</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-64 bg-[#0B191E] text-slate-300 p-4 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FF5A36] flex items-center justify-center text-white font-black text-base">
                    L
                  </div>
                  <span className="text-lg font-bold text-white">Leadwise</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                      pathname === item.href
                        ? "bg-[#FF5A36] text-white"
                        : "text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-900 text-xs font-semibold text-slate-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit to Homepage</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Ingest Modal */}
      {ingestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF5A36]" />
                <h3 className="font-bold text-sm text-slate-900">Trigger Autonomous Agent Run</h3>
              </div>
              <button
                onClick={() => setIngestModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickIngest} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Target Company Name
                </label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="e.g. Acme Health Technologies"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Website / Domain URL
                </label>
                <input
                  type="url"
                  required
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30"
                />
              </div>

              <p className="text-[11px] text-slate-500">
                The Research & Qualification LangGraph agent will scrape this domain, score against your active ICP, verify contacts, and draft outreach.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIngestModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FF5A36] hover:bg-[#E84D2B] rounded-xl shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Dispatching..." : "Start Agent Run"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
