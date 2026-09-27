from .base import BaseAgent
from graph.state import LeadState, ScoreResult
from prompts.system_prompts import SCORING_AGENT_SYSTEM_PROMPT
from config import OPENAI_API_KEY

class ScoringAgent(BaseAgent):
    name = "scoring"

    async def run(self, state: LeadState) -> dict:
        candidate = state.get("candidate")
        qualification = state.get("qualification")
        enriched = state.get("enriched")
        icp_config = state.get("icp_config", {})

        try:
            # -------------------------------------------------------------
            # Part 1: Deterministic Score Engine (0–50 points)
            # -------------------------------------------------------------
            det_score = 0
            det_breakdown = {}

            # Check 1: Industry Fit (15 pts)
            target_ind = icp_config.get("target_industry", "SaaS").lower()
            if candidate and candidate.industry and candidate.industry.lower() != "unknown":
                if target_ind in candidate.industry.lower() or candidate.industry.lower() in target_ind:
                    det_score += 15
                    det_breakdown["industry_fit"] = 15
                else:
                    det_score += 5
                    det_breakdown["industry_fit"] = 5
            else:
                det_breakdown["industry_fit"] = 0

            # Check 2: Size Fit (15 pts)
            if candidate and candidate.size_estimate and candidate.size_estimate != "unknown":
                det_score += 15
                det_breakdown["size_fit"] = 15
            else:
                det_breakdown["size_fit"] = 5

            # Check 3: Enriched Email Present & Valid (10 pts)
            if enriched and enriched.email:
                det_score += 10
                det_breakdown["contact_verified"] = 10
            else:
                det_breakdown["contact_verified"] = 0

            # Check 4: Tech Stack Match (10 pts)
            if enriched and enriched.tech_stack:
                det_score += 10
                det_breakdown["tech_stack_match"] = 10
            else:
                det_breakdown["tech_stack_match"] = 0

            # -------------------------------------------------------------
            # Part 2: Qualitative Intent LLM Engine (0–50 points)
            # -------------------------------------------------------------
            qual_score = 25 # default median fallback
            qual_breakdown = {"intent_signals": 25}

            news_texts = [n.value for n in candidate.recent_news] if candidate else []
            hiring_texts = [h.value for h in candidate.hiring_signals] if candidate else []

            if OPENAI_API_KEY and (news_texts or hiring_texts):
                try:
                    from langchain_openai import ChatOpenAI
                    from langchain_core.messages import SystemMessage, HumanMessage
                    import json

                    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=OPENAI_API_KEY)
                    prompt_text = f"""
                    Evaluate qualitative intent signals for this lead (0 to 50 score):
                    Recent News: {news_texts}
                    Hiring Signals: {hiring_texts}

                    Return a JSON object with:
                    {{"qualitative_score": <int 0-50>, "reason": "<short explanation>"}}
                    """

                    messages = [
                        SystemMessage(content=SCORING_AGENT_SYSTEM_PROMPT),
                        HumanMessage(content=prompt_text)
                    ]
                    response = await llm.ainvoke(messages)
                    data = json.loads(response.content)
                    qual_score = max(0, min(50, int(data.get("qualitative_score", 25))))
                    qual_breakdown = {"intent_signals": qual_score, "reason": data.get("reason", "Analyzed via LLM")}
                except Exception as e:
                    print(f"[ScoringAgent] LLM qualitative evaluation error, using fallback: {e}")

            # Heuristic qualitative score if LLM not used or fallback
            if qual_score == 25:
                if news_texts:
                    qual_score += 10
                if hiring_texts:
                    qual_score += 15
                qual_score = min(50, qual_score)
                qual_breakdown = {"intent_signals": qual_score}

            # -------------------------------------------------------------
            # Part 3: Combined Hybrid Score (0–100) & Priority Tier
            # -------------------------------------------------------------
            total_score = min(100, det_score + qual_score)

            if total_score >= 80:
                priority_tier = "hot"
            elif total_score >= 50:
                priority_tier = "warm"
            else:
                priority_tier = "cold"

            score_result = ScoreResult(
                score=total_score,
                score_breakdown={
                    "deterministic_fit": det_score,
                    "deterministic_breakdown": det_breakdown,
                    "qualitative_intent": qual_score,
                    "qualitative_breakdown": qual_breakdown
                },
                priority_tier=priority_tier
            )

            return {
                "score": score_result,
                "pipeline_stage": "scored",
                "api_calls_used": state.get("api_calls_used", 0) + 1,
            }

        except Exception as e:
            return {
                "error": f"ScoringAgent execution failed: {str(e)}",
                "score": ScoreResult(
                    score=50,
                    score_breakdown={"error": str(e)},
                    priority_tier="warm"
                )
            }
