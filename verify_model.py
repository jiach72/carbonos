
import urllib.request
import json
import socket

API_KEY = "sk-e1jplPovStmzbxioLQqJjK2B6Wc8rp886Kn1Ek2iDbDHiFWm"
BASE_URL = "https://api.aicanapi.com/v1"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}

def test_model(model_name):
    print(f"\n--- Testing Model: {model_name} ---")
    url = f"{BASE_URL}/chat/completions"
    data = {
        "model": model_name,
        "messages": [
            {"role": "user", "content": "Hello, are you Opus 4.5?"}
        ],
        "max_tokens": 20
    }
    
    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
        socket.setdefaulttimeout(30)
        with urllib.request.urlopen(req) as response:
            print(f"SUCCESS! Status: {response.getcode()}")
            result = json.loads(response.read().decode('utf-8'))
            print("Response content:", result['choices'][0]['message']['content'])
            return True
    except urllib.error.HTTPError as e:
        print(f"Failed with {e.code}: {e.read().decode('utf-8')}")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

def list_models():
    print("\n--- Searching for 'opus' in available models ---")
    url = f"{BASE_URL}/models"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            models = [m['id'] for m in result['data']]
            opus_models = [m for m in models if 'opus' in m.lower()]
            print(f"Found {len(models)} total models.")
            print(f"Models containing 'opus': {opus_models}")
    except Exception as e:
        print(f"Could not list models: {e}")

# First list them clearly
print("\n--- Listing 'opus' models cleanly ---")
try:
    req = urllib.request.Request(f"{BASE_URL}/models", headers=headers)
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        models = [m['id'] for m in result['data']]
        opus_models = [m for m in models if 'opus' in m.lower()]
        print(f"Opus models found: {opus_models}")
        
        # Test the most likely candidates
        candidates = ['claude-opus-4-5-20251101', 'claude-3-opus-20240229', 'claude-3-opus']
        for model in candidates:
            if model in models or True: # Try even if not in list just in case
                test_model(model)
                
except Exception as e:
    print(f"Error listing/testing: {e}")
