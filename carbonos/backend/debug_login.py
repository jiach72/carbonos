
import asyncio
import sys
import json
import urllib.request
import urllib.error

def debug_login():
    url = "http://localhost:8000/api/v1/auth/login"
    payload = {
        "email": "admin@scdc.cloud",
        "password": "password"
    }
    payload["password"] = "123456"

    print(f"Attempting login to {url} with {payload['email']}...")
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status: {response.getcode()}")
            body = response.read().decode('utf-8')
            try:
                json_body = json.loads(body)
                
                role = json_body.get('role')
                tenant_id = json_body.get('tenant_id')
                print("-" * 20)
                print(f"Role: '{role}'")
                print(f"Tenant ID: {tenant_id}")
                
            except json.JSONDecodeError:
                print(f"Raw text: {body}")

    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code}")
        print(e.read().decode('utf-8'))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_login()
