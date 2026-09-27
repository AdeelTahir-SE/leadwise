import os
import httpx
from typing import List, Dict, Any
from config import TAVILY_API_KEY, SERPAPI_API_KEY

async def perform_web_search(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """
    Performs web search using Tavily API if available, SerpAPI as secondary fallback,
    or a structured mock response for offline/dev environments.
    
    Returns a list of dicts: [{"title": str, "url": str, "snippet": str, "source": str}]
    """
    # 1. Try Tavily API
    if TAVILY_API_KEY:
        try:
            from tavily import TavilyClient
            client = TavilyClient(api_key=TAVILY_API_KEY)
            response = client.search(query=query, max_results=max_results)
            results = []
            for item in response.get("results", []):
                results.append({
                    "title": item.get("title", ""),
                    "url": item.get("url", ""),
                    "snippet": item.get("content", ""),
                    "source": "tavily"
                })
            if results:
                return results
        except Exception as e:
            print(f"[Search Tool] Tavily search error: {e}")

    # 2. Try SerpAPI
    if SERPAPI_API_KEY:
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    "https://serpapi.com/search.json",
                    params={"q": query, "api_key": SERPAPI_API_KEY, "num": max_results}
                )
                if resp.status_code == 200:
                    data = resp.json()
                    results = []
                    for item in data.get("organic_results", []):
                        results.append({
                            "title": item.get("title", ""),
                            "url": item.get("link", ""),
                            "snippet": item.get("snippet", ""),
                            "source": "serpapi"
                        })
                    if results:
                        return results
        except Exception as e:
            print(f"[Search Tool] SerpAPI search error: {e}")

    # 3. Graceful Mock Fallback for Dev / Testing without keys
    normalized = query.lower()
    domain = "acmecorp.io"
    company_name = "Acme Corp"
    
    if "fintech" in normalized or "payment" in normalized:
        company_name = "PayFlow Tech"
        domain = "payflowtech.com"
    elif "health" in normalized or "bio" in normalized:
        company_name = "BioPulse Systems"
        domain = "biopulsesystems.com"
    elif "ai" in normalized or "data" in normalized:
        company_name = "DataSpark AI"
        domain = "dataspark.ai"

    return [
        {
            "title": f"{company_name} - Leading B2B Solutions",
            "url": f"https://www.{domain}",
            "snippet": f"{company_name} is a rapidly growing B2B SaaS platform powering enterprise operations with 120 employees.",
            "source": "mock_search"
        },
        {
            "title": f"{company_name} News & Hiring Updates",
            "url": f"https://www.{domain}/news/series-b-funding",
            "snippet": f"{company_name} recently raised $15M in Series B funding and is actively hiring Enterprise Account Executives and Software Engineers.",
            "source": "mock_search"
        },
        {
            "title": f"{company_name} Leadership & Careers",
            "url": f"https://www.{domain}/about",
            "snippet": f"Founded by Sarah Jenkins (CEO) and Mark Torres (CTO). Headquartered in San Francisco, CA.",
            "source": "mock_search"
        }
    ]
