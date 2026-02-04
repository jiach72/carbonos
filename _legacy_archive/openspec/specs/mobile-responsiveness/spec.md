# mobile-responsiveness Specification

## Purpose
TBD - created by archiving change optimize-mobile-experience. Update Purpose after archive.
## Requirements
### Requirement: 分类标签横向滚动
在移动端（<640px），分类筛选标签 SHALL 以横向滚动列表形式展示，避免折行。

#### Scenario: 移动端查看分类标签
- **WHEN** 用户在移动设备访问 `/news` 页面
- **THEN** 分类标签以单行横向排列
- **AND** 用户可以左右滑动查看所有标签
- **AND** 滚动条不可见

#### Scenario: 桌面端分类标签
- **WHEN** 用户在桌面端访问 `/news` 页面
- **THEN** 分类标签保持居中折行布局（原有行为）

---

### Requirement: 移动端间距优化
在移动端（<640px），页面区块间距 SHALL 减小以减少滚动量。

#### Scenario: 移动端区块间距
- **WHEN** 用户在移动设备浏览页面
- **THEN** 区块上下间距为 `py-12`（约 48px）

#### Scenario: 桌面端区块间距
- **WHEN** 用户在桌面端浏览页面
- **THEN** 区块上下间距保持 `py-24`（约 96px）

---

### Requirement: 次级按钮对比度
次级按钮（如"关于我们"）在暗色背景下 SHALL 具有足够的视觉对比度。

#### Scenario: 暗色背景按钮显示
- **WHEN** 页面渲染次级按钮
- **THEN** 按钮边框清晰可见
- **AND** 按钮文字与背景形成足够对比

---

### Requirement: 移动端时间轴视觉
在移动端，发展历程时间轴 SHALL 显示垂直引导线以强化时间轴概念。

#### Scenario: 移动端时间轴显示
- **WHEN** 用户在移动设备访问 `/about` 页面的发展历程部分
- **THEN** 左侧显示渐变色垂直线
- **AND** 时间节点与垂直线对齐

---

### Requirement: 扩大点击区域
交互元素（链接、按钮）SHALL 具有至少 44x44px 的点击区域。

#### Scenario: 联系链接点击
- **WHEN** 用户在 `/about` 页面点击联系方式链接
- **THEN** 整个链接卡片区域均可点击

