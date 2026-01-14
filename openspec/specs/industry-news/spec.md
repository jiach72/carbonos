# industry-news Specification

## Purpose
TBD - created by archiving change add-industry-news. Update Purpose after archive.
## Requirements
### Requirement: 行业动态导航入口
网站导航栏 SHALL 包含"行业动态"链接，点击后跳转至 `/news` 页面。

#### Scenario: 用户从导航访问行业动态
- **WHEN** 用户点击导航栏中的"行业动态"链接
- **THEN** 页面跳转至 `/news` 路由
- **AND** 行业动态页面正确加载

#### Scenario: 移动端菜单包含行业动态
- **WHEN** 用户在移动端展开导航菜单
- **THEN** 菜单中包含"行业动态"选项
- **AND** 点击后正确跳转

---

### Requirement: 行业动态页面展示
系统 SHALL 提供行业动态页面，展示来自多个 RSS 源的新闻资讯。

#### Scenario: 页面加载成功
- **WHEN** 用户访问 `/news` 页面
- **THEN** 页面显示新闻列表
- **AND** 显示四个分类标签（新能源、AI 算力、新能源金融、零碳园区）

#### Scenario: RSS 获取失败时的降级
- **WHEN** RSS 源获取失败
- **THEN** 页面显示友好的错误提示
- **AND** 展示预置的示例新闻数据

---

### Requirement: 新闻分类筛选
系统 SHALL 支持按类别筛选新闻内容。

#### Scenario: 选择特定分类
- **WHEN** 用户点击某个分类标签（如"新能源"）
- **THEN** 页面仅显示该分类下的新闻
- **AND** 该分类标签显示为激活状态

#### Scenario: 查看全部新闻
- **WHEN** 用户点击"全部"标签
- **THEN** 页面显示所有分类的新闻

---

### Requirement: 新闻卡片展示
每条新闻 SHALL 以卡片形式展示，包含：标题、摘要、来源、发布时间。

#### Scenario: 点击新闻卡片
- **WHEN** 用户点击新闻卡片
- **THEN** 在新标签页打开新闻原文链接

#### Scenario: 新闻时间显示
- **WHEN** 新闻卡片渲染
- **THEN** 发布时间以相对时间格式显示（如"2小时前"）

---

### Requirement: 响应式布局
行业动态页面 SHALL 支持桌面端和移动端的响应式显示。

#### Scenario: 桌面端布局
- **WHEN** 用户在宽屏设备访问页面
- **THEN** 新闻卡片以多列网格布局展示

#### Scenario: 移动端布局
- **WHEN** 用户在移动设备访问页面
- **THEN** 新闻卡片以单列堆叠布局展示
- **AND** 分类标签支持横向滚动

