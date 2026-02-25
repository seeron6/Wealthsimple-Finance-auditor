import os
import finnhub
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

def get_market_context(symbol):
    client = finnhub.Client(api_key=os.getenv('FINNHUB_API_KEY'))
    # Get peers in the same industry to suggest substitutes
    peers = client.company_peers(symbol)
    price = client.quote(symbol)['c']
    return price, peers[:3] # Return price and top 3 competitors

def run_strategic_audit(symbol, cost_basis):
    current_price, peers = get_market_context(symbol)
    anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    prompt = f"""
    The stock {symbol} is at ${current_price}. My cost basis is ${cost_basis}.
    Industry Peers: {', '.join(peers)}.

    1. Calculate the Tax Loss Harvesting potential.
    2. If a sale is recommended, suggest which of the Industry Peers I should 
       buy to maintain e-commerce exposure without triggering a Wash Sale.
    3. Be specific about the 30-day window.
    """
    
    response = anthropic.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=600,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text

if __name__ == "__main__":
    print(f"🧠 Generating Strategy for SHOP...")
    print(run_strategic_audit('SHOP', 150.00))