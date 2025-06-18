# 📚 Changeset 使用指南

Changeset 是用于管理 monorepo 版本和发布的工具，以下是完整的使用流程：

## 🚀 基本工作流程

### 1. 开发阶段
当你修改了某个包的代码后，需要记录这个变更：

```bash
# 创建 changeset
pnpm changeset
```

这个命令会启动交互式界面，询问：
- 哪些包发生了变更？
- 变更的类型是什么？（major/minor/patch）
- 变更的描述是什么？

### 2. 变更类型说明

- **major** (主版本号): 破坏性变更，如 1.0.0 → 2.0.0
- **minor** (次版本号): 新功能，向后兼容，如 1.0.0 → 1.1.0  
- **patch** (修订号): bug修复，向后兼容，如 1.0.0 → 1.0.1

### 3. 版本更新
当你准备发布时，运行：

```bash
# 根据 changeset 更新版本号和 CHANGELOG
pnpm version-packages
```

这会：
- 更新受影响包的版本号
- 生成/更新 CHANGELOG.md
- 删除已处理的 changeset 文件
- 创建一个 commit

### 4. 发布到 npm
```bash
# 构建并发布所有包
pnpm release
```

这会：
- 构建所有包 (`pnpm build`)
- 发布到 npm (`changeset publish`)

## 💡 实际示例

### 示例 1: 修复 bug
```bash
# 1. 修改代码后创建 changeset
pnpm changeset

# 选择: @bestzy/eslint-config
# 类型: patch
# 描述: 修复 TypeScript 规则冲突问题

# 2. 更新版本
pnpm version-packages

# 3. 发布
pnpm release
```

### 示例 2: 添加新功能
```bash
# 1. 添加新功能后创建 changeset  
pnpm changeset

# 选择: @bestzy/prettier-config
# 类型: minor
# 描述: 添加对 .astro 文件的支持

# 2. 更新版本
pnpm version-packages

# 3. 发布
pnpm release
```

### 示例 3: 破坏性变更
```bash
# 1. 进行破坏性变更后创建 changeset
pnpm changeset

# 选择: @bestzy/commitizen-adapter
# 类型: major  
# 描述: 重构 API，移除废弃方法

# 2. 更新版本
pnpm version-packages

# 3. 发布
pnpm release
```

## 📁 Changeset 文件结构

创建 changeset 后，会在 `.changeset/` 目录下生成文件：

```
.changeset/
├── config.json          # 配置文件
├── README.md            # 说明文档
└── random-name.md       # 具体的 changeset 文件
```

changeset 文件示例：
```markdown
---
"@bestzy/eslint-config": patch
---

修复 TypeScript 规则冲突问题
```

## 🔧 配置说明

`.changeset/config.json` 配置项：

```json
{
  "changelog": "@changesets/cli/changelog",  // 生成 changelog 的方式
  "commit": false,                          // 是否自动 commit
  "access": "public",                       // npm 发布权限
  "baseBranch": "main",                     // 基础分支
  "updateInternalDependencies": "patch"     // 内部依赖更新策略
}
```

## 🎯 高级用法

### 预发布版本
```bash
# 进入预发布模式
pnpm changeset pre enter alpha

# 创建预发布版本
pnpm changeset version

# 发布预发布版本  
pnpm release

# 退出预发布模式
pnpm changeset pre exit
```

### 快照发布
```bash
# 创建快照版本（用于测试）
pnpm changeset version --snapshot
pnpm changeset publish --tag snapshot
```

## ⚠️ 注意事项

1. **始终在功能分支上创建 changeset**
2. **一个 PR 可以包含多个 changeset**
3. **发布前确保所有测试通过**
4. **重要变更要详细描述**
5. **破坏性变更要特别标注**

## 🛠 常用命令

```bash
# 查看当前状态
pnpm changeset status

# 查看将要发布的版本
pnpm changeset version --dry-run

# 强制发布（跳过检查）
pnpm changeset publish --force

# 查看帮助
pnpm changeset --help
```

## 🔗 相关链接

- [Changesets 官方文档](https://github.com/changesets/changesets)
- [语义化版本规范](https://semver.org/lang/zh-CN/) 