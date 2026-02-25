import finnhub
import os
from dotenv import load_dotenv

load_dotenv()

def get_stock_data(symbol):
    client = finnhub.Client(api_key=os.getenv('FINNHUB_API_KEY'))
    # 'c' = Current Price, 'h' = High, 'l' = Low
    quote = client.quote(symbol)
    return {
        "current_price": quote['c'],
        "high": quote['h'],
        "low": quote['l']
    }

if __name__ == "__main__":
    data = get_stock_data('SHOP')
    print(f"📊 Live SHOP Price: ${data['current_price']}")
    