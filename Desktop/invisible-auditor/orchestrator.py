import os
import logging
from scout import ScoutAgent
from compliance import check_compliance
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("ORCHESTRATOR")

def run_full_audit(symbol, cost_basis):
    scout = ScoutAgent()
    anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    # 1. SCOUT PHASE
    is_candidate, price, loss = scout.analyze_threshold(symbol, cost_basis)
    
    if not is_candidate:
        return {
            "status": "HOLD",
            "savings": 0,
            "substitute": "N/A",
            "reason": f"Asset is only down {loss:.2f}%. Threshold for harvesting is 10%."
        }

    scout_opinion = scout.run_ai_scout(symbol, price, loss)

    if "YES" in scout_opinion.upper():
        # 2. COMPLIANCE PHASE
        compliance = check_compliance(symbol)
        if not compliance.is_safe:
            return {
                "status": "BLOCKED",
                "savings": 0,
                "substitute": "NONE",
                "reason": f"IRS COMPLIANCE ALERT: {compliance.reason}"
            }

        # 3. STRATEGIST PHASE (Claude)
        prompt = f"Scout says: {scout_opinion}. Suggest 1 peer stock for {symbol} to maintain market exposure."
        response = anthropic.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}]
        )
        
        # We calculate an estimated tax saving (e.g., 25% of the realized loss)
        potential_savings = abs(price - cost_basis) * 0.25 

        return {
            "status": "SUCCESS",
            "savings": round(potential_savings, 2),
            "substitute": "WIX", # Example for SHOP
            "reason": response.content[0].text
        }
    
    return {"status": "HOLD", "savings": 0, "substitute": "N/A", "reason": "Scout did not recommend action."}