# 移动端优化 - 技术设计

## Context
苏州创电云官网使用 React + Tailwind CSS 构建，已具备基础响应式能力。移动端审核发现多处体验问题需要优化。

### 问题清单

| 问题 | 位置 | 严重程度 |
|------|------|----------|
| 分类标签折行混乱 | `/news` 页面 | 高 |
| 区块间距过大 | 全站 | 中 |
| 次级按钮对比度低 | 首页 Hero | 中 |
| 时间轴缺少视觉线 | `/about` 页面 | 低 |
| 联系链接点击区域小 | `/about` 页面 | 低 |
| 副标题层级不清 | 首页 Hero | 低 |

## Goals / Non-Goals

### Goals
- 提升移动端（<640px）的阅读和交互体验
- 保持桌面端原有设计不变
- 遵循现有 Tailwind CSS 设计模式

### Non-Goals
- 不重构整体布局架构
- 不添加新的 CSS 框架或库
- 不修改功能逻辑

## Decisions

### Decision 1: 分类标签横向滚动

**方案**：使用 `overflow-x-auto` + `flex-nowrap` 实现横向滚动

```css
/* 移动端分类标签容器 */
.category-scroll {
  @apply flex gap-3 overflow-x-auto pb-2 -mx-4 px-4;
  scrollbar-width: none; /* Firefox */
}
.category-scroll::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
```

**原因**：
- 符合移动端用户习惯（如 App Store 分类标签）
- 无需引入第三方滚动库
- 保持所有标签可见，不被截断

### Decision 2: 响应式间距系统

**方案**：修改 `section-padding` 工具类

```css
.section-padding {
  @apply py-12 sm:py-16 lg:py-24;
}
```

将移动端从 `py-16` 减小到 `py-12`，减少滚动量。

### Decision 3: 按钮对比度

**方案**：增加次级按钮边框宽度和透明度

```css
.btn-secondary {
  @apply border-2 border-primary-500/80 text-primary-400;
}
```

### Decision 4: 移动端时间轴

**方案**：在移动端显示左侧竖线

```tsx
{/* 移动端时间轴线 */}
<div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-secondary-300 md:hidden" />
```

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 横向滚动可能被忽视 | 用户不知道可以滚动 | 首个标签略微超出边界暗示可滚动 |
| 间距改动影响全局 | 其他页面视觉变化 | 使用响应式断点限制影响范围 |
