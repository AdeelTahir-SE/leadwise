from .base import BaseAgent
from graph.state import LeadState, OutreachDraft

class OutreachAgent(BaseAgent):
    name = "outreach"

    async def run(self, state: LeadState) -> dict:
        # TODO: Member 4 implements this
        # Placeholder returns a draft
        return {
            "draft": OutreachDraft(
                subject="Accelerate your lead gen",
                body="Hi Jane, noticed Acme Corp is growing...",
                human_approval_required=True
            ),
            "pipeline_stage": "drafted",
            "api_calls_used": state.get("api_calls_used", 0) + 1,
        }
