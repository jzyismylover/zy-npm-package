# @bestzy/commitizen-adapter

## 2.2.2

### Patch Changes

- 支持通过 commitizen 传参覆盖内部逻辑; 添加单元测试

## 2.2.1

### Patch Changes

- adapter支持提交自动选中monorepo项目文件夹作为scoped提交

## 2.2.0

### Minor Changes

**转换为 CommonJS 模块**: 从 ESM 转换为 CJS 以提供更好的兼容性
**依赖版本降级**:

- `chalk`: 5.4.1 → 4.1.2
- `inquirer`: 9.3.7 → 8.2.6
- `@types/inquirer`: 9.0.8 → 8.2.11

- ✅ **CommonJS 支持**: 完全支持 CommonJS 模块系统
- ✅ **向后兼容**: 同时支持 require() 和 import 语法
- ✅ **智能 scope 选择**: 根据文件修改自动推荐最佳 scope

## 2.1.0

### Minor Changes

- commitizen-adapter 支持 scope 选项
- 🎯 **新增动态 scope 检测**: 自动检测 git 修改文件范围
- 📁 **项目目录扫描**: 自动扫描项目目录作为 scope 选项
- 📝 **手动输入支持**: 支持自定义 scope 输入
- ⚙️ **静态配置**: 支持预设 scope 选项

## 2.0.0

### Major Changes

- 自定义commitizen适配器
