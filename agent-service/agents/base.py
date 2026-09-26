from abc import ABC, abstractmethod

try:
    from ..graph.state import LeadState
except (ImportError, ValueError):
    from graph.state import LeadState  # type: ignore[no-redef]

class BaseAgent(ABC):
    name: str

    @abstractmethod
    async def run(self, state: LeadState) -> dict:
        """
        Returns a partial state update dict.
        Must NEVER raise — catch all exceptions and return {"error": str(e)}
        """
        pass
