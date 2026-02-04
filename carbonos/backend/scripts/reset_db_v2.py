
import asyncio
import sys
import os

# 添加项目根目录到 sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import engine, Base
from app.models.tenant import Tenant
from app.models.user import User
from app.models.organization import Organization
from app.models.carbon import CarbonEmission, CarbonInventory
from app.models.energy import EnergyData

async def reset_db():
    print("WARNING: This will DROP ALL DATA in the database.")
    print("Upgrading to CarbonOS v2.0 (Multi-Tenant) Schema...")
    
    async with engine.begin() as conn:
        print("Dropping all tables...")
        await conn.run_sync(Base.metadata.drop_all)
        print("Creating new tables...")
        await conn.run_sync(Base.metadata.create_all)
        
    print("Database reset complete. System ready for v2.0.")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(reset_db())
