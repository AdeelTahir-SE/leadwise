from .base import BaseAgent
from graph.state import LeadState, LeadCandidate

class ResearchAgent(BaseAgent):
    name = "research"

    async def run(self, state: LeadState) -> dict:
        # TODO: Member 4 implements this
        # Placeholder returns a fake candidate for graph testing
        return {
            "candidate": LeadCandidate(
                company_name="Acme Corp",
                domain="acme.com",
                size_estimate="100-200",
                industry="SaaS",
                key_people=["Jane Doe (CEO)"],
                recent_news=[],
                hiring_signals=[],
            ),
            "pipeline_stage": "researched",
            "api_calls_used": state.get("api_calls_used", 0) + 1,
        }
