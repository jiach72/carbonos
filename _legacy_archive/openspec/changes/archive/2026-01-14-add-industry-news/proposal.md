# Change: 添加行业动态页面与 RSS 新闻聚合功能

## Why
为苏州创电云官网增加行业动态内容，通过 RSS 聚合展示新能源、AI 算力、新能源金融、零碳园区四个领域的最新资讯，增强网站内容活力和用户粘性，同时提升 SEO 表现。

## What Changes
- **新增"行业动态"导航入口**：在 Header 导航栏添加"行业动态"链接
- **新增行业动态页面** (`/news`)：展示四个分类的新闻资讯
  - 新能源 (New Energy)
  - AI 算力 (AI Computing)
  - 新能源金融 (Green Finance)
  - 零碳园区 (Zero Carbon)
- **RSS 数据获取服务**：通过 CORS 代理或本地缓存获取 RSS 源数据
- **新闻卡片组件**：展示新闻标题、摘要、来源、发布时间
- **分类筛选功能**：支持按类别过滤新闻

## Impact
- 受影响的组件：
  - `src/components/layout/Header.tsx` - 添加导航链接
  - `src/App.tsx` - 添加路由配置
- 新增文件：
  - `src/pages/News.tsx` - 行业动态页面
  - `src/services/rssService.ts` - RSS 数据服务
  - `src/types/news.ts` - 新闻数据类型定义
  - `src/components/news/NewsCard.tsx` - 新闻卡片组件
  - `src/components/news/CategoryFilter.tsx` - 分类筛选组件
