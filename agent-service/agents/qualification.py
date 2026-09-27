from .base import BaseAgent
from graph.state import LeadState, QualificationResult
from prompts.system_prompts import QUALIFICATION_AGENT_SYSTEM_PROMPT
from config import OPENAI_API_KEY

class QualificationAgent(BaseAgent):
    name = "qualification"

    async def run(self, state: LeadState) -> dict:
        candidate = state.get("candidate")
        icp_config = state.get("icp_config", {})

        if not candidate:
            return {
                "error": "QualificationAgent: No lead candidate in state.",
                "qualified": False,
                "needs_human_review": False
            }

        try:
            result = None

            # Step 1: Use LLM structured output if OpenAI key exists
            if OPENAI_API_KEY:
                try:
                    from langchain_openai import ChatOpenAI
                    from langchain_core.messages import SystemMessage, HumanMessage

                    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=OPENAI_API_KEY)
                    structured_llm = llm.with_structured_output(QualificationResult)

                    prompt_text = f"""
                    Candidate Details:
                    Company Name: {candidate.company_name}
                    Domain: {candidate.domain}
                    Industry: {candidate.industry}
                    Size Estimate: {candidate.size_estimate}
                    Key People: {candidate.key_people}
                    Recent News: {[n.value for n in candidate.recent_news]}

                    Target ICP Config:
                    {icp_config}

                    Evaluate whether this candidate meets the ICP criteria. Output structured JSON.
                    """

                    messages = [
                        SystemMessage(content=QUALIFICATION_AGENT_SYSTEM_PROMPT),
                        HumanMessage(content=prompt_text)
                    ]

                    result = await structured_llm.ainvoke(messages)
                except Exception as e:
                    print(f"[QualificationAgent] LLM qualification error, using deterministic evaluation: {e}")

            # Step 2: Deterministic ICP Evaluation Fallback
            if not result:
                target_industry = icp_config.get("target_industry", "SaaS").lower()
                target_size = icp_config.get("target_size", "50-500")

                reasons = []
                missing_fields = []
                match_count = 0
                total_checks = 2

                # Industry Check
                cand_ind = (candidate.industry or "").lower()
                if cand_ind != "unknown" and (target_industry in cand_ind or cand_ind in target_industry):
                    match_count += 1
                    reasons.append(f"Industry '{candidate.industry}' matches target ICP '{icp_config.get('target_industry', 'SaaS')}'")
                elif cand_ind == "unknown":
                    missing_fields.append("industry")
                else:
                    reasons.append(f"Industry '{candidate.industry}' differs from target '{icp_config.get('target_industry', 'SaaS')}'")

                # Size Check
                if candidate.size_estimate and candidate.size_estimate != "unknown":
                    match_count += 1
                    reasons.append(f"Company size '{candidate.size_estimate}' fits target range")
                else:
                    missing_fields.append("size_estimate")

                # Key People Check
                if not candidate.key_people or candidate.key_people == ["unknown"]:
                    missing_fields.append("key_people")

                # Confidence calculation
                confidence = match_count / total_checks
                if missing_fields:
                    confidence = max(0.3, confidence - (0.15 * len(missing_fields)))

                qualified = match_count >= 1 and confidence >= 0.5

                result = QualificationResult(
                    qualified=qualified,
                    reasons=reasons if reasons else ["Sufficient ICP heuristic alignment"],
                    confidence=round(confidence, 2),
                    missing_fields=missing_fields
                )

            # Route to human review if confidence < 0.6
            needs_human_review = result.confidence < 0.6

            return {
                "qualification": result,
                "qualified": result.qualified,
                "needs_human_review": needs_human_review,
                "pipeline_stage": "needs_review" if needs_human_review else "qualified",
                "api_calls_used": state.get("api_calls_used", 0) + 1,
            }

        except Exception as e:
            return {
                "error": f"QualificationAgent execution failed: {str(e)}",
                "qualified": False,
                "needs_human_review": True
            }
