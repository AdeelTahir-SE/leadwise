from typing import TypedDict, Optional, Literal, List
from pydantic import BaseModel

class SourcedFact(BaseModel):
    value: str
    source_url: str
    confidence: float

class LeadCandidate(BaseModel):
    company_name: str
    domain: str
    size_estimate: Optional[str]
    industry: Optional[str]
    key_people: List[str]
    recent_news: List[SourcedFact]
    hiring_signals: List[SourcedFact]

class QualificationResult(BaseModel):
    qualified: bool
    reasons: List[str]
    confidence: float          # if < 0.6 → human review queue
    missing_fields: List[str]

class EnrichedLead(BaseModel):
    email: Optional[str]
    linkedin_url: Optional[str]
    tech_stack: List[str]
    enrichment_incomplete: bool = False

class ScoreResult(BaseModel):
    score: int                 # 0–100
    score_breakdown: dict
    priority_tier: Literal["hot", "warm", "cold"]

class OutreachDraft(BaseModel):
    subject: str
    body: str
    human_approval_required: bool = True

class LeadState(TypedDict):
    # Input
    run_id: str
    icp_config: dict
    target_query: str          # e.g. "B2B SaaS companies in fintech, 50-200 employees"

    # Pipeline stages (filled progressively)
    candidate: Optional[LeadCandidate]
    qualification: Optional[QualificationResult]
    enriched: Optional[EnrichedLead]
    score: Optional[ScoreResult]
    draft: Optional[OutreachDraft]

    # Control flow
    qualified: bool
    needs_human_review: bool
    pipeline_stage: str        # for observability
    error: Optional[str]

    # Budget tracking
    tokens_used: int
    api_calls_used: int
    budget_config: dict        # { max_tokens, max_api_calls, max_seconds }
