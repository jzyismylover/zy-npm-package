import { execSync } from "child_process";
import path from "path";

export interface ScopeChoice {
  name: string;
  value: string;
}

/**
 * 获取项目中所有目录列表作为 scope 选项
 * @returns {string[]} 目录列表
 */
export function getProjectDirectories(): string[] {
  try {
    // 获取当前项目的所有目录（排除 node_modules, .git 等）
    const excludePatterns = [
      "node_modules",
      ".git",
      ".vscode",
      ".idea",
      "dist",
      "build",
      "coverage",
      ".next",
      ".nuxt",
    ];

    // sed 's|pattern|replacement|flags'
    const findCommand = `find . -type d -not -path '*/.*' | grep -v -E '(${excludePatterns.join(
      "|"
    )})' | sed 's|^./||' | head -50`;
    const output = execSync(findCommand, { encoding: "utf8" });

    const directories = output
      .trim()
      .split("\n")
      .filter((dir) => dir && dir !== ".") // 过滤空目录和 . 目录
      .filter((dir, index, arr) => arr.indexOf(dir) === index) // 去重
      .map((dir) => dir.replace("packages/", "")) // 移除 packages/ 前缀
      .map((dir) => dir.split("/")[0]) // 只取第一级目录
      .sort();

    return directories;
  } catch (error) {
    console.warn("获取项目目录失败:", (error as Error).message);
    return ["src", "lib", "components", "utils", "docs", "test"]; // 默认常见目录
  }
}

/**
 * 获取当前 git 暂存区修改文件的父级目录
 * @returns {string} 用 / 分割的目录列表
 */
export function getModifiedFileScopes(): string {
  try {
    // 获取暂存区的文件
    const stagedFiles = execSync("git diff --cached --name-only", {
      encoding: "utf8",
    });

    if (!stagedFiles.trim()) {
      // 如果暂存区没有文件，获取工作区修改的文件
      const modifiedFiles = execSync("git diff --name-only", {
        encoding: "utf8",
      });
      if (!modifiedFiles.trim()) {
        return "";
      }
      return extractScopes(modifiedFiles);
    }

    return extractScopes(stagedFiles);
  } catch (error) {
    console.warn("获取 git 修改文件失败:", (error as Error).message);
    return "";
  }
}

/**
 * 从文件列表中提取父级目录
 * @param {string} fileList - 文件列表字符串
 * @returns {string} 用 / 分割的目录列表
 */
export function extractScopes(fileList: string): string {
  const files = fileList
    .trim()
    .split("\n")
    .filter((file) => file.trim());
  const scopes = new Set<string>();

  files.forEach((file) => {
    // 只匹配 monorepo packages 目录下的文件
    if (!file.startsWith("packages")) {
      return;
    }
    for (const dir of file.split("/")) {
      if (dir !== "packages") {
        scopes.add(dir);
        break;
      }
    }
  });

  return Array.from(scopes).join("/");
}

/**
 * 构建动态 scope 选择列表
 * @param staticScopes - 静态配置的 scope 列表
 * @returns ScopeChoice[] - 格式化的选择列表
 */
export function buildScopeChoices(staticScopes: string[] = []): ScopeChoice[] {
  const autoScope = getModifiedFileScopes();
  const projectDirectories = getProjectDirectories();

  const choices: ScopeChoice[] = [];

  // 添加自动检测的 scope
  if (autoScope && autoScope !== "") {
    choices.push({
      name: `🎯 自动检测: ${autoScope}`,
      value: autoScope,
    });
  }

  // 添加手动输入选项
  choices.push({
    name: "📝 手动输入",
    value: "custom",
  });

  // 添加静态配置的 scope
  if (staticScopes.length > 0) {
    choices.push(
      ...staticScopes.map((scope) => ({
        name: `⚙️ ${scope}`,
        value: scope,
      }))
    );
  }

  // 添加项目目录
  choices.push(
    ...projectDirectories.map((dir) => ({
      name: `📁 ${dir}`,
      value: dir,
    }))
  );

  return choices;
}
