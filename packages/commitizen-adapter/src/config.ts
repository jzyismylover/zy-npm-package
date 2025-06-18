import type { CommitOptions } from "./types.js";

export const defaultConfig: CommitOptions = {
  maxLineWidth: 100,
  maxHeaderWidth: 72,
  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix"],
  types: [
    {
      value: "feat",
      name: "✨ feat:     新功能",
      description: "新增功能或特性",
    },
    {
      value: "fix",
      name: "🐛 fix:      修复",
      description: "修复bug",
    },
    {
      value: "docs",
      name: "📚 docs:     文档",
      description: "仅文档更改",
    },
    {
      value: "style",
      name: "💎 style:    样式",
      description: "不影响代码含义的更改（空格、格式、缺少分号等）",
    },
    {
      value: "refactor",
      name: "📦 refactor: 重构",
      description: "既不修复错误也不添加功能的代码更改",
    },
    {
      value: "perf",
      name: "🚀 perf:     性能",
      description: "提高性能的代码更改",
    },
    {
      value: "test",
      name: "🚨 test:     测试",
      description: "添加缺少的测试或纠正现有测试",
    },
    {
      value: "build",
      name: "🛠  build:    构建",
      description:
        "影响构建系统或外部依赖项的更改（示例范围：gulp、broccoli、npm）",
    },
    {
      value: "ci",
      name: "⚙️  ci:       CI",
      description: "对CI配置文件和脚本的更改",
    },
    {
      value: "chore",
      name: "♻️  chore:    杂务",
      description: "其他不修改src或test文件的更改",
    },
    {
      value: "revert",
      name: "🗑  revert:   回滚",
      description: "回滚先前的提交",
    },
  ],
  scopes: ["core", "ui", "api", "utils", "config", "deps", "release"],
};
