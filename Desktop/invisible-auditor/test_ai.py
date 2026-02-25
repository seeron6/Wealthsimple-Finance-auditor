import os
from dotenv import load_dotenv
from pydantic_ai import Agent

# 1. Load your .env file
load_dotenv()

# 2. Define your agent (Wealthsimple logic: Be concise)
agent = Agent(
    'anthropic:claude-3-5-sonnet',
    system_prompt="You are a senior tax-loss harvesting auditor at Wealthsimple. Be professional and brief."
)

def main():
    print("🚀 Connecting to Claude...")
    # 3. Use run_sync for a quick terminal test
    result = agent.run_sync("Confirm you are online and ready to audit Shopify (SHOP) stocks.")
    
    print("-" * 30)
    print(f"🤖 Claude's Response: {result.data}")
    print("-" * 30)
    print("✅ TEST PASSED: Your Invisible Auditor is officially alive.")

if __name__ == "__main__":
    main()