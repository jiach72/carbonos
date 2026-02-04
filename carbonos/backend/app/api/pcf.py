
from fastapi import APIRouter, HTTPException
from app.services.pcf import PCFService

router = APIRouter(tags=["PCF"])

@router.get("/pcf/products")
async def list_products():
    """获取产品碳足迹列表"""
    return PCFService.list_products()

@router.get("/pcf/products/{product_id}")
async def get_product_detail(product_id: str):
    """获取产品碳足迹详情"""
    data = PCFService.get_product_detail(product_id)
    if not data:
        raise HTTPException(status_code=404, detail="Product not found")
    return data
