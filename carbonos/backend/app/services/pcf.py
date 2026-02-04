
from typing import List, Dict, Any

class PCFService:
    """产品碳足迹 (PCF) 模拟服务"""

    # 预置模拟产品数据
    PRODUCTS = [
        {
            "id": "prod_001",
            "name": "LFP 动力电池模组 100kWh",
            "model": "BAT-LFP-100",
            "category": "Battery",
            "total_footprint": 4500.5, # kgCO2e
            "unit": "pack",
            "status": "Certified",
            "image": "battery" 
        },
        {
            "id": "prod_002",
            "name": "高性能液冷服务器机柜",
            "model": "SVR-COOL-24U",
            "category": "Server",
            "total_footprint": 1280.2,
            "unit": "unit",
            "status": "Draft",
            "image": "server"
        },
        {
            "id": "prod_003",
            "name": "商用高效多晶硅光伏板",
            "model": "PV-POLY-450",
            "category": "Solar",
            "total_footprint": 320.8,
            "unit": "module",
            "status": "Verified",
            "image": "solar"
        }
    ]

    # 预置 BOM 详细碳排数据
    BOM_DETAILS = {
        "prod_001": {
            "stages": [
                {"name": "原材料获取", "value": 3200.0, "color": "#f59e0b"},
                {"name": "生产制造", "value": 850.5, "color": "#ef4444"},
                {"name": "分销运输", "value": 150.0, "color": "#3b82f6"},
                {"name": "使用阶段", "value": 0.0, "color": "#10b981"}, # 电池使用本身不产碳
                {"name": "废弃回收", "value": 300.0, "color": "#6b7280"}
            ],
            "materials": [
                {"name": "正极材料 (LFP)", "weight": "450 kg", "footprint": 2100.0},
                {"name": "负极材料 (Graphite)", "weight": "200 kg", "footprint": 800.0},
                {"name": "电解液", "weight": "120 kg", "footprint": 300.0},
                {"name": "铝壳箱体", "weight": "80 kg", "footprint": 850.5} 
            ]
        },
        "prod_002": {
            "stages": [
                {"name": "原材料获取", "value": 800.0, "color": "#f59e0b"},
                {"name": "生产制造", "value": 350.2, "color": "#ef4444"},
                {"name": "分销运输", "value": 80.0, "color": "#3b82f6"},
                {"name": "废弃回收", "value": 50.0, "color": "#6b7280"}
            ],
            "materials": [
                {"name": "钢制机柜框架", "weight": "120 kg", "footprint": 400.0},
                {"name": "液冷管道系统", "weight": "30 kg", "footprint": 250.0},
                {"name": "PDU 电源分配单元", "weight": "10 kg", "footprint": 150.0}
            ]
        }
    }

    @staticmethod
    def list_products() -> List[Dict[str, Any]]:
        """获取产品列表"""
        return PCFService.PRODUCTS

    @staticmethod
    def get_product_detail(product_id: str) -> Dict[str, Any]:
        """获取特定产品的详细碳足迹数据"""
        product = next((p for p in PCFService.PRODUCTS if p["id"] == product_id), None)
        if not product:
            return None
        
        details = PCFService.BOM_DETAILS.get(product_id, {})
        return {**product, **details}
