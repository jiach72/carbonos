# 行业动态 RSS 聚合 - 技术设计

## Context
苏州创电云官网需要展示行业动态内容，以增加网站活力和 SEO 价值。由于项目是纯前端 React 应用（无后端），需要考虑如何获取和处理 RSS 源数据。

### 利益相关者
- 网站访客：希望获取行业最新资讯
- 公司市场部：希望展示专业形象，增加用户粘性

## Goals / Non-Goals

### Goals
- 展示四个领域的行业新闻（新能源、AI 算力、新能源金融、零碳园区）
- 支持分类筛选，用户可按兴趣查看特定领域
- 保持网站整体设计风格一致性
- 实现良好的移动端体验

### Non-Goals
- 不实现评论或社交分享功能
- 不实现新闻全文阅读（点击跳转原文）
- 不实现用户订阅/收藏功能
- 不实现自动更新（手动刷新页面获取最新）

## Decisions

### Decision 1: RSS 数据获取方案

**选择方案**：使用客户端 RSS 解析 + 公共 CORS 代理

**原因**：
- 项目为纯前端应用，无后端服务器
- 使用公共 CORS 代理（如 `api.allorigins.win`）绑过 CORS 限制
- 使用 `rss-parser` 或原生 DOMParser 解析 XML

**替代方案考虑**：
1. ❌ 直接请求 RSS URL：大多数 RSS 源不支持 CORS
2. ❌ 部署 Serverless 函数：增加复杂度，超出当前需求范围
3. ❌ 预构建静态数据：数据不够新鲜

### Decision 2: 数据结构设计

```typescript
interface NewsCategory {
  id: string
  name: string
  nameEn: string
  icon: string
  color: string
}

interface NewsItem {
  id: string
  title: string
  summary: string
  link: string
  pubDate: Date
  source: string
  category: string  // category id
  imageUrl?: string
}

interface RSSSource {
  url: string
  category: string
  name: string
}
```

### Decision 3: RSS 数据源选择

为四个领域预配置以下 RSS 源（可后续扩展）：

| 领域 | 推荐 RSS 源 |
|------|-------------|
| 新能源 | 北极星电力网、中国能源网 |
| AI 算力 | 机器之心、量子位、36氪-AI |
| 新能源金融 | 碳中和资讯、绿色金融报道 |
| 零碳园区 | 中国节能协会、碳达峰碳中和 |

> **注意**：需要验证这些 RSS 源的可用性，部分可能需要替换为可用的公开源。

### Decision 4: 降级策略

当 RSS 获取失败时：
1. 显示友好的错误提示
2. 展示预置的示例新闻数据（Mock Data）
3. 提供"重试"按钮

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| CORS 代理服务不稳定 | 新闻内容无法加载 | 配置多个备用代理，实现故障转移 |
| RSS 源关闭或变更 | 某些类别无内容 | 预置 Mock 数据作为降级 |
| 跨时区时间显示问题 | 时间显示不准确 | 统一转换为本地时间显示 |
| 某些 RSS 无图片 | 界面不美观 | 使用分类对应的默认占位图 |

## Migration Plan
无需迁移，为新增功能。

## Open Questions
1. 是否需要缓存 RSS 数据到 localStorage 以减少请求？
2. 是否需要限制每个分类显示的新闻数量？（建议：每类最多 10 条）
3. 新闻排序方式：按时间还是按分类优先？
