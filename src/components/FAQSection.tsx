"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles, MessageSquare } from "lucide-react";
import RobotMascot from "./RobotMascot";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does Leadwise find leads?",
      a: "Leadwise uses autonomous web-crawling agents that systematically analyze live company homepages, tech documentations, business registries, news feeds, and professional networks to locate accounts matching your specific ICP parameters.",
    },
    {
      q: "What makes Leadwise different from other tools?",
      a: "Traditional lead providers sell outdated, static databases that often result in high bounce rates. Leadwise crawls the live web on demand, verifies current tech stacks and hiring intent in real-time, and uses LLMs to score nuanced qualitative fit.",
    },
    {
      q: "Can I set custom ICP criteria?",
      a: "Yes! You can define custom rules based on industry verticals, company headcount, revenue tiers, geographical presence, specific technology stacks (e.g. AWS, React, Snowflake), and explicit buying intent triggers.",
    },
    {
      q: "How accurate is the qualification?",
      a: "Our multi-layer verification checks result in over 92% ICP precision and less than 3% email bounce rates. Every contact email is tested for MX record validity and SMTP ping deliverability before being added to your pipeline.",
    },
    {
      q: "What integrations are available?",
      a: "Leadwise integrates natively with Salesforce, HubSpot, Outreach, Salesloft, Pipedrive, Slack, and Google Sheets. You can also configure Webhooks and Zapier workflows to push leads anywhere.",
    },
    {
      q: "Is there a free trial?",
      a: "Yes! You can sign up for our 14-day free trial without entering a credit card. You'll receive complimentary discovery credits to test our autonomous agent and export verified leads immediately.",
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 bg-slate-50/60 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A36]">
              FAQ
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Everything you need to know about Leadwise and our autonomous lead generation agents.
          </p>
        </div>

        {/* 2-Column: Accordion on Left, Support Card on Right (Matching design-three) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Accordion (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-[#FF5A36] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#FF5A36]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: "Still have questions?" Card with Robot Mascot (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-40 h-40 flex items-center justify-center -mb-2">
              <RobotMascot size={150} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mb-6">
              Can&apos;t find the answer you&apos;re looking for? Our product specialists and AI engineering team are here to help.
            </p>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-[#FF5A36] hover:bg-[#E84D2B] transition-all shadow-sm hover:shadow-md hover:shadow-orange-500/20"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
