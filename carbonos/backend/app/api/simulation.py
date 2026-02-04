
from fastapi import APIRouter
from app.services.simulation import SimulationService

router = APIRouter(tags=["Simulation"])

@router.get("/simulation/realtime")
async def get_realtime_metrics():
    """获取实时仿真数据 (仪表盘跳动数据)"""
    return SimulationService.generate_realtime_metrics()

@router.get("/simulation/history")
async def get_history_trend(days: int = 7):
    """获取历史趋势仿真数据"""
    return SimulationService.generate_trend_history(days)

@router.get("/simulation/prediction")
async def get_ai_prediction():
    """获取 AI 能耗预测数据"""
    return SimulationService.generate_prediction_data()
