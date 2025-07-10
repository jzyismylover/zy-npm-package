# COS MCP

## 背景

在输出一些技术文章的时候会遇到引用图片的情况，在前面的做法是将图片复制到 markdown 相同路径下的 `assets` 文件夹，然后在 markdown 中通过相对路径的路径引用。随着图片增多，这种方式带来的缺点是项目的整体体积会变大，而且要时刻注意维护 markdown 文件和图片资源的位置方式，一旦位置或者目录名字发生改变，原来的引用就会失效，因此萌生了一个想法将项目中 markdown 文件存量使用本地图片的方式替换为 CDN 网络图片。

## 技术方案

人工替换的方式简单但是非常繁琐，需要经历查找 -> 图片上传 -> 路径替换这些操作。目前 AI agent 盛行，这些繁琐的事情完全可以交给大语言模型去做，只要定义好这些操作步骤的逻辑就好。目前大语言模型调用外部工具的方式有两种：Function call、Model Context Protocol（MCP）。Function call 需要对不同大模型做适配工作，而 MCP 是较为通用的通信协议，提供了一个标准化的方法让模型去连接数据源和工作，因此本次是基于 MCP 去实现一个 COS 工具

1. 引入必要的模块：fs、path、COS SDK、dotenv等。

2. 配置COS客户端，使用环境变量或配置对象。

3. 读取Markdown文件内容。

4. 使用正则表达式提取所有图片路径。

5. 过滤出本地图片，处理路径问题。

6. 异步上传每个图片到COS，记录新的URL。

7. 替换原Markdown中的图片路径。

8. 写入新的Markdown文件。

9. 处理错误，提供友好的提示信息。

10. 提供使用说明和注意事项，帮助用户正确使用脚本

最后，测试脚本，确保所有功能正常，处理各种边缘情况，比如图片不存在、上传失败、网络问题等，并给出相应的提示信息

## 项目启动

```bash
# 克隆项目
git clone https://github.com/yourusername/cos-mcp.git
cd cos-mcp

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的腾讯云 COS 配置信息
```

## 配置

在 `.env` 文件中配置以下环境变量：

```env
# 腾讯云 COS 配置
COS_SECRET_ID=your_secret_id
COS_SECRET_KEY=your_secret_key
COS_REGION=ap-guangzhou
COS_BUCKET=your_bucket_name

# 服务器配置
PORT=3000
```

## 使用

1. 启动服务器：

```bash
pnpm dev
```

2. 服务器将在 http://localhost:3000/mcp 提供 MCP 服务

3. 可用的工具：

- `uploadImageToCOS`: 上传单个图片到 COS
- `processMarkdownFile`: 处理整个 Markdown 文件，替换所有本地图片为 COS URL

## 开发

```bash
# 构建项目
pnpm build

# 运行测试
pnpm test
```

## 注意事项

1. 确保有足够的腾讯云 COS 存储空间
2. 建议在测试环境中先进行测试
3. 处理大文件时注意内存使用
4. 建议定期备份原始文件
