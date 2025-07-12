# @bestzy 系列 npm 包

这是一个 monorepo 项目，包含多个 @bestzy 命名空间下的 npm 包。

## 📦 包含的包

### [@bestzy/eslint-config](./packages/eslint-config)
zy 的 ESLint 配置规则，支持：
- 基础 JavaScript/TypeScript 规则
- React 项目规则
- Vue 项目规则

### [@bestzy/prettier-config](./packages/prettier-config)
zy 的 Prettier 配置规则，提供统一的代码格式化规范。

### [@bestzy/commitizen-adapter](./packages/commitizen-adapter)
zy 的 Commitizen 适配器，支持中文提示的约定式提交。

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 构建所有包
```bash
pnpm build
```

### 发布包
```bash
# 1. 创建changeset
pnpm changeset

# 2. 更新版本
pnpm version-packages

# 3. 发布
pnpm release
```

## 🛠 开发

### 项目结构
```
.
├── packages/
│   ├── eslint-config/      # ESLint 配置包
│   ├── prettier-config/    # Prettier 配置包
│   └── commitizen-adapter/ # Commitizen 适配器包
├── .changeset/             # Changesets 配置
├── package.json            # 根配置
└── pnpm-workspace.yaml     # Workspace 配置
```

### 添加新包
1. 在 `packages/` 目录下创建新包
2. 包名使用 `@bestzy/` 前缀
3. 确保包的 `package.json` 配置正确

## 📝 使用方法

### ESLint 配置
```bash
npm install @bestzy/eslint-config
```

在 `.eslintrc.js` 中：
```js
module.exports = {
  extends: ['@bestzy/eslint-config'] // 基础配置
  // 或者 '@bestzy/eslint-config/typescript' // TypeScript
  // 或者 '@bestzy/eslint-config/react'      // React
  // 或者 '@bestzy/eslint-config/vue'        // Vue
}
```

### Prettier 配置
```bash
npm install @bestzy/prettier-config
```

在 `package.json` 中：
```json
{
  "prettier": "@bestzy/prettier-config"
}
```

### Commitizen 适配器
```bash
npm install @bestzy/commitizen-adapter
```

在 `package.json` 中：
```json
{
  "config": {
    "commitizen": {
      "path": "@bestzy/commitizen-adapter"
    }
  }
}
```

然后使用 `npx cz` 进行提交。

## 📄 许可证

MIT 
