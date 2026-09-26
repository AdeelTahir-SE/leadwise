def budget_guard(fn):
    async def wrapper(state):
        cfg = state.get("budget_config", {})
        if state.get("tokens_used", 0) > cfg.get("max_tokens", 100_000):
            return {"error": "Token budget exceeded", "pipeline_stage": "failed"}
        if state.get("api_calls_used", 0) > cfg.get("max_api_calls", 50):
            return {"error": "API call budget exceeded", "pipeline_stage": "failed"}
        return await fn(state)
    return wrapper
