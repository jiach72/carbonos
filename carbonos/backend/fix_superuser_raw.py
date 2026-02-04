
import asyncio
import sys
import os
from sqlalchemy import text

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import async_session_maker

async def fix_superuser_raw():
    email = "admin@scdc.cloud"
    print(f"Forcing lowercase 'admin' role for {email}...")

    async with async_session_maker() as db:
        # Force update to lowercase 'admin'
        await db.execute(text(f"UPDATE users SET role = 'admin' WHERE email = '{email}'"))
        await db.commit()
        print("Update executed.")

        # Verify
        result = await db.execute(text(f"SELECT role FROM users WHERE email = '{email}'"))
        row = result.fetchone()
        print(f"New Raw Role: {row[0]}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(fix_superuser_raw())
