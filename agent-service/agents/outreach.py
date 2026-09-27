from .base import BaseAgent
from graph.state import LeadState, OutreachDraft
from prompts.system_prompts import OUTREACH_AGENT_SYSTEM_PROMPT
from config import OPENAI_API_KEY

class OutreachAgent(BaseAgent):
    name = "outreach"

    async def run(self, state: LeadState) -> dict:
        candidate = state.get("candidate")
        enriched = state.get("enriched")
        score = state.get("score")

        company_name = candidate.company_name if candidate else "Acme Corp"
        key_person = candidate.key_people[0] if candidate and candidate.key_people and candidate.key_people != ["unknown"] else "Team"
        first_name = key_person.split()[0]
        
        news_items = [n.value for n in candidate.recent_news] if candidate else []
        hiring_items = [h.value for h in candidate.hiring_signals] if candidate else []
        tech_stack = enriched.tech_stack if enriched else []

        try:
            draft = None

            # 1. Use ChatOpenAI if API Key present
            if OPENAI_API_KEY:
                try:
                    from langchain_openai import ChatOpenAI
                    from langchain_core.messages import SystemMessage, HumanMessage

                    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3, api_key=OPENAI_API_KEY)
                    structured_llm = llm.with_structured_output(OutreachDraft)

                    prompt_text = f"""
                    Target Company: {company_name}
                    Recipient: {key_person}
                    Recent News: {news_items}
                    Hiring Signals: {hiring_items}
                    Tech Stack: {tech_stack}
                    Lead Priority Tier: {score.priority_tier if score else 'warm'}

                    Draft a personalized, grounded email outreach draft.
                    GROUNDING REQUIREMENT: Reference only the facts listed above. Do not invent news.
                    Always set human_approval_required = True.
                    """

                    messages = [
                        SystemMessage(content=OUTREACH_AGENT_SYSTEM_PROMPT),
                        HumanMessage(content=prompt_text)
                    ]

                    draft = await structured_llm.ainvoke(messages)
                except Exception as e:
                    print(f"[OutreachAgent] LLM generation error, using grounded template: {e}")

            # 2. Fallback Grounded Template
            if not draft:
                context_signal = ""
                if news_items:
                    context_signal = f"I noticed your recent update regarding: '{news_items[0]}'."
                elif hiring_items:
                    context_signal = f"I saw that {company_name} is actively expanding and hiring."
                elif tech_stack:
                    context_signal = f"Noticed {company_name} utilizes tech like {', '.join(tech_stack[:2])}."
                else:
                    context_signal = f"I've been following {company_name}'s recent growth in the market."

                subject = f"Accelerating {company_name}'s lead pipeline"
                body = f"""Hi {first_name},

{context_signal} 

Our platform helps team leaders scale qualified pipeline generation automatically using multi-agent workflows.

Would you be open to a 10-minute chat next week to see how this could benefit {company_name}?

Best regards,
Leadwise Team
"""

                draft = OutreachDraft(
                    subject=subject,
                    body=body,
                    human_approval_required=True
                )

            return {
                "draft": draft,
                "pipeline_stage": "drafted",
                "api_calls_used": state.get("api_calls_used", 0) + 1,
            }

        except Exception as e:
            return {
                "error": f"OutreachAgent execution failed: {str(e)}",
                "draft": OutreachDraft(
                    subject=f"Connecting with {company_name}",
                    body=f"Hi {first_name},\n\nWould love to connect regarding your growth goals at {company_name}.",
                    human_approval_required=True
                )
            }
