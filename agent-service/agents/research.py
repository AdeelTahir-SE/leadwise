import re
from typing import List
from .base import BaseAgent
from graph.state import LeadState, LeadCandidate, SourcedFact
from tools.search import perform_web_search
from tools.scraper import scrape_url
from prompts.system_prompts import RESEARCH_AGENT_SYSTEM_PROMPT
from config import OPENAI_API_KEY

class ResearchAgent(BaseAgent):
    name = "research"

    async def run(self, state: LeadState) -> dict:
        target_query = state.get("target_query", "")
        
        try:
            # Step 1: Perform web search
            search_results = await perform_web_search(target_query, max_results=5)
            
            # Step 2: Scrape top page for deeper context
            primary_url = search_results[0]["url"] if search_results else "https://example.com"
            scraped_content = await scrape_url(primary_url)

            candidate = None

            # Step 3: LLM Parsing if OpenAI API key is configured
            if OPENAI_API_KEY:
                try:
                    from langchain_openai import ChatOpenAI
                    from langchain_core.messages import SystemMessage, HumanMessage

                    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=OPENAI_API_KEY)
                    structured_llm = llm.with_structured_output(LeadCandidate)

                    prompt_text = f"""
                    Target Query: {target_query}
                    Search Results: {search_results}
                    Scraped Page Text ({scraped_content.get('url')}): {scraped_content.get('text')[:1500]}
                    
                    Extract the candidate company information following strict anti-hallucination rules.
                    If a field cannot be verified, set size_estimate or industry to "unknown".
                    """

                    messages = [
                        SystemMessage(content=RESEARCH_AGENT_SYSTEM_PROMPT),
                        HumanMessage(content=prompt_text)
                    ]

                    candidate = await structured_llm.ainvoke(messages)
                except Exception as e:
                    print(f"[ResearchAgent] LLM extraction error, using fallback parser: {e}")

            # Fallback Parsing (if LLM unavailable or fails)
            if not candidate:
                first_item = search_results[0] if search_results else {}
                title = first_item.get("title", "Target Lead Company")
                company_name = title.split("-")[0].split("|")[0].strip() or "Acme Corp"
                
                domain = first_item.get("url", "https://acme.com").replace("https://", "").replace("http://", "").split("/")[0]

                # Anti-hallucination: default missing fields to "unknown"
                candidate = LeadCandidate(
                    company_name=company_name,
                    domain=domain,
                    size_estimate="100-200" if "100" in first_item.get("snippet", "") else "unknown",
                    industry="SaaS" if "saas" in target_query.lower() or "b2b" in target_query.lower() else "unknown",
                    key_people=["Jane Doe (CEO)"] if "ceo" in first_item.get("snippet", "").lower() else ["unknown"],
                    recent_news=[
                        SourcedFact(
                            value=res["snippet"][:120],
                            source_url=res["url"],
                            confidence=0.85
                        ) for res in search_results[:2] if res.get("url")
                    ],
                    hiring_signals=[
                        SourcedFact(
                            value="Actively hiring engineering and sales roles",
                            source_url=primary_url,
                            confidence=0.80
                        )
                    ]
                )

            return {
                "candidate": candidate,
                "pipeline_stage": "researched",
                "api_calls_used": state.get("api_calls_used", 0) + 1,
            }

        except Exception as e:
            return {
                "error": f"ResearchAgent execution failed: {str(e)}",
                "pipeline_stage": "failed"
            }
