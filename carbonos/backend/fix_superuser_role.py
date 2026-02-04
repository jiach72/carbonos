
import asyncio
import sys
import os

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import async_session_maker
from app.models.tenant import Tenant  # Ensure Tenant is imported for relationship mapping
from app.models.user import User, UserRole
from sqlalchemy import select, update

async def fix_superuser():
    email = "admin@scdc.cloud"
    print(f"Fixing role for {email}...")

    async with async_session_maker() as db:
        # Check current status
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        
        if not user:
            print("User not found!")
            return

        print(f"Current Role: {user.role}")
        
        # Update role to 'admin' (UserRole.ADMIN)
        stmt = update(User).where(User.email == email).values(role=UserRole.ADMIN)
        await db.execute(stmt)
        await db.commit()
        
        print("Role updated to ADMIN.")

        # Verify
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        print(f"New Role: {user.role}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(fix_superuser())
