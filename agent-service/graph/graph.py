"""
agent-service/graph/graph.py

StateGraph definition linking the 5 sub-agents:
Research -> Qualification -> Enrichment -> Scoring -> Outreach

Includes conditional routing, retry wrappers, budget guards, and DB observability.
"""
try:
    from langgraph.graph import StateGraph, END  # type: ignore[import-not-found,import-untyped]  # pyright: ignore[reportMissingImports]
except ImportError:
    StateGraph = object  # type: ignore[misc,assignment]
    END = "__end__"  # type: ignore[assignment]

from .state import LeadState
from .checkpointer import get_checkpointer
from agents.research import ResearchAgent
from agents.qualification import QualificationAgent
from agents.enrichment import EnrichmentAgent
from agents.scoring import ScoringAgent
from agents.outreach import OutreachAgent
from reliability.retry import with_retry
from supervisor.budget import budget_guard
from db.event_logger import observe_agent_step

research_agent     = ResearchAgent()
qualification_agent = QualificationAgent()
enrichment_agent   = EnrichmentAgent()
scoring_agent      = ScoringAgent()
outreach_agent     = OutreachAgent()

# Wrap each agent node with retry + budget guard + DB observability
@observe_agent_step("research", "Research Agent")
async def research_node(state): return await with_retry(budget_guard(research_agent.run))(state)

@observe_agent_step("qualification", "Qualification Agent")
async def qualify_node(state):  return await with_retry(budget_guard(qualification_agent.run))(state)

@observe_agent_step("enrichment", "Enrichment Agent")
async def enrich_node(state):   return await with_retry(budget_guard(enrichment_agent.run))(state)

@observe_agent_step("scoring", "Scoring Agent")
async def score_node(state):    return await with_retry(budget_guard(scoring_agent.run))(state)

@observe_agent_step("outreach", "Outreach Agent")
async def outreach_node(state): return await with_retry(budget_guard(outreach_agent.run))(state)

# --- Conditional Edge Routers ---
def after_qualify(state: LeadState) -> str:
    if state.get("error"):         return "dead_letter"
    if state.get("needs_human_review"): return "human_review"
    if state.get("qualified"):          return "enrich"
    return END

def after_score(state: LeadState) -> str:
    if state.get("error"):         return "dead_letter"
    
    threshold = state.get("budget_config", {}).get("score_threshold", 50)
    score_obj = state.get("score")
    if score_obj and score_obj.score >= threshold: 
        return "outreach"
    return END

# --- Build Graph ---
graph = StateGraph(LeadState)

graph.add_node("research",      research_node)
graph.add_node("qualify",       qualify_node)
graph.add_node("enrich",        enrich_node)
graph.add_node("score",         score_node)
graph.add_node("outreach",      outreach_node)
graph.add_node("dead_letter",   lambda s: {**s, "pipeline_stage": "failed"})
graph.add_node("human_review",  lambda s: {**s, "pipeline_stage": "needs_review"})

graph.set_entry_point("research")
graph.add_edge("research", "qualify")
graph.add_conditional_edges("qualify", after_qualify)
graph.add_edge("enrich", "score")
graph.add_conditional_edges("score", after_score)
graph.add_edge("outreach", END)

# Compile with checkpointer 
app = graph.compile(checkpointer=get_checkpointer())
