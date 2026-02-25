import os
import finnhub
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

# 1. Get Live Data
def get_audit_data(symbol):
    client = finnhub.Client(api_key=os.getenv('FINNHUB_API_KEY'))
    quote = client.quote(symbol)
    return quote['c'] # Current Price

# 2. Ask Claude for Judgment
def run_audit(symbol, cost_basis):
    current_price = get_audit_data(symbol)
    anthropic = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
    
    prompt = f"""
    The stock {symbol} is currently at ${current_price}. 
    My cost basis (what I paid) is ${cost_basis}.
    Should I sell this now to harvest a tax loss? 
    Explain the 'Wash Sale' rule briefly in your answer.
    """
    
    response = anthropic.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text

if __name__ == "__main__":
    # Example: You bought SHOP at $100, but it's currently lower
    print("🕵️ Running Invisible Audit on SHOP...")
    result = run_audit('SHOP', 150.00)
    print(f"\n{result}")