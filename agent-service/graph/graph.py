from langgraph.graph import StateGraph, END
from graph.state import LeadState
from agents.research import ResearchAgent
from agents.qualification import QualificationAgent
from agents.enrichment import EnrichmentAgent
from agents.scoring import ScoringAgent
from agents.outreach import OutreachAgent
from reliability.retry import with_retry
from supervisor.budget import budget_guard

research_agent     = ResearchAgent()
qualification_agent = QualificationAgent()
enrichment_agent   = EnrichmentAgent()
scoring_agent      = ScoringAgent()
outreach_agent     = OutreachAgent()

# Wrap each agent node with retry + budget guard
async def research_node(state): return await with_retry(budget_guard(research_agent.run))(state)
async def qualify_node(state):  return await with_retry(budget_guard(qualification_agent.run))(state)
async def enrich_node(state):   return await with_retry(budget_guard(enrichment_agent.run))(state)
async def score_node(state):    return await with_retry(budget_guard(scoring_agent.run))(state)
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
from graph.checkpointer import get_checkpointer
app = graph.compile(checkpointer=get_checkpointer())
