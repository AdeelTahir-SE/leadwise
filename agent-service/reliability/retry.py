import asyncio
import functools
from typing import Callable

def with_retry(fn: Callable, max_attempts: int = 3, base_delay: float = 1.0):
    @functools.wraps(fn)
    async def wrapper(state):
        for attempt in range(max_attempts):
            try:
                return await fn(state)
            except Exception as e:
                if attempt == max_attempts - 1:
                    return {"error": str(e), "pipeline_stage": "failed"}
                await asyncio.sleep(base_delay * (2 ** attempt))  # exponential backoff
    return wrapper
