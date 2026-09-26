from .base import BaseAgent
from graph.state import LeadState, ScoreResult

class ScoringAgent(BaseAgent):
    name = "scoring"

    async def run(self, state: LeadState) -> dict:
        # TODO: Member 4 implements this
        # Placeholder returns a high score
        return {
            "score": ScoreResult(
                score=85,
                score_breakdown={"fit": 40, "intent": 45},
                priority_tier="hot"
            ),
            "pipeline_stage": "scored",
            "api_calls_used": state.get("api_calls_used", 0) + 1,
        }
