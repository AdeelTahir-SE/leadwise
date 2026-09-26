export type LeadStage =
  | "discovered"
  | "researching"
  | "qualified"
  | "enriched"
  | "scored"
  | "outreach_ready"
  | "contacted"
  | "disqualified";

export interface AuditLog {
  id: string;
  step: "research" | "qualification" | "enrichment" | "scoring" | "outreach";
  agentName: string;
  reasoning: string;
  confidence: number; // 0 - 100
  citations?: string[];
  timestamp: string;
}

export interface ScoreBreakdown {
  industryMatch: number; // 0 - 100
  companySize: number;
  techStack: number;
  intentSignals: number;
  overallScore: number;
}

export interface Lead {
  id: string;
  companyName: string;
  website: string;
  industry: string;
  employeeCount: number;
  location: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactLinkedin?: string;
  stage: LeadStage;
  score: number;
  confidence: number;
  scoreBreakdown: ScoreBreakdown;
  technologies: string[];
  intentSignals: string[];
  auditLogs: AuditLog[];
  createdAt: string;
  updatedAt: string;
}

export interface OutreachDraft {
  id: string;
  leadId: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactTitle: string;
  channel: "email" | "linkedin";
  subject: string;
  body: string;
  personalizedHook: string;
  signalsCited: string[];
  status: "pending_approval" | "approved" | "rejected" | "sent";
  generatedAt: string;
}

export interface IcpConfig {
  id: string;
  targetIndustries: string[];
  minEmployees: number;
  maxEmployees: number;
  targetLocations: string[];
  requiredTechStack: string[];
  preferredTechStack: string[];
  negativeKeywords: string[];
  minQualificationScore: number; // e.g. 75
  autoEnrichThreshold: number; // e.g. 80
  autoDraftOutreach: boolean;
  updatedAt: string;
}

export interface PipelineMetrics {
  leadsPerHour: number;
  qualificationRate: number; // percentage e.g. 78.4
  totalLeadsDiscovered: number;
  totalQualified: number;
  totalEnriched: number;
  totalOutreachPending: number;
  activeAgentRuns: number;
  throughputHistory: {
    hour: string;
    discovered: number;
    qualified: number;
  }[];
  stageDistribution: {
    stage: LeadStage;
    label: string;
    count: number;
    color: string;
  }[];
  recentActivity: {
    id: string;
    type: "lead_discovered" | "lead_qualified" | "outreach_generated" | "agent_alert";
    title: string;
    description: string;
    time: string;
  }[];
}
