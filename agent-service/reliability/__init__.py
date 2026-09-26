"""
agent-service/reliability package.
"""
import os
import sys

_current_dir = os.path.dirname(os.path.abspath(__file__))
_agent_service_dir = os.path.dirname(_current_dir)
if _agent_service_dir not in sys.path:
    sys.path.insert(0, _agent_service_dir)

from .retry import with_retry

__all__ = ["with_retry"]
