import fs from "fs";
import path from "path";

export function getMarkdownImagePaths(filePath: string) {
  let markdown = fs.readFileSync(filePath, "utf-8");

  const imageRegex = /!\[.*?\]\((.*?)\)/g;

  const replacements: { original: string; url: string }[] = [];

  let match: RegExpExecArray | null;

  const markdownDir = path.dirname(filePath);

  while ((match = imageRegex.exec(markdown)) !== null) {
    const imagePath = match[1];
    if (imagePath.startsWith("http")) {
      continue;
    }
    const fullPath = path.resolve(markdownDir, imagePath);

    replacements.push({
      original: imagePath,
      url: fullPath,
    });
  }

  return {
    markdown,
    replacements,
  };
}
