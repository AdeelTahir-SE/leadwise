"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, CheckCircle2, Bot, Sparkles } from "lucide-react";
import RobotMascot from "@/components/RobotMascot";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Demo login submitted for " + email);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      
      {/* Left Column: Dark Branded Canvas (Section 10 from design-three) */}
      <div className="lg:w-1/2 bg-[#0B191E] p-8 lg:p-14 text-white flex flex-col justify-between relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Back Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#FF5A36] flex items-center justify-center text-white font-black text-lg">
              L
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Leadwise</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Center Graphic */}
        <div className="relative z-10 my-12 flex flex-col items-center text-center">
          <div className="w-56 h-56 flex items-center justify-center mb-6">
            <RobotMascot size={220} />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            AI Lead Engine 24/7
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold max-w-md">
            Find high-intent leads on autopilot.
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-sm mt-2 leading-relaxed">
            Continuous discovery, LLM qualification, and verified enrichment ready for your sales pipeline.
          </p>

          <div className="mt-8 flex items-center gap-5 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 92%+ ICP Fit
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Live Data Sync
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1-Click Push
            </span>
          </div>
        </div>

        {/* Bottom stats note */}
        <div className="relative z-10 text-xs text-slate-500 text-center lg:text-left">
          &copy; {new Date().getFullYear()} Leadwise Technologies, Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Authentication Card */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-50/50">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl shadow-slate-200/50">
          
          {/* Top Auth Mode Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-8">
            <span className="py-2 text-xs font-bold text-center rounded-lg bg-white text-slate-900 shadow-xs">
              Log In
            </span>
            <Link
              href="/signup"
              className="py-2 text-xs font-bold text-center rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Log in to your account and continue finding your next best leads.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 focus:border-[#FF5A36] transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Password reset instructions sent to your email.");
                  }}
                  className="text-xs font-semibold text-[#FF5A36] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/30 focus:border-[#FF5A36] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#FF5A36] hover:bg-[#E84D2B] transition-all shadow-md shadow-orange-500/25 active:scale-[0.99] disabled:opacity-70 mt-2"
            >
              {isLoading ? "Signing in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400 font-medium">
                or continue with
              </span>
            </div>
          </div>

          {/* Google SSO Button ONLY (User requested: keep only email and google one not microsoft one) */}
          <button
            type="button"
            onClick={() => alert("Google SSO authentication triggered.")}
            className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-sm font-semibold text-slate-700 shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Toggle to Sign Up */}
          <div className="mt-8 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-[#FF5A36] hover:underline"
            >
              Sign up
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
