from .base import BaseAgent
from graph.state import LeadState, EnrichedLead
from tools.enrichment_tools import find_contact_email, fetch_company_tech_stack

class EnrichmentAgent(BaseAgent):
    name = "enrichment"

    async def run(self, state: LeadState) -> dict:
        candidate = state.get("candidate")
        domain = candidate.domain if candidate else "acmecorp.com"
        key_person = candidate.key_people[0] if candidate and candidate.key_people and candidate.key_people != ["unknown"] else "Jane Doe"

        try:
            # 1. Look up contact email (Hunter.io with heuristic fallback)
            email_info = await find_contact_email(domain=domain, full_name=key_person)
            
            # 2. Look up tech stack & LinkedIn (Clearbit with heuristic fallback)
            company_info = await fetch_company_tech_stack(domain=domain)

            email = email_info.get("email")
            tech_stack = company_info.get("tech_stack", [])
            linkedin_url = company_info.get("linkedin_url")

            # Check if critical data is incomplete
            enrichment_incomplete = not email or not tech_stack

            enriched_lead = EnrichedLead(
                email=email,
                linkedin_url=linkedin_url,
                tech_stack=tech_stack,
                enrichment_incomplete=enrichment_incomplete
            )

            return {
                "enriched": enriched_lead,
                "pipeline_stage": "enriched",
                "api_calls_used": state.get("api_calls_used", 0) + 1,
            }

        except Exception as e:
            return {
                "error": f"EnrichmentAgent execution failed: {str(e)}",
                "enriched": EnrichedLead(
                    email=None,
                    linkedin_url=None,
                    tech_stack=[],
                    enrichment_incomplete=True
                )
            }
