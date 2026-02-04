# **创电云 CarbonOST™ 技术实现方案**

**Technical Implementation Specification for AI IDE Development**

## **1\. 文档信息**

| 项目 | 内容 |
| :---- | :---- |
| **文档类型** | 技术实现方案 (Technical Specification) |
| **产品名称** | 创电云 CarbonOST™ |
| **版本** | v1.0 |
| **编写日期** | 2026年2月4日 |
| **目标读者** | AI IDE、工程师团队、技术负责人 |
| **文档目的** | 提供完整的技术架构和代码实现指南，支持自动化开发 |

## **2\. 技术方案总览**

### **核心技术栈**

**前端框架:**

* **Next.js 14 (App Router)**  
* **React 18**  
* **TypeScript 5**  
* **TailwindCSS 3 \+ shadcn/ui**  
* **Recharts / Apache ECharts** (图表)  
* **MapBox GL JS** (地图)

**后端框架:**

* **FastAPI** (Python 3.11+)  
* **PostgreSQL 15** (主数据库)  
* **InfluxDB 2.x** (时序数据)  
* **Redis 7** (缓存)  
* **MinIO** (对象存储)

**AI引擎:**

* **OpenAI GPT-4 API**  
* **LangChain** (RAG框架)  
* **scikit-learn / Prophet** (时序预测)  
* **TensorFlow Lite** (边缘计算)

**基础设施:**

* **Docker \+ Kubernetes**  
* **Nginx** (反向代理)  
* **RabbitMQ** (消息队列)  
* **Grafana \+ Prometheus** (监控)

## **3\. 系统架构设计**

### **3.1 总体架构图**

* **客户端层 (Client Layer):** Web App (Next.js), Mobile (React Native), Dashboard (大屏), API Docs  
* **API 网关层 (API Gateway):** Nginx \+ Kong (认证、限流、路由、日志)  
* **应用服务层 (Application Layer):** User Service, Carbon Service, Energy Service, Report Service (FastAPI)  
* **AI 引擎层 (AI Engine Layer):** Diagnostic Engine (LangChain), Prediction Engine (Prophet), Calculator, Report Generator (GPT-4)  
* **数据层 (Data Layer):** PostgreSQL (业务数据), InfluxDB (时序数据), Redis (缓存), MinIO (文件)  
* **数据接入层 (Data Ingestion Layer):** IoT Gateway (MQTT), Excel Import (Pandas), API Integration (REST), Manual Input (Form)

### **3.2 微服务拆分**

| 服务名称 | 职责 | 技术栈 | 端口 |
| :---- | :---- | :---- | :---- |
| **user-service** | 用户认证、权限管理、组织架构 | FastAPI \+ PostgreSQL | 8001 |
| **carbon-service** | 碳核算、碳地图、对标分析 | FastAPI \+ PostgreSQL \+ InfluxDB | 8002 |
| **energy-service** | 能源优化、负荷预测、设备管理 | FastAPI \+ InfluxDB \+ Redis | 8003 |
| **report-service** | 报告生成、模板管理、导出 | FastAPI \+ PostgreSQL \+ MinIO | 8004 |
| **ai-service** | AI诊断、GPT调用、模型推理 | FastAPI \+ LangChain \+ OpenAI | 8005 |
| **data-service** | 数据接入、清洗、ETL | FastAPI \+ Pandas \+ Celery | 8006 |
| **notification-service** | 消息通知、邮件、短信 | FastAPI \+ RabbitMQ | 8007 |

## **4\. 数据库设计**

### **4.1 PostgreSQL 数据库结构 (核心业务数据)**

#### **用户与组织架构**

\-- 用户表  
CREATE TABLE users (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    email VARCHAR(255) UNIQUE NOT NULL,  
    password\_hash VARCHAR(255) NOT NULL,  
    full\_name VARCHAR(100),  
    phone VARCHAR(20),  
    role VARCHAR(50) DEFAULT 'user', \-- admin, manager, user, viewer  
    status VARCHAR(20) DEFAULT 'active', \-- active, inactive, suspended  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    last\_login\_at TIMESTAMP  
);  
CREATE INDEX idx\_email ON users(email);  
CREATE INDEX idx\_status ON users(status);

\-- 组织表  
CREATE TABLE organizations (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    name VARCHAR(255) NOT NULL,  
    type VARCHAR(50), \-- park, enterprise, government  
    industry VARCHAR(100),  
    address TEXT,  
    contact\_person VARCHAR(100),  
    contact\_phone VARCHAR(20),  
    subscription\_tier VARCHAR(50) DEFAULT 'basic', \-- basic, professional, enterprise  
    subscription\_expires\_at TIMESTAMP,  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
CREATE INDEX idx\_subscription\_tier ON organizations(subscription\_tier);

\-- 用户组织关联表  
CREATE TABLE user\_organization (  
    user\_id UUID REFERENCES users(id) ON DELETE CASCADE,  
    organization\_id UUID REFERENCES organizations(id) ON DELETE CASCADE,  
    role VARCHAR(50) DEFAULT 'member', \-- owner, admin, member, viewer  
    joined\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    PRIMARY KEY (user\_id, organization\_id)  
);

#### **园区/企业结构**

\-- 园区表  
CREATE TABLE parks (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    organization\_id UUID REFERENCES organizations(id) ON DELETE CASCADE,  
    name VARCHAR(255) NOT NULL,  
    area\_sqm DECIMAL(12,2), \-- 面积(平方米)  
    location JSONB, \-- {lat: xx, lng: xx, address: "xxx"}  
    industry\_type VARCHAR(100),  
    established\_year INTEGER,  
    total\_companies INTEGER,  
    total\_employees INTEGER,  
    annual\_revenue DECIMAL(15, 2),  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
CREATE INDEX idx\_org ON parks(organization\_id);

\-- 建筑物表  
CREATE TABLE buildings (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    park\_id UUID REFERENCES parks(id) ON DELETE CASCADE,  
    name VARCHAR(255) NOT NULL,  
    building\_type VARCHAR(50), \-- office, factory, warehouse, dormitory  
    floors INTEGER,  
    area\_sqm DECIMAL(10, 2),  
    location JSONB, \-- 3D坐标和GeoJSON  
    year\_built INTEGER,  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
CREATE INDEX idx\_park ON buildings(park\_id);

\-- 设备表  
CREATE TABLE devices (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    building\_id UUID REFERENCES buildings(id) ON DELETE CASCADE,  
    name VARCHAR(255) NOT NULL,  
    device\_type VARCHAR(50), \-- meter, sensor, hvac, boiler, chiller  
    manufacturer VARCHAR(100),  
    model VARCHAR(100),  
    rated\_power\_kw DECIMAL(10, 2),  
    install\_date DATE,  
    warranty\_expires DATE,  
    status VARCHAR(20) DEFAULT 'online', \-- online, offline, maintenance, fault  
    config JSONB, \-- 设备配置参数  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
CREATE INDEX idx\_building ON devices(building\_id);  
CREATE INDEX idx\_status\_device ON devices(status);  
CREATE INDEX idx\_type ON devices(device\_type);

#### **碳排放数据**

\-- 碳核算记录表(月度/年度汇总)  
CREATE TABLE carbon\_emissions (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    organization\_id UUID REFERENCES organizations(id) ON DELETE CASCADE,  
    park\_id UUID REFERENCES parks(id) ON DELETE SET NULL,  
    building\_id UUID REFERENCES buildings(id) ON DELETE SET NULL,  
    period\_start DATE NOT NULL,  
    period\_end DATE NOT NULL,  
    period\_type VARCHAR(20), \-- daily, monthly, yearly  
      
    \-- Scope 1 直接排放(单位:吨CO2e)  
    scope1\_total DECIMAL(12, 2\) DEFAULT 0,  
    scope1\_natural\_gas DECIMAL(12, 2\) DEFAULT 0,  
    scope1\_diesel DECIMAL(12, 2\) DEFAULT 0,  
    scope1\_gasoline DECIMAL(12, 2\) DEFAULT 0,  
    scope1\_coal DECIMAL(12, 2\) DEFAULT 0,  
    scope1\_refrigerants DECIMAL(12, 2\) DEFAULT 0,  
      
    \-- Scope 2 间接排放(电力)  
    scope2\_total DECIMAL(12, 2\) DEFAULT 0,  
    scope2\_purchased\_electricity DECIMAL(12, 2\) DEFAULT 0,  
    scope2\_purchased\_heat DECIMAL(12, 2\) DEFAULT 0,  
    scope2\_purchased\_steam DECIMAL(12, 2\) DEFAULT 0,  
      
    \-- Scope 3 其他间接排放  
    scope3\_total DECIMAL(12, 2\) DEFAULT 0,  
    scope3\_business\_travel DECIMAL(12, 2\) DEFAULT 0,  
    scope3\_waste DECIMAL(12, 2\) DEFAULT 0,  
    scope3\_water DECIMAL(12, 2\) DEFAULT 0,  
    scope3\_supply\_chain DECIMAL(12, 2\) DEFAULT 0,  
      
    \-- 总排放  
    total\_emissions DECIMAL(12, 2\) GENERATED ALWAYS AS (scope1\_total \+ scope2\_total \+ scope3\_total) STORED,  
      
    \-- 能源消耗(原始数据)  
    electricity\_kwh DECIMAL(12, 2\) DEFAULT 0,  
    natural\_gas\_m3 DECIMAL(12, 2\) DEFAULT 0,  
    diesel\_liters DECIMAL(12, 2\) DEFAULT 0,  
      
    \-- 计算参数  
    emission\_factors JSONB, \-- 排放因子记录  
    calculation\_method VARCHAR(100), \-- ISO14064, GHGP, China\_Standard  
    data\_quality\_score DECIMAL(3, 2), \-- 0-1  
      
    \-- 元数据  
    calculated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    calculated\_by UUID REFERENCES users(id),  
    notes TEXT  
);  
CREATE INDEX idx\_org\_period ON carbon\_emissions(organization\_id, period\_start);  
CREATE INDEX idx\_park\_period ON carbon\_emissions(park\_id, period\_start);  
CREATE INDEX idx\_period\_type ON carbon\_emissions(period\_type);

\-- 碳排放因子表  
CREATE TABLE emission\_factors (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    region VARCHAR(100), \-- 地区(如江苏省、苏州市)  
    energy\_type VARCHAR(50), \-- electricity, natural\_gas, diesel, etc.  
    factor\_value DECIMAL(10, 6), \-- 排放因子值(kgCO2e/单位)  
    unit VARCHAR(20), \-- kWh, m3, liter, kg  
    source VARCHAR(255), \-- 数据来源  
    valid\_from DATE,  
    valid\_to DATE,  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
CREATE INDEX idx\_region\_type ON emission\_factors(region, energy\_type);  
CREATE INDEX idx\_valid ON emission\_factors(valid\_from, valid\_to);

#### **报告与合规**

\-- 报告表  
CREATE TABLE reports (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    organization\_id UUID REFERENCES organizations(id) ON DELETE CASCADE,  
    title VARCHAR(255) NOT NULL,  
    report\_type VARCHAR(50), \-- government, certification, esg, internal  
    template\_id UUID,  
    period\_start DATE,  
    period\_end DATE,  
    status VARCHAR(20) DEFAULT 'draft', \-- draft, generating, completed, submitted  
    content JSONB, \-- 报告结构化内容  
    pdf\_url TEXT, \-- 生成的PDF链接  
    docx\_url TEXT, \-- 生成的DOCX链接  
    generated\_by VARCHAR(50) DEFAULT 'ai', \-- ai, manual  
    generated\_at TIMESTAMP,  
    submitted\_at TIMESTAMP,  
    created\_by UUID REFERENCES users(id),  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
CREATE INDEX idx\_org\_type ON reports(organization\_id, report\_type);  
CREATE INDEX idx\_status\_reports ON reports(status);

\-- 报告模板表  
CREATE TABLE report\_templates (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    name VARCHAR(255) NOT NULL,  
    description TEXT,  
    category VARCHAR(50), \-- government, iso, esg  
    template\_content JSONB, \-- 模板结构  
    preview\_image TEXT,  
    is\_active BOOLEAN DEFAULT true,  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
CREATE INDEX idx\_category ON report\_templates(category);

#### **AI诊断与对标**

\-- AI诊断记录  
CREATE TABLE ai\_diagnostics (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    organization\_id UUID REFERENCES organizations(id) ON DELETE CASCADE,  
    park\_id UUID REFERENCES parks(id) ON DELETE SET NULL,  
    diagnosis\_type VARCHAR(50), \-- comprehensive, energy, emission, optimization  
    input\_data JSONB, \-- 输入数据快照  
    output\_report JSONB, \-- AI生成的诊断报告  
    recommendations JSONB\[\], \-- 建议清单  
    priority\_actions JSONB\[\], \-- 优先行动  
    estimated\_savings JSONB, \-- 预计节省(成本、碳排放)  
    confidence\_score DECIMAL(3,2), \-- AI置信度  
    processing\_time\_seconds INTEGER,  
    model\_version VARCHAR(50),  
    created\_by UUID REFERENCES users(id),  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
CREATE INDEX idx\_org\_ai ON ai\_diagnostics(organization\_id);  
CREATE INDEX idx\_created ON ai\_diagnostics(created\_at);

\-- 对标数据  
CREATE TABLE benchmarks (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    industry VARCHAR(100),  
    region VARCHAR(100),  
    scale\_category VARCHAR(50), \-- small, medium, large  
    metric\_name VARCHAR(100), \-- carbon\_intensity, energy\_intensity, etc.  
    metric\_value DECIMAL(12, 2),  
    unit VARCHAR(50),  
    percentile\_25 DECIMAL(12, 2),  
    percentile\_50 DECIMAL(12, 2),  
    percentile\_75 DECIMAL(12, 2),  
    percentile\_90 DECIMAL(12, 2),  
    sample\_size INTEGER,  
    data\_year INTEGER,  
    source VARCHAR(255),  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);  
CREATE INDEX idx\_industry\_region ON benchmarks(industry, region);  
CREATE INDEX idx\_metric ON benchmarks(metric\_name);

### **4.2 InfluxDB 时序数据结构 (能耗监测)**

**Measurement:** energy\_consumption

**Tags:** device\_id, building\_id, park\_id, organization\_id, device\_type, energy\_type

**Fields:** value (DECIMAL), status (STRING), quality (INTEGER 0-100)

**Line Protocol 示例:**

energy\_consumption,device\_id=meter\_001,building\_id=bld\_a,park\_id=park\_1,organization\_id=org\_x,device\_type=electric\_meter,energy\_type=electricity value=125.6,status="online",quality=95 1709558400000000000

power\_consumption,device\_id=hvac\_001,building\_id=bld\_a,device\_type=hvac value=45.2,efficiency=0.85 1709558400000000000

temperature,device\_id=sensor\_001,building\_id=bld\_a,zone="zone\_a" value=22.5,humidity=55 1709558400000000000

carbon\_realtime,park\_id=park\_1,scope="scope2" value=12.34 1709558400000000000

**数据保留策略 (Retention Policy):**

* raw\_data: 30天 (原始1分钟数据)  
* hourly\_data: 1年 (小时聚合)  
* daily\_data: 5年 (日聚合)  
* monthly\_data: 永久 (月聚合)

## **5\. 核心功能实现**

### **5.1 碳核算引擎 (carbon-service)**

**文件:** backend/services/carbon-service/app/core/calculator.py

from typing import Dict, List, Optional  
from datetime import datetime  
from decimal import Decimal  
from pydantic import BaseModel

class EmissionInput(BaseModel):  
    """碳排放计算输入"""  
    energy\_type: str \# electricity, natural\_gas, diesel, etc.  
    consumption: Decimal \# 消耗量  
    unit: str \# kWh, m3, liter  
    region: str \# 地区(用于选择排放因子)  
    period\_start: datetime  
    period\_end: datetime  
    data\_source: str \= "meter" \# meter, manual, estimated  
    data\_quality: float \= 1.0 \# 0-1

class EmissionResult(BaseModel):  
    """碳排放计算结果"""  
    scope: int \# 1, 2, or 3  
    energy\_type: str  
    consumption: Decimal  
    unit: str  
    emission\_factor: Decimal  
    emissions\_co2e: Decimal \# 吨CO2当量  
    calculation\_method: str  
    data\_quality\_score: float  
    metadata: Dict

class CarbonCalculator:  
    """碳核算引擎"""  
    def \_\_init\_\_(self, db\_session, emission\_factors\_service):  
        self.db \= db\_session  
        self.factors \= emission\_factors\_service

    async def calculate\_scope1(self, inputs: List\[EmissionInput\]) \-\> List\[EmissionResult\]:  
        """计算Scope 1直接排放"""  
        results \= \[\]  
        for inp in inputs:  
            \# 获取对应的排放因子  
            factor \= await self.factors.get\_factor(  
                region=inp.region,  
                energy\_type=inp.energy\_type,  
                date=inp.period\_start  
            )  
            \# 计算排放量(吨CO2e)  
            emissions \= inp.consumption \* factor.factor\_value / 1000  
              
            result \= EmissionResult(  
                scope=1,  
                energy\_type=inp.energy\_type,  
                consumption=inp.consumption,  
                unit=inp.unit,  
                emission\_factor=factor.factor\_value,  
                emissions\_co2e=emissions,  
                calculation\_method="IPCC\_2006",  
                data\_quality\_score=inp.data\_quality \* factor.quality\_score,  
                metadata={  
                    "factor\_source": factor.source,  
                    "factor\_valid\_from": factor.valid\_from.isoformat(),  
                    "data\_source": inp.data\_source  
                }  
            )  
            results.append(result)  
        return results

    async def calculate\_scope2(self, electricity\_kwh: Decimal, region: str, method: str \= "location\_based") \-\> EmissionResult:  
        """计算Scope 2间接排放(电力)"""  
        if method \== "location\_based":  
            factor \= await self.factors.get\_grid\_factor(region)  
        elif method \== "market\_based":  
            factor \= await self.factors.get\_custom\_factor(region)  
          
        emissions \= electricity\_kwh \* factor.factor\_value / 1000  
          
        return EmissionResult(  
            scope=2,  
            energy\_type="electricity",  
            consumption=electricity\_kwh,  
            unit="kWh",  
            emission\_factor=factor.factor\_value,  
            emissions\_co2e=emissions,  
            calculation\_method=f"GHGP\_{method}",  
            data\_quality\_score=0.95,  
            metadata={  
                "grid\_region": region,  
                "factor\_year": factor.data\_year  
            }  
        )  
      
    \# ... scope3 calculation and aggregation methods ...

### **5.2 AI诊断引擎 (ai-service)**

**文件:** backend/services/ai-service/app/core/diagnostic\_engine.py

from typing import Dict, List  
from langchain.chat\_models import ChatOpenAI  
from langchain.prompts import ChatPromptTemplate  
from langchain.chains import LLMChain  
from langchain.vectorstores import Chroma  
from langchain.embeddings import OpenAIEmbeddings  
import json

class DiagnosticEngine:  
    """AI诊断引擎"""  
    def \_\_init\_\_(self, openai\_api\_key: str):  
        self.llm \= ChatOpenAI(  
            model="gpt-4-turbo-preview",  
            temperature=0.3,  
            api\_key=openai\_api\_key  
        )  
        self.vectorstore \= Chroma(  
            embedding\_function=OpenAIEmbeddings(api\_key=openai\_api\_key),  
            persist\_directory="./data/rag\_db"  
        )

    async def generate\_comprehensive\_diagnosis(self, emission\_data: Dict, energy\_data: Dict, organization\_info: Dict, benchmark\_data: Dict) \-\> Dict:  
        """生成综合诊断报告"""  
        \# 1\. 数据分析 (Mock function call)  
        \# analysis \= await self.\_analyze\_data(...)  
          
        \# 2\. 检索相关案例 (RAG)  
        \# relevant\_cases \= await self.\_retrieve\_relevant\_cases(...)  
          
        \# 3\. 生成报告  
        diagnosis \= await self.\_generate\_diagnosis\_report(  
            emission\_data=emission\_data,  
            energy\_data=energy\_data,  
            organization\_info=organization\_info,  
            benchmark\_data=benchmark\_data,  
            analysis={}, \# placeholder  
            relevant\_cases=\[\] \# placeholder  
        )  
          
        \# 4\. 生成行动计划  
        action\_plan \= await self.\_generate\_action\_plan(diagnosis, organization\_info)  
          
        return {  
            "diagnosis": diagnosis,  
            "action\_plan": action\_plan,  
            "confidence\_score": 0.95  
        }

    async def \_generate\_diagnosis\_report(self, \*\*kwargs) \-\> Dict:  
        prompt\_template \= ChatPromptTemplate.from\_messages(\[  
            ("system", """你是创电云CarbonOS的高级碳排放诊断专家。  
            你的任务是分析园区/企业的碳排放和能耗数据,生成专业的诊断报告。  
            输出格式必须是结构化的JSON。"""),  
            ("user", """请分析以下数据: {organization\_info}, {emission\_data}""")  
        \])  
        \# ... chain execution ...  
        return {} \# Mock return

    async def \_generate\_action\_plan(self, diagnosis: Dict, organization\_info: Dict) \-\> List\[Dict\]:  
        \# ... logic to generate actionable items sorted by ROI ...  
        return \[\]

### **5.3 能源优化引擎 (energy-service)**

**文件:** backend/services/energy-service/app/core/optimizer.py

from typing import List, Dict  
import numpy as np  
from prophet import Prophet  
import pandas as pd

class EnergyOptimizer:  
    """能源优化引擎"""  
      
    async def predict\_load(self, historical\_data: pd.DataFrame, forecast\_horizon\_hours: int \= 24\) \-\> pd.DataFrame:  
        """负荷预测(使用Facebook Prophet)"""  
        df \= historical\_data\[\['timestamp', 'load\_kw'\]\].rename(  
            columns={'timestamp': 'ds', 'load\_kw': 'y'}  
        )  
          
        model \= Prophet(  
            daily\_seasonality=True,  
            weekly\_seasonality=True,  
            yearly\_seasonality=True  
        )  
        model.add\_country\_holidays(country\_name='CN')  
        model.fit(df)  
          
        future \= model.make\_future\_dataframe(periods=forecast\_horizon\_hours, freq='H')  
        forecast \= model.predict(future)  
        return forecast\[\['ds', 'yhat', 'yhat\_lower', 'yhat\_upper'\]\]

    async def optimize\_peak\_shaving(self, load\_forecast: pd.DataFrame, battery\_capacity\_kwh: float, battery\_power\_kw: float, electricity\_prices: Dict\[int, float\]) \-\> Dict:  
        """削峰填谷优化(简化逻辑)"""  
        \# 实际应使用 scipy.optimize.linprog 或 CVXPY  
        return {  
            "original\_cost": 12345.67,  
            "optimized\_cost": 9876.54,  
            "savings": 2469.13,  
            "savings\_percentage": 20.0  
        }

### **5.4 报告生成引擎 (report-service)**

**文件:** backend/services/report-service/app/core/report\_generator.py

from typing import Dict  
from weasyprint import HTML  
import docx  
import uuid

class ReportGenerator:  
    """报告生成引擎"""  
      
    async def generate\_government\_report(self, organization\_data: Dict, emission\_data: Dict, period: Dict) \-\> Dict:  
        """生成政府监管报告"""  
        \# 渲染HTML  
        \# html\_content \= await self.\_render\_template(...)  
        html\_content \= "\<h1\>Report\</h1\>" \# Mock  
          
        pdf\_path \= await self.\_generate\_pdf(html\_content)  
        docx\_path \= await self.\_generate\_docx({})  
          
        return {  
            "pdf\_url": f"http://minio/{pdf\_path}",  
            "docx\_url": f"http://minio/{docx\_path}"  
        }

    async def \_generate\_pdf(self, html\_content: str) \-\> str:  
        pdf\_path \= f"/tmp/report\_{uuid.uuid4()}.pdf"  
        HTML(string=html\_content).write\_pdf(pdf\_path)  
        return pdf\_path

    async def \_generate\_docx(self, report\_data: Dict) \-\> str:  
        doc \= docx.Document()  
        doc.add\_heading('企业温室气体排放核算报告', level=0)  
        docx\_path \= f"/tmp/report\_{uuid.uuid4()}.docx"  
        doc.save(docx\_path)  
        return docx\_path

## **6\. 前端实现**

### **6.1 项目结构**

frontend/  
  app/  
    (auth)/  
      login/  
      register/  
    (dashboard)/  
      dashboard/      \# 主仪表盘  
      carbon/  
        map/          \# 碳地图  
        calculation/  \# 碳核算  
        diagnosis/    \# AI诊断  
      energy/  
      reports/  
      settings/  
  components/  
    ui/               \# shadcn/ui组件  
    charts/           \# 图表组件  
    maps/             \# 地图组件  
  lib/  
    api/

### **6.2 核心页面 (Dashboard)**

**文件:** frontend/app/(dashboard)/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';  
import { Card } from '@/components/ui/card';  
import { EmissionChart } from '@/components/charts/EmissionChart';  
import { RealtimeCarbonMap } from '@/components/maps/RealtimeCarbonMap';  
import { apiClient } from '@/lib/api/client';

export default function DashboardPage() {  
  const \[dashboardData, setDashboardData\] \= useState\<any\>(null);  
  const \[loading, setLoading\] \= useState(true);

  useEffect(() \=\> {  
    loadDashboardData();  
    const interval \= setInterval(loadDashboardData, 30000); // 30s update  
    return () \=\> clearInterval(interval);  
  }, \[\]);

  async function loadDashboardData() {  
    try {  
      const data \= await apiClient.get('/api/v1/dashboard');  
      setDashboardData(data);  
    } catch (error) {  
      console.error('Failed to load dashboard data:', error);  
    } finally {  
      setLoading(false);  
    }  
  }

  if (loading || \!dashboardData) return \<div\>Loading...\</div\>;

  return (  
    \<div className="space-y-6 p-6"\>  
      {/\* 关键指标 \*/}  
      \<div className="grid grid-cols-1 md:grid-cols-2 gap-6"\>  
        \<Card className="p-6"\>  
            \<h2 className="text-xl font-semibold mb-4"\>实时碳地图\</h2\>  
            \<RealtimeCarbonMap data={dashboardData.carbonMap} height={400} /\>  
        \</Card\>  
        \<Card className="p-6"\>  
            \<h2 className="text-xl font-semibold mb-4"\>碳排放趋势\</h2\>  
            \<EmissionChart data={dashboardData.emissionTrend} height={300} /\>  
        \</Card\>  
      \</div\>  
    \</div\>  
  );  
}

## **7\. 部署架构**

### **7.1 Docker Compose (开发环境)**

version: '3.8'  
services:  
  frontend:  
    build: ./frontend  
    ports: \["3000:3000"\]  
    depends\_on: \[api-gateway\]  
      
  api-gateway:  
    image: nginx:alpine  
    ports: \["8000:80"\]  
    depends\_on: \[user-service, carbon-service\]

  user-service:  
    build: ./backend/services/user-service  
    ports: \["8001:8001"\]  
    environment:  
      \- DATABASE\_URL=postgresql://carbonos:password@postgres:5432/carbonos  
    depends\_on: \[postgres, redis\]

  carbon-service:  
    build: ./backend/services/carbon-service  
    ports: \["8002:8002"\]  
    depends\_on: \[postgres, influxdb\]

  postgres:  
    image: postgres:15-alpine  
    ports: \["5432:5432"\]  
    environment:  
      POSTGRES\_USER: carbonos  
      POSTGRES\_PASSWORD: password  
      POSTGRES\_DB: carbonos  
        
  influxdb:  
    image: influxdb:2.7-alpine  
    ports: \["8086:8086"\]  
      
  redis:  
    image: redis:7-alpine  
    ports: \["6379:6379"\]  
      
  minio:  
    image: minio/minio:latest  
    ports: \["9000:9000", "9001:9001"\]

## **8\. 开发任务分解 (MVP阶段 \- 3个月)**

* **Week 1-2: 基础设施搭建**  
  * \[ \] 初始化Git仓库  
  * \[ \] 配置Docker开发环境  
  * \[ \] 搭建PostgreSQL \+ InfluxDB  
  * \[ \] 创建Next.js和FastAPI项目结构  
* **Week 3-4: 用户系统**  
  * \[ \] 用户注册/登录API (JWT)  
  * \[ \] 组织管理模块  
  * \[ \] 前端登录页面  
* **Week 5-6: 数据接入**  
  * \[ \] Excel导入功能  
  * \[ \] 表单手动填报  
  * \[ \] 前端上传界面  
* **Week 7-8: 碳核算引擎**  
  * \[ \] 排放因子数据库  
  * \[ \] Scope 1/2 计算逻辑  
  * \[ \] 碳核算API  
* **Week 9-10: 基础仪表盘**  
  * \[ \] Dashboard API  
  * \[ \] 基础图表开发 (ECharts)  
* **Week 11: 报告生成**  
  * \[ \] HTML模板设计  
  * \[ \] PDF生成功能  
* **Week 12: 测试与部署**  
  * \[ \] 单元测试 & 集成测试  
  * \[ \] 生产环境部署 (K8s)

## **9\. 安全与监控**

### **9.1 认证与限流 (Python)**

\# JWT Auth  
from fastapi.security import HTTPBearer  
from jose import jwt

SECRET\_KEY \= "your-secret-key"  
ALGORITHM \= "HS256"

def create\_access\_token(data: dict):  
    \# implementation...  
    pass

\# Redis Rate Limiter  
from redis import Redis  
from fastapi import HTTPException

redis\_client \= Redis(host='localhost', port=6379, db=0)

async def rate\_limiter(request):  
    client\_ip \= request.client.host  
    key \= f"rate\_limit:{client\_ip}"  
    \# check limit...

## **10\. API文档规范 (OpenAPI 3.0)**

openapi: 3.0.0  
info:  
  title: CarbonOS API  
  version: 1.0.0  
  description: 创电云零碳园区智能运营平台API文档  
paths:  
  /carbon/calculate:  
    post:  
      summary: 计算碳排放  
      tags: \[Carbon\]  
      requestBody:  
        content:  
          application/json:  
            schema:  
              type: object  
              properties:  
                organization\_id: {type: string, format: uuid}  
                energy\_data:  
                  type: object  
                  properties:  
                    electricity\_kwh: {type: number}  
                    natural\_gas\_m3: {type: number}  
