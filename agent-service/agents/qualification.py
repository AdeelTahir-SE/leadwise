from .base import BaseAgent
from graph.state import LeadState, QualificationResult

class QualificationAgent(BaseAgent):
    name = "qualification"

    async def run(self, state: LeadState) -> dict:
        # TODO: Member 4 implements this
        # Placeholder returns a qualified result
        return {
            "qualification": QualificationResult(
                qualified=True,
                reasons=["Matches ICP"],
                confidence=0.8,
                missing_fields=["email"]
            ),
            "qualified": True,
            "needs_human_review": False,
            "pipeline_stage": "qualified",
            "api_calls_used": state.get("api_calls_used", 0) + 1,
        }
