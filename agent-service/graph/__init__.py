"""
agent-service/graph package.
"""
import os
import sys

# Ensure agent-service root directory is in sys.path for IDE & module resolution
_current_dir = os.path.dirname(os.path.abspath(__file__))
_agent_service_dir = os.path.dirname(_current_dir)
if _agent_service_dir not in sys.path:
    sys.path.insert(0, _agent_service_dir)
