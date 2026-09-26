from abc import ABC, abstractmethod
from graph.state import LeadState

class BaseAgent(ABC):
    name: str

    @abstractmethod
    async def run(self, state: LeadState) -> dict:
        """
        Returns a partial state update dict.
        Must NEVER raise — catch all exceptions and return {"error": str(e)}
        """
        pass
