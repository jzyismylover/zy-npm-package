# VS Code 插件下载链接生成器

## 简介

这是一个 Chrome 浏览器扩展，旨在从官方 [Visual Studio Marketplace](https://marketplace.visualstudio.com/) 页面生成 VS Code 插件的直链下载地址 (`.vsix` 文件)。

通常在 VS Code 市场页面上只能找到 "Install" 按钮，而对于需要离线安装或在受限网络环境下使用的场景，获取 `.vsix` 文件并不直观。本插件可以自动解析发布者、插件名和版本号，一键生成官方下载链接。

## 功能特点

- **一键提取**: 点击插件图标，自动提取当前页面的插件信息。
- **直链生成**: 基于官方规则生成 `.vsix` 离线安装包下载链接。
- **安全可靠**: 仅在用户点击时并在 VS Code Marketplace 域名下运行，无后台常驻进程。
- **错误检测**: 会自动检测是否处于有效的插件详情页面。

## 安装说明

由于本插件未发布到 Chrome 应用商店，需要通过**加载已解压的扩展程序**方式安装：

1. 克隆或下载本项目，定位到 `packages/tools/get-vscode-plugin-download-link` 目录。
2. 在 Chrome 浏览器地址栏输入 `chrome://extensions` 并回车。
3. 打开右上角的 **开发者模式 (Developer mode)** 开关。
4. 点击左上角的 **加载已解压的扩展程序 (Load unpacked)** 按钮。
5. 选择 `packages/tools/get-vscode-plugin-download-link` 文件夹。

## 使用指南

1. 访问任意 VS Code 插件页面，例如 [Python 插件](https://marketplace.visualstudio.com/items?itemName=ms-python.python)。
2. 点击浏览器工具栏右上角的本插件图标。
3.在弹出的面板中，您将看到：
    - **Publisher (发布者)**
    - **Extension (插件名)**
    - **Version (版本号)**
4. 点击下方的 **Download .vsix** 按钮即可开始下载。

## 开发与目录结构

- `manifest.json`: 插件配置文件 (Manifest V3)。
- `popup.html`: 插件弹窗界面。
- `popup.js`: 核心逻辑，负责执行脚本提取页面信息并生成链接。

```bash
├── manifest.json
├── popup.html
└── popup.js
```
