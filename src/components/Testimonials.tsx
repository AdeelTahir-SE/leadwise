"use client";

import React from "react";
import Image from "next/image";
import { Star, Quote, Sparkles } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Head of Sales",
      company: "Acme Tech",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
      quote:
        "Leadwise has completely changed our outbound strategy. We're getting significantly higher quality leads with way less manual prospecting. Our reply rate jumped 3.4x in the first month.",
    },
    {
      name: "James Carter",
      role: "Chief Revenue Officer",
      company: "Summit Digital",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      quote:
        "The AI agents save our SDR team over 20 hours every single week. The leads delivered are genuinely relevant, perfectly matched to our ICP, and ready for immediate outreach.",
    },
    {
      name: "Emily Rodriguez",
      role: "VP of Growth Marketing",
      company: "ForgeLab",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      quote:
        "Finally, a lead gen tool that deeply understands nuanced B2B qualification criteria. The technographic enrichment and live hiring intent signals are exceptionally accurate.",
    },
  ];

  const clientLogos = [
    "Stripe",
    "Notion",
    "Spotify",
    "Dropbox",
    "Figma",
    "HubSpot",
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A36]">
              Customer Stories
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Real Teams. Real Results.
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            See how modern revenue teams use Leadwise to generate qualified pipeline on autopilot.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-50/60 rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between hover:bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="pt-4 border-t border-slate-200/60 flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-orange-200 shrink-0">
                  <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {t.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Logos Bar */}
        <div className="mt-16 pt-12 border-t border-slate-100 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-8">
            Powering outbound sales for high-growth tech innovators
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-50 grayscale hover:grayscale-0 transition-all">
            {clientLogos.map((logo, i) => (
              <span
                key={i}
                className="text-lg sm:text-xl font-black tracking-tight text-slate-800 hover:text-[#FF5A36] transition-colors"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
