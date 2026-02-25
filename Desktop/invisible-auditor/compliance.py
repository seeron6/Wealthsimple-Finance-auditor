import json
from datetime import datetime, timedelta
from pydantic import BaseModel

class AuditResult(BaseModel):
    is_safe: bool
    reason: str
    days_since_last_buy: int

def check_compliance(symbol):
    with open('history.json', 'r') as f:
        history = json.load(f)
    
    today = datetime.now()
    # Filter for the specific stock and "BUY" actions
    relevant_trades = [t for t in history if t['symbol'] == symbol and t['action'] == 'BUY']
    
    if not relevant_trades:
        return AuditResult(is_safe=True, reason="No previous trades found.", days_since_last_buy=999)

    # Find the most recent buy date
    last_buy_str = relevant_trades[-1]['date']
    last_buy_date = datetime.strptime(last_buy_str, "%Y-%m-%d")
    days_diff = (today - last_buy_date).days

    if days_diff <= 30:
        return AuditResult(
            is_safe=False, 
            reason=f"WASH SALE RISK: You purchased {symbol} {days_diff} days ago.",
            days_since_last_buy=days_diff
        )
    
    return AuditResult(is_safe=True, reason="Outside 30-day window.", days_since_last_buy=days_diff)