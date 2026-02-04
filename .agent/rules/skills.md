# 项目技能管理规则

本规则适用于：**新功能开发**、**复杂代码重构**、**技术架构调整**。

## 1. 强制前置检查

在编写任何代码之前，必须执行以下检查：

1.  **识别需求**：本次任务涉及哪些核心技术（React, SQL, API, Auth, Python 等）？
2.  **检查技能**：查看 `.agent/skills/` 目录。
    - 如果缺少相关技能，**必须**安装。
    - 安装方法请查阅：`global_skills/GETTING_STARTED.md`

## 2. 文档要求

在 `implementation_plan.md` 中，必须包含 "使用的技能" (Skills Used) 章节：

```markdown
## 使用的技能
- `react-patterns`: 用于组件设计
- `workflow-automation`: 用于自动化脚本
```

## 3. 常见误区

- ❌ **不要**凭空猜测 PowerShell 命令，参考 `GETTING_STARTED.md`。
- ❌ **不要**在没有阅读 `SKILL.md` 的情况下直接写代码。
- ✅ **只要**涉及新领域，就先搜索技能。
