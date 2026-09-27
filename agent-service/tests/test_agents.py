import pytest
import sys
import os

# Add agent-service directory to sys.path so imports resolve seamlessly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from graph.state import LeadState, LeadCandidate, QualificationResult, ScoreResult, EnrichedLead, SourcedFact
from tools.search import perform_web_search
from tools.scraper import scrape_url
from tools.enrichment_tools import find_contact_email, fetch_company_tech_stack
from agents.research import ResearchAgent
from agents.qualification import QualificationAgent
from agents.enrichment import EnrichmentAgent
from agents.scoring import ScoringAgent
from agents.outreach import OutreachAgent
from graph.graph import app

@pytest.mark.asyncio
async def test_search_tool():
    results = await perform_web_search("B2B SaaS fintech companies", max_results=3)
    assert isinstance(results, list)
    assert len(results) > 0
    assert "url" in results[0]
    assert "snippet" in results[0]

@pytest.mark.asyncio
async def test_scraper_tool():
    scraped = await scrape_url("https://example.com")
    assert isinstance(scraped, dict)
    assert scraped["url"] == "https://example.com"
    assert "text" in scraped

@pytest.mark.asyncio
async def test_enrichment_tools():
    email_info = await find_contact_email("acmecorp.com", "Jane Doe")
    assert "email" in email_info
    assert "acmecorp.com" in email_info["email"]

    tech_info = await fetch_company_tech_stack("acmecorp.com")
    assert "tech_stack" in tech_info
    assert isinstance(tech_info["tech_stack"], list)

@pytest.mark.asyncio
async def test_research_agent():
    agent = ResearchAgent()
    initial_state: LeadState = {
        "run_id": "test_run_1",
        "icp_config": {"target_industry": "SaaS"},
        "target_query": "B2B SaaS companies in fintech",
        "candidate": None,
        "qualification": None,
        "enriched": None,
        "score": None,
        "draft": None,
        "qualified": False,
        "needs_human_review": False,
        "pipeline_stage": "init",
        "error": None,
        "tokens_used": 0,
        "api_calls_used": 0,
        "budget_config": {}
    }

    res = await agent.run(initial_state)
    assert "candidate" in res
    candidate = res["candidate"]
    assert isinstance(candidate, LeadCandidate)
    assert candidate.company_name != ""
    assert len(candidate.recent_news) > 0
    assert candidate.recent_news[0].source_url != ""

@pytest.mark.asyncio
async def test_qualification_agent():
    agent = QualificationAgent()
    candidate = LeadCandidate(
        company_name="PayFlow Tech",
        domain="payflowtech.com",
        size_estimate="100-200",
        industry="SaaS",
        key_people=["Sarah Jenkins (CEO)"],
        recent_news=[],
        hiring_signals=[]
    )
    state: LeadState = {
        "run_id": "test_run_2",
        "icp_config": {"target_industry": "SaaS", "target_size": "50-500"},
        "target_query": "B2B SaaS",
        "candidate": candidate,
        "qualification": None,
        "enriched": None,
        "score": None,
        "draft": None,
        "qualified": False,
        "needs_human_review": False,
        "pipeline_stage": "researched",
        "error": None,
        "tokens_used": 0,
        "api_calls_used": 0,
        "budget_config": {}
    }

    res = await agent.run(state)
    assert "qualification" in res
    qual = res["qualification"]
    assert isinstance(qual, QualificationResult)
    assert qual.qualified is True
    assert qual.confidence >= 0.5

@pytest.mark.asyncio
async def test_low_confidence_triggers_human_review():
    agent = QualificationAgent()
    # Candidate with missing fields
    candidate = LeadCandidate(
        company_name="Unknown Entity",
        domain="unknown.com",
        size_estimate="unknown",
        industry="unknown",
        key_people=["unknown"],
        recent_news=[],
        hiring_signals=[]
    )
    state: LeadState = {
        "run_id": "test_run_3",
        "icp_config": {"target_industry": "Healthcare", "target_size": "1000+"},
        "target_query": "Healthcare",
        "candidate": candidate,
        "qualification": None,
        "enriched": None,
        "score": None,
        "draft": None,
        "qualified": False,
        "needs_human_review": False,
        "pipeline_stage": "researched",
        "error": None,
        "tokens_used": 0,
        "api_calls_used": 0,
        "budget_config": {}
    }

    res = await agent.run(state)
    assert res["qualification"].confidence < 0.6
    assert res["needs_human_review"] is True

@pytest.mark.asyncio
async def test_scoring_agent_hybrid():
    agent = ScoringAgent()
    candidate = LeadCandidate(
        company_name="PayFlow Tech",
        domain="payflowtech.com",
        size_estimate="100-200",
        industry="SaaS",
        key_people=["Sarah Jenkins (CEO)"],
        recent_news=[SourcedFact(value="Raised $15M Series B funding", source_url="https://payflowtech.com/news", confidence=0.9)],
        hiring_signals=[SourcedFact(value="Hiring Enterprise AEs", source_url="https://payflowtech.com/careers", confidence=0.8)]
    )
    enriched = EnrichedLead(
        email="sarah.jenkins@payflowtech.com",
        linkedin_url="https://linkedin.com/company/payflowtech",
        tech_stack=["React", "Node.js", "AWS"],
        enrichment_incomplete=False
    )
    state: LeadState = {
        "run_id": "test_run_4",
        "icp_config": {"target_industry": "SaaS"},
        "target_query": "B2B SaaS",
        "candidate": candidate,
        "qualification": None,
        "enriched": enriched,
        "score": None,
        "draft": None,
        "qualified": True,
        "needs_human_review": False,
        "pipeline_stage": "enriched",
        "error": None,
        "tokens_used": 0,
        "api_calls_used": 0,
        "budget_config": {}
    }

    res = await agent.run(state)
    assert "score" in res
    score_obj = res["score"]
    assert isinstance(score_obj, ScoreResult)
    assert 0 <= score_obj.score <= 100
    assert "deterministic_fit" in score_obj.score_breakdown
    assert "qualitative_intent" in score_obj.score_breakdown
    assert score_obj.priority_tier in ["hot", "warm", "cold"]

@pytest.mark.asyncio
async def test_outreach_agent_grounded():
    agent = OutreachAgent()
    candidate = LeadCandidate(
        company_name="PayFlow Tech",
        domain="payflowtech.com",
        size_estimate="100-200",
        industry="SaaS",
        key_people=["Sarah Jenkins (CEO)"],
        recent_news=[SourcedFact(value="Raised $15M Series B", source_url="https://payflowtech.com/news", confidence=0.9)],
        hiring_signals=[]
    )
    enriched = EnrichedLead(
        email="sarah.jenkins@payflowtech.com",
        linkedin_url="https://linkedin.com/company/payflowtech",
        tech_stack=["React", "Node.js"],
        enrichment_incomplete=False
    )
    score_obj = ScoreResult(score=85, score_breakdown={}, priority_tier="hot")

    state: LeadState = {
        "run_id": "test_run_5",
        "icp_config": {"target_industry": "SaaS"},
        "target_query": "B2B SaaS",
        "candidate": candidate,
        "qualification": None,
        "enriched": enriched,
        "score": score_obj,
        "draft": None,
        "qualified": True,
        "needs_human_review": False,
        "pipeline_stage": "scored",
        "error": None,
        "tokens_used": 0,
        "api_calls_used": 0,
        "budget_config": {}
    }

    res = await agent.run(state)
    assert "draft" in res
    draft = res["draft"]
    assert draft.human_approval_required is True
    assert "PayFlow Tech" in draft.body or "PayFlow Tech" in draft.subject

@pytest.mark.asyncio
async def test_full_graph_execution():
    initial_state: LeadState = {
        "run_id": "test_graph_run_1",
        "icp_config": {"target_industry": "SaaS"},
        "target_query": "B2B SaaS fintech companies",
        "candidate": None,
        "qualification": None,
        "enriched": None,
        "score": None,
        "draft": None,
        "qualified": False,
        "needs_human_review": False,
        "pipeline_stage": "init",
        "error": None,
        "tokens_used": 0,
        "api_calls_used": 0,
        "budget_config": {"max_tokens": 10000, "max_api_calls": 20, "max_seconds": 60, "score_threshold": 50}
    }

    final_state = await app.ainvoke(initial_state, config={"configurable": {"thread_id": "test_thread_1"}})
    assert final_state["pipeline_stage"] in ["drafted", "needs_review", "scored", "failed"]
    assert final_state["candidate"] is not None
    assert final_state["qualification"] is not None
