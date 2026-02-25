import os
import finnhub
from google import genai
from dotenv import load_dotenv

load_dotenv()

class ScoutAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.finnhub_client = finnhub.Client(api_key=os.getenv("FINNHUB_API_KEY"))

    def get_live_price(self, symbol):
        """Fetches the actual market price using the Finnhub API."""
        quote = self.finnhub_client.quote(symbol)
        return quote['c']

    def analyze_threshold(self, symbol, cost_basis):
        """
        Layer 1: Local Logic (FREE)
        Only proceeds to AI if the loss is > 2%.
        """
        current_price = self.get_live_price(symbol)
        loss_pct = ((cost_basis - current_price) / cost_basis) * 100
        
        if loss_pct > 2.0:
            return True, current_price, loss_pct
        return False, current_price, loss_pct

# Inside ScoutAgent class in scout.py
    def run_ai_scout(self, symbol, current_price, loss_pct):
        """
        Safe Mode: If Gemini fails, we use a deterministic rule 
        to keep the Orchestrator moving.
        """
        try:
            # Try the real AI first
            response = self.client.models.generate_content(
                model="gemini-1.5-flash", 
                contents=f"Is {symbol} at {loss_pct}% loss a harvest opportunity? Reply YES/NO."
            )
            return response.text
        except Exception as e:
            # MOCK LOGIC: If API fails, we 'auto-approve' large losses
            print(f"⚠️ Scout API Error (Quota). Falling back to Rule-Based Scouting.")
            if loss_pct > 5.0:
                return "YES (Auto-approved by Mock Scout for high loss percentage)"
            return "NO (Loss too small for harvesting)"

if __name__ == "__main__":
    scout = ScoutAgent()
    # Test with a dummy loss
    is_down, price, pct = scout.analyze_threshold("SHOP", 150.00)
    if is_down:
        print(f"📡 SCOUT: {scout.run_ai_scout('SHOP', price, pct)}")
    else:
        print(f"✅ SCOUT: SHOP is only down {pct:.2f}%. No AI check needed.")