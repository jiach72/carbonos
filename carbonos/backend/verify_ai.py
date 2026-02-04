
import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1"
EMAIL = "admin@scdc.cloud" # Using super admin to test reachability
PASSWORD = "123456"

def test_ai_diagnostic():
    print(f"Logging in as {EMAIL}...")
    try:
        # 0. Test Ping
        print("Testing Ping...")
        ping_resp = requests.get(f"{BASE_URL}/diagnostic/ping")
        print(f"Ping Status: {ping_resp.status_code}")
        if ping_resp.status_code == 200:
            print("Ping Response:", ping_resp.json())
        else:
            print("Ping Failed:", ping_resp.text)

        # 1. Login
        resp = requests.post(f"{BASE_URL}/auth/login", json={
            "email": EMAIL,
            "password": PASSWORD
        })
        
        if resp.status_code != 200:
            print(f"Login failed: {resp.text}")
            sys.exit(1)
            
        token = resp.json()["access_token"]
        print("Login successful.")
        
        # 2. Call Analyze
        print("Calling AI Diagnosis...")
        url = f"{BASE_URL}/diagnostic/analyze"
        print(f"URL: {url}")
        headers = {"Authorization": f"Bearer {token}"}
        resp = requests.post(url, headers=headers, json={
            "start_date": "2025-01-01",
            "end_date": "2025-01-31"
        })
        
        if resp.status_code != 200:
            print(f"Analysis failed: {resp.text}")
            sys.exit(1)
            
        data = resp.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        if "suggestions" in data and len(data["suggestions"]) > 0:
             print("✅ AI Diagnostic Validation Passed (Suggestions Generated)")
        else:
             print("⚠️ AI Diagnostic Returned No Suggestions (Check Data?)")

    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_ai_diagnostic()
