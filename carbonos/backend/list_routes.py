
import sys
import os
import asyncio

# Setup path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

def list_routes():
    print("Listing all registered routes:")
    for route in app.routes:
        if hasattr(route, "path"):
            print(f"{route.methods} {route.path}")
        else:
            print(route)

if __name__ == "__main__":
    list_routes()
