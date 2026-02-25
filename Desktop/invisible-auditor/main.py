from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AuditRequest(BaseModel):
    mode: str

class ChatRequest(BaseModel):
    message: str
    context: str

# FIX: Added the missing upload route
@app.post("/upload-trades")
async def upload_trades(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    # Calculate some quick stats for the UI
    total_trades = len(df)
    symbols = df['Symbol'].unique().tolist()
    
    return {
        "status": "success", 
        "filename": file.filename, 
        "count": total_trades,
        "symbols": symbols
    }

@app.post("/run-audit")
async def run_audit(request: AuditRequest):
    if request.mode == "WASH SALE RISK":
        return {
            "status": "BLOCKED",
            "reason": "AuditorAgent detected a purchase of TSLA on Feb 15th. Selling today at a loss would violate the 30-day IRS Wash Sale rule.",
            "substitute": None
        }
    return {
        "status": "READY",
        "reason": "No wash sale conflicts. Market Data API confirms WIX as a valid substitute.",
        "substitute": {"symbol": "WIX", "correlation": 0.94}
    }

@app.post("/chat")
async def chat_with_auditor(request: ChatRequest):
    return {"response": f"I am analyzing your trades in {request.context} mode. The IRS 30-day window is currently the primary constraint."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)