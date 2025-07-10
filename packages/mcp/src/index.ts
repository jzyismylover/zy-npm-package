import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";
import { COSService } from "./cos.js";
import { getMarkdownImagePaths } from "./markdown.js";

type McpResult = {
  content: Array<{ type: "text"; text: string }>;
};

// 创建 MCP 服务器实例
const server = new McpServer({
  name: "cos-markdown-mcp",
  description: "腾讯云 COS 上传 MCP",
  version: "1.0.0",
});

// 注册上传图片到 COS 的工具
server.tool(
  "upload",
  "上传一张图片到腾讯云 COS, 并返回上传地址",
  {
    filePath: z.string().describe("图片本地路径"),
  },
  async ({ filePath }: { filePath: string }): Promise<McpResult> => {
    try {
      const cosService = new COSService();

      const url = await cosService.uploadFile(filePath);

      // mcp client 接受的 特定格式
      return { content: [{ type: "text", text: url }] };
    } catch (error) {
      console.error(error);
      // mcp server 异常
      throw new Error(`Failed to upload image: ${error}`);
    }
  },
);

server.tool(
  "parser_markdown_image",
  "替换 markdown 文件中的图片为腾讯云 COS 图片",
  { filePath: z.string().describe("markdown 文件本地路径") },
  async ({ filePath }: { filePath: string }): Promise<McpResult> => {
    let { markdown, replacements } = getMarkdownImagePaths(filePath);

    const cosService = new COSService();

    await Promise.all(
      replacements.map(async (replacement) => {
        const url = await cosService.uploadFile(replacement.url);
        markdown = markdown.replace(replacement.original, url);
      }),
    );

    fs.writeFileSync(filePath, markdown, { encoding: "utf-8" });

    return {
      content: [{ type: "text", text: markdown }],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
