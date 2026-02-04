
import random
import datetime
from typing import List, Dict, Any

class SimulationService:
    """IoT 仿真数据生成服务"""
    
    @staticmethod
    def generate_realtime_metrics() -> Dict[str, Any]:
        """生成实时仪表盘数据"""
        now = datetime.datetime.now()
        hour = now.hour
        
        # 基础负荷模拟 (根据时间段)
        base_load = 2000  # 基础负荷 2000 kW
        
        # 白天高峰 (8:00 - 18:00)
        if 8 <= hour <= 18:
            load_factor = 1.5 + (random.random() * 0.3) # 1.5 - 1.8 倍
            solar_power = 800 * (1 - abs(13 - hour) / 6) # 光伏发电曲线 (中午最高)
            if solar_power < 0: solar_power = 0
        else:
            load_factor = 0.6 + (random.random() * 0.2) # 夜间低谷
            solar_power = 0
            
        current_load = base_load * load_factor
        current_load += random.uniform(-50, 50) # 随机波动
        
        # 碳排放计算 (假设 0.58 kgCO2/kWh)
        emission_rate = 0.58
        realtime_emission = (current_load - solar_power) * emission_rate
        
        return {
            "timestamp": now.isoformat(),
            "power": {
                "load": round(current_load, 1), # 当前负荷 (kW)
                "solar": round(solar_power, 1), # 光伏发电 (kW)
                "grid": round(current_load - solar_power, 1) # 电网取电 (kW)
            },
            "environment": {
                "temperature": round(20 + random.uniform(-2, 5), 1),
                "humidity": round(45 + random.uniform(-5, 5), 1),
                "co2_concentration": round(400 + random.uniform(-10, 50), 0)
            },
            "carbon": {
                "realtime_emission": round(realtime_emission, 2), # 实时碳排 (kg/h)
                "today_total": round(realtime_emission * 24 * 0.6, 0) # 模拟今日累计
            }
        }

    @staticmethod
    def generate_trend_history(days: int = 7) -> List[Dict[str, Any]]:
        """生成历史趋势模拟数据"""
        data = []
        base_time = datetime.datetime.now() - datetime.timedelta(days=days)
        
        for i in range(days * 24): # 每小时一个点
            time_point = base_time + datetime.timedelta(hours=i)
            hour = time_point.hour
            
            # 简化的模拟逻辑
            if 8 <= hour <= 18:
                val = 2000 * (1.5 + random.uniform(-0.1, 0.2))
            else:
                val = 2000 * (0.6 + random.uniform(-0.05, 0.1))
                
            data.append({
                "time": time_point.strftime("%Y-%m-%d %H:%M"),
                "value": round(val, 1)
            })
            
        return data

    @staticmethod
    def generate_prediction_data() -> Dict[str, Any]:
        """生成 AI 能耗预测数据 (未来 24H)"""
        history = []
        prediction = []
        
        now = datetime.datetime.now()
        # 过去 24H 真实值
        for i in range(24):
            dt = now - datetime.timedelta(hours=24-i)
            hour = dt.hour
            if 8 <= hour <= 18:
                val = 2000 * (1.5 + random.uniform(-0.1, 0.1))
            else:
                val = 2000 * (0.6 + random.uniform(-0.05, 0.05))
            history.append({"time": dt.strftime("%H:%M"), "value": round(val, 1), "type": "history"})
            
        # 未来 24H 预测值 (带置信区间)
        for i in range(24):
            dt = now + datetime.timedelta(hours=i+1)
            hour = dt.hour
            if 8 <= hour <= 18:
                base = 2000 * 1.5
            else:
                base = 2000 * 0.6
                
            # 预测值更加平滑
            val = base * (1 + random.uniform(-0.02, 0.02))
            
            prediction.append({
                "time": dt.strftime("%H:%M"),
                "value": round(val, 1),
                "upper": round(val * 1.1, 1),
                "lower": round(val * 0.9, 1),
                "type": "prediction"
            })
            
        return {
            "history": history,
            "prediction": prediction,
            "confidence": 92.5, # 预测置信度
            "saving_potential": 12.8 # 节能潜力 (%)
        }
