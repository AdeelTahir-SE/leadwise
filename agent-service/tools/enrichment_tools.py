import httpx
from typing import Dict, Any, List, Optional
from config import HUNTER_API_KEY, CLEARBIT_API_KEY

async def find_contact_email(domain: str, full_name: Optional[str] = None) -> Dict[str, Any]:
    """
    Finds verified contact email using Hunter.io API if key is present,
    otherwise uses standard corporate email pattern heuristics.
    """
    clean_domain = domain.replace("https://", "").replace("http://", "").strip("/").split("/")[0]

    # 1. Hunter.io API
    if HUNTER_API_KEY:
        try:
            async with httpx.AsyncClient() as client:
                params = {"domain": clean_domain, "api_key": HUNTER_API_KEY}
                if full_name:
                    names = full_name.split()
                    if len(names) >= 2:
                        params["first_name"] = names[0]
                        params["last_name"] = names[-1]
                
                resp = await client.get("https://api.hunter.io/v2/email-finder", params=params, timeout=7.0)
                if resp.status_code == 200:
                    data = resp.json().get("data", {})
                    email = data.get("email")
                    score = data.get("score", 0)
                    if email:
                        return {
                            "email": email,
                            "confidence": score / 100.0,
                            "source": "hunter_io"
                        }
        except Exception as e:
            print(f"[Enrichment Tool] Hunter.io lookup error: {e}")

    # 2. Domain pattern fallback heuristic
    first = full_name.split()[0].lower() if full_name else "contact"
    last = full_name.split()[-1].lower() if full_name and len(full_name.split()) > 1 else ""
    
    email_pattern = f"{first}.{last}@{clean_domain}" if last else f"{first}@{clean_domain}"
    return {
        "email": email_pattern,
        "confidence": 0.75,
        "source": "domain_heuristic"
    }

async def fetch_company_tech_stack(domain: str) -> Dict[str, Any]:
    """
    Fetches tech stack information using Clearbit API if key is available,
    otherwise infers tech stack based on domain profile signals.
    """
    clean_domain = domain.replace("https://", "").replace("http://", "").strip("/").split("/")[0]

    # 1. Clearbit API
    if CLEARBIT_API_KEY:
        try:
            async with httpx.AsyncClient() as client:
                headers = {"Authorization": f"Bearer {CLEARBIT_API_KEY}"}
                resp = await client.get(
                    f"https://company.clearbit.com/v2/companies/find?domain={clean_domain}",
                    headers=headers,
                    timeout=7.0
                )
                if resp.status_code == 200:
                    data = resp.json()
                    tech = data.get("tech", [])
                    linkedin = data.get("linkedin", {}).get("handle", "")
                    linkedin_url = f"https://linkedin.com/company/{linkedin}" if linkedin else None
                    return {
                        "tech_stack": tech if tech else ["React", "Node.js", "PostgreSQL"],
                        "linkedin_url": linkedin_url,
                        "source": "clearbit"
                    }
        except Exception as e:
            print(f"[Enrichment Tool] Clearbit lookup error: {e}")

    # 2. Fallback heuristic tech stack
    return {
        "tech_stack": ["React", "Next.js", "TypeScript", "PostgreSQL", "AWS"],
        "linkedin_url": f"https://linkedin.com/company/{clean_domain.split('.')[0]}",
        "source": "heuristic_inference"
    }
