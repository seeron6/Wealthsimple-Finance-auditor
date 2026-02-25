import os
from anthropic import Anthropic
from dotenv import load_dotenv

# 1. Load the environment variables
load_dotenv()

# 2. Initialize the client
# Ensure your .env has ANTHROPIC_API_KEY=sk-ant...
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

print("🚀 Sending raw request to Anthropic...")

try:
    message = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=100,
        messages=[
            {"role": "user", "content": "Confirm connection for Invisible Auditor."}
        ]
    )
    print(f"\n🤖 Claude says: {message.content[0].text}")
    print("\n✅ Connection Verified!")
except Exception as e:
    print(f"\n❌ Error: {e}")