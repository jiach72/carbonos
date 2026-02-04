---
description: 自动分析项目并推荐需要安装的skills
---

# 自动发现并安装技能 (Find Skills)

当用户提到"找技能"、"需要什么skills"、或"安装skills"时使用此workflow。

## 步骤

### 1. 分析项目技术栈

检查项目中的配置文件来识别使用的技术：
- `package.json` - 查看 dependencies 和 devDependencies
- `tsconfig.json` - 确认是否使用 TypeScript
- `vite.config.ts` / `next.config.js` - 识别框架
- `requirements.txt` / `pyproject.toml` - Python 项目

### 2. 搜索技能

// turbo
```powershell
powershell -ExecutionPolicy Bypass -Command "& 'C:\Users\jiach\Documents\global_skills\skill-finder.ps1' -Search '<关键词>' -Detailed"
```

### 3. 安装技能

// turbo
```powershell
powershell -ExecutionPolicy Bypass -Command "& 'C:\Users\jiach\Documents\global_skills\skill-finder.ps1' -Install '<技能名>' -ProjectPath '<项目路径>'"
```
