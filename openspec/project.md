# Project Context

## Purpose
苏州创电云（scdc.cloud）官方网站，展示公司在新能源资产管理、零碳园区、AI算力服务和数字资产领域的业务能力。

**品牌定位**：连接"物理能源世界"与"数字价值世界"的桥梁
**核心口号**：绿色能源驱动智算未来 · 数字资产链接全球价值

### 目标受众
- **ToB**：电站业主、算力中心投资人
- **ToG**：政府/园区决策者
- **Web3/金融投资者**：RWA 资产投资者

## Tech Stack
- **构建工具**: Vite 6.x
- **前端框架**: React 18.x + TypeScript 5.6
- **样式方案**: Tailwind CSS 3.4
- **路由**: React Router Dom 7.x
- **动画**: Framer Motion 11.x
- **图标**: Lucide React
- **代码检查**: ESLint 9.x + TypeScript ESLint

## Project Conventions

### Code Style
- 使用 TypeScript 严格模式
- 组件使用函数式组件 + Hooks
- 文件命名: PascalCase 用于组件 (如 `Header.tsx`)，kebab-case 用于工具函数
- CSS 类名使用 Tailwind 实用类

### Architecture Patterns
- **页面组织**: `src/pages/` 存放各页面组件
- **组件结构**: `src/components/` 存放可复用组件，按功能分子目录 (如 `layout/`)
- **路由配置**: 集中在 `App.tsx` 使用 React Router 配置

```
src/
├── App.tsx              # 路由配置入口
├── components/
│   ├── layout/          # 布局组件 (Header, Footer)
│   └── ScrollToTop.tsx  # 滚动辅助组件
├── pages/               # 页面组件
│   ├── Home.tsx
│   ├── CoreTech.tsx
│   ├── EnergySolutions.tsx
│   ├── ZeroCarbonPark.tsx
│   ├── AIComputing.tsx
│   ├── DigitalAssets.tsx
│   └── About.tsx
└── index.css            # 全局样式
```

### Testing Strategy
- 目前暂无自动化测试配置
- 手动测试: `npm run dev` 启动开发服务器进行功能验证
- 类型检查: `npm run type-check` 验证 TypeScript 类型

### Git Workflow
- 主分支: `main`
- 功能开发使用 feature 分支
- 提交信息使用中文描述

## Domain Context
### 业务领域
- **核心技术**: BMS 电池管理系统、EMS 能源管理系统、VPP 虚拟电厂
- **能源解决方案**: 工商业储能、分布式光伏、智能充电场站
- **零碳园区**: 源网荷储一体化、数字化碳管理平台
- **AI 算力服务**: 算力中心组网、AIOps 智能运维
- **数字资产**: 国内 RDA (数据资产入表)、海外 RWA (资产通证化)

### SEO 关键词
- 一级词：工商业储能、EMS能源管理系统、零碳园区解决方案、AI算力运维
- 二级词：虚拟电厂(VPP)、数据资产入表、源网荷储一体化、碳管理平台
- 长尾词：苏州零碳园区建设、绿色工厂申报、欧盟CBAM应对方案

## Important Constraints
- 网站需要支持响应式设计（桌面端 + 移动端）
- 设计风格需体现专业、科技、绿色环保的品牌调性
- 首页背景需支持视频素材（待素材就绪后替换）
- 部分数据指标需替换为真实数据

## External Dependencies
- **部署目标**: 腾讯轻量云服务器
- **域名**: scdc.cloud
- **CDN/存储**: 腾讯云对象存储（200GB）
- **素材来源**: 公司实拍照片、BMS/EMS 软件截图、团队照片
