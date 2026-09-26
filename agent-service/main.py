from fastapi import FastAPI
from pydantic import BaseModel
from graph.graph import app as langgraph_app
import uuid
import sys
import os

# Add the current directory to sys.path so modules can be found
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

api = FastAPI()

class RunRequest(BaseModel):
    target_query: str
    icp_config: dict
    budget_config: dict = {"max_tokens": 50000, "max_api_calls": 30, "score_threshold": 50}

@api.post("/run")
async def run_pipeline(req: RunRequest):
    run_id = str(uuid.uuid4())
    initial_state = {
        "run_id": run_id,
        "icp_config": req.icp_config,
        "target_query": req.target_query,
        "qualified": False,
        "needs_human_review": False,
        "pipeline_stage": "starting",
        "tokens_used": 0,
        "api_calls_used": 0,
        "budget_config": req.budget_config,
        "error": None,
        # Stage outputs (None until filled)
        "candidate": None, "qualification": None,
        "enriched": None, "score": None, "draft": None,
    }
    config = {"configurable": {"thread_id": run_id}}
    result = await langgraph_app.ainvoke(initial_state, config)
    return {"run_id": run_id, "result": result}

@api.get("/run/{run_id}/status")
async def get_status(run_id: str):
    config = {"configurable": {"thread_id": run_id}}
    state = await langgraph_app.aget_state(config)
    return state.values if state else {"error": "Run not found"}
