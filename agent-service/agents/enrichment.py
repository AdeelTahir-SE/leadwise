from .base import BaseAgent
from graph.state import LeadState, EnrichedLead

class EnrichmentAgent(BaseAgent):
    name = "enrichment"

    async def run(self, state: LeadState) -> dict:
        # TODO: Member 4 implements this
        # Placeholder returns enriched data
        return {
            "enriched": EnrichedLead(
                email="jane.doe@acme.com",
                linkedin_url="https://linkedin.com/in/janedoe",
                tech_stack=["React", "Next.js"],
                enrichment_incomplete=False
            ),
            "pipeline_stage": "enriched",
            "api_calls_used": state.get("api_calls_used", 0) + 1,
        }
