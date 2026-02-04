
import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/v1"

def test_charts():
    # 1. Login
    print("Logging in...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json={
            "email": "admin@scdc.cloud",
            "password": "123456"
        })
        if resp.status_code != 200:
            print(f"Login failed: {resp.text}")
            sys.exit(1)
            
        token = resp.json()["access_token"]
        print("Login successful.")
        
        # 2. Get Trend Data
        print("Fetching trend data...")
        headers = {"Authorization": f"Bearer {token}"}
        resp = requests.get(f"{BASE_URL}/admin/stats/trend", headers=headers)
        
        if resp.status_code != 200:
            print(f"Fetch failed: {resp.text}")
            sys.exit(1)
            
        data = resp.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        # Validate structure
        if "trends" in data and "distribution" in data:
            print("✅ API Validation Passed")
        else:
            print("❌ Invalid Response Structure")
            
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_charts()
