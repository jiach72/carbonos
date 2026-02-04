
import asyncio
import sys
import os
from sqlalchemy import text

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import async_session_maker

async def inspect_raw():
    email = "admin@scdc.cloud"
    print(f"Inspecting raw DB data for {email}...")

    async with async_session_maker() as db:
        # Use simple text query to avoid ORM/Enum complexity for diagnosis
        result = await db.execute(text(f"SELECT email, role, tenant_id FROM users WHERE email = '{email}'"))
        row = result.fetchone()
        
        if not row:
            print("User not found via raw SQL!")
        else:
            print("--- RAW DB ROW ---")
            print(f"Email: {row[0]}")
            print(f"Role (Raw): {row[1]}")
            print(f"Tenant ID: {row[2]}")
            print("------------------")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(inspect_raw())
