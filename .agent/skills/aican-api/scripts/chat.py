
import argparse
import urllib.request
import json
import os
import sys

# Configuration
# In a production environment, use os.environ.get("AICAN_API_KEY")
# For this specific user setup, we fallback to the provided key if env var is missing
DEFAULT_API_KEY = "sk-e1jplPovStmzbxioLQqJjK2B6Wc8rp886Kn1Ek2iDbDHiFWm"
BASE_URL = "https://api.aicanapi.com/v1/chat/completions"
DEFAULT_MODEL = "claude-opus-4-5-20251101"

def chat(prompt, system_message=None, model=DEFAULT_MODEL, api_key=None):
    if not api_key:
        api_key = os.environ.get("AICAN_API_KEY", DEFAULT_API_KEY)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    messages = []
    if system_message:
        messages.append({"role": "system", "content": system_message})
    
    messages.append({"role": "user", "content": prompt})

    data = {
        "model": model,
        "messages": messages,
        "temperature": 0.7
    }

    try:
        req = urllib.request.Request(BASE_URL, data=json.dumps(data).encode('utf-8'), headers=headers)
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            return result['choices'][0]['message']['content']
    except urllib.error.HTTPError as e:
        return f"Error {e.code}: {e.read().decode('utf-8')}"
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Call Aican API")
    parser.add_argument("--prompt", required=True, help="User prompt")
    parser.add_argument("--system", help="System message")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Model ID")
    
    args = parser.parse_args()
    
    response = chat(args.prompt, args.system, args.model)
    print(response)
