import { describe, it, expect } from "vitest";
import { join } from "path";
import { promisify } from "util";
import fs from "fs";
import http from "http";
import https from "https";
import { COSService } from "../cos.js";
import { getMarkdownImagePaths } from "../markdown.js";
import dotenv from "dotenv";

// 加载环境变量
dotenv.config();

const WEBSITE_URL =
  "https://dummyimage.com/320x240/333333/00a2ff.png&text=RENSANNING";

const IMAGES_DIR = join(__dirname, "images");

const IMAGE_PATH = join(IMAGES_DIR, "test.png");

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

async function downloadFile(url: string, path: string) {
  const urlObj = new URL(url);
  const protocol = urlObj.protocol === "https:" ? https : http;
  return new Promise((resolve, reject) => {
    protocol
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
          return;
        }
        const data: Buffer[] = [];
        res.on("data", (chunk) => data.push(chunk));
        res.on("end", async () => {
          try {
            fs.stat(IMAGES_DIR, async (err, _) => {
              if (err) {
                await mkdir(join(__dirname, "images"));
              }
              await writeFile(path, Buffer.concat(data));
              resolve(undefined);
            });
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", reject);
  });
}

describe("upload_file", () => {
  it("should upload file to cos", async () => {
    await downloadFile(WEBSITE_URL, IMAGE_PATH);
    const cosService = new COSService();
    const url = await cosService.uploadFile(IMAGE_PATH);
    console.log(url);
    expect(url).toBeDefined();
  });
});

const MARKDOWN_PATH = join(__dirname, "README.md");

describe("parser_markdown_image", () => {
  it("should parser markdown image", async () => {
    let { markdown, replacements } = getMarkdownImagePaths(MARKDOWN_PATH);

    const cosService = new COSService();

    for (const replacement of replacements) {
      const url = await cosService.uploadFile(replacement.url);
      console.log(replacement, url);
      markdown = markdown.replace(replacement.original, url);
    }

    expect(markdown).toBeDefined();
    expect(replacements).toBeDefined();
  });
});
