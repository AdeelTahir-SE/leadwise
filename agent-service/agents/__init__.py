"""
agent-service/agents package.
"""
import os
import sys

_current_dir = os.path.dirname(os.path.abspath(__file__))
_agent_service_dir = os.path.dirname(_current_dir)
if _agent_service_dir not in sys.path:
    sys.path.insert(0, _agent_service_dir)

from .base import BaseAgent
from .research import ResearchAgent
from .qualification import QualificationAgent
from .enrichment import EnrichmentAgent
from .scoring import ScoringAgent
from .outreach import OutreachAgent

__all__ = [
    "BaseAgent",
    "ResearchAgent",
    "QualificationAgent",
    "EnrichmentAgent",
    "ScoringAgent",
    "OutreachAgent",
]
