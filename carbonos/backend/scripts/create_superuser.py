
import asyncio
import sys
import os

# 添加项目根目录到 sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import engine
from app.core.security import get_password_hash
from app.models.user import User
from app.models.tenant import Tenant
from sqlalchemy.orm import Session
from sqlalchemy import select

async def create_superuser():
    if len(sys.argv) < 3:
        print("Usage: python create_superuser.py <email> <password>")
        return

    email = sys.argv[1]
    password = sys.argv[2]
    
    async with engine.begin() as conn:
        # Check if exists
        # 简单起见，这里直接用 raw sql 或者 session
        pass

    # 使用 session
    # 使用 session
    from app.core.database import async_session_maker
    async with async_session_maker() as db:
        result = await db.execute(select(User).where(User.email == email))
        if result.scalar_one_or_none():
            print("User exists.")
            return

        user = User(
            email=email,
            password_hash=get_password_hash(password),
            full_name="Super Admin",
            role="admin",
            tenant_id=None # 关键：无租户
        )
        db.add(user)
        await db.commit()
        print(f"Superuser {email} created.")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(create_superuser())
