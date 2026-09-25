import { NextRequest, NextResponse } from "next/server";
import { initialLeads } from "@/lib/mockData";
import { Lead } from "@/types/dashboard";

// In-memory store for dev demo session
let leadsStore: Lead[] = [...initialLeads];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();
  const stage = searchParams.get("stage");
  const minScore = searchParams.get("minScore");

  let filtered = [...leadsStore];

  if (search) {
    filtered = filtered.filter(
      (l) =>
        l.companyName.toLowerCase().includes(search) ||
        l.contactName.toLowerCase().includes(search) ||
        l.industry.toLowerCase().includes(search) ||
        l.contactEmail.toLowerCase().includes(search)
    );
  }

  if (stage && stage !== "all") {
    filtered = filtered.filter((l) => l.stage === stage);
  }

  if (minScore) {
    const scoreVal = parseInt(minScore, 10);
    if (!isNaN(scoreVal)) {
      filtered = filtered.filter((l) => l.score >= scoreVal);
    }
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    data: filtered,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      companyName: body.companyName || "Sample New Account",
      website: body.website || "https://example.com",
      industry: body.industry || "B2B SaaS",
      employeeCount: body.employeeCount || 100,
      location: body.location || "San Francisco, CA",
      contactName: body.contactName || "Decision Maker",
      contactTitle: body.contactTitle || "Head of Revenue",
      contactEmail: body.contactEmail || "contact@example.com",
      stage: "researching",
      score: 85,
      confidence: 90,
      scoreBreakdown: {
        industryMatch: 90,
        companySize: 85,
        techStack: 80,
        intentSignals: 85,
        overallScore: 85,
      },
      technologies: ["AWS", "React"],
      intentSignals: ["New lead manually submitted for agent verification"],
      auditLogs: [
        {
          id: `log_${Date.now()}`,
          step: "research",
          agentName: "Research Agent (Manual Ingestion Trigger)",
          reasoning: "Lead added to ingestion queue. Initiating automated web crawler.",
          confidence: 90,
          timestamp: "Just now",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    leadsStore.unshift(newLead);

    return NextResponse.json({
      success: true,
      data: newLead,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
