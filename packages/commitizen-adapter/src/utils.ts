import { execSync } from "child_process";
import path from "path";
import type { ProjectScanConfig } from "./types";

export interface ScopeChoice {
  name: string;
  value: string;
}

/**
 * 获取项目中所有目录列表作为 scope 选项
 * @param {ProjectScanConfig} config - 项目扫描配置
 * @returns {string[]} 目录列表
 */
export function getProjectDirectories(
  config: ProjectScanConfig = {}
): string[] {
  const {
    packagesPrefix = "packages",
    excludePatterns = [
      "node_modules",
      ".git",
      ".vscode",
      ".idea",
      "dist",
      "build",
      "coverage",
    ],
    enableAutoDetection = true,
    maxDirectories = 20,
    maxDepth = 5,
  } = config;

  if (!enableAutoDetection) {
    return [];
  }

  try {
    // 构建 find 命令，限制搜索深度
    const depthLimit = maxDepth > 0 ? `-maxdepth ${maxDepth}` : "";

    // 构建排除模式的 grep 命令
    const excludePattern =
      excludePatterns.length > 0
        ? `| grep -v -E '(${excludePatterns.join("|")})'`
        : "";

    const findCommand = `find . ${depthLimit} -type d -not -path '*/.*' ${excludePattern} | sed 's|^./||' | head -${maxDirectories}`;

    const output = execSync(findCommand, { encoding: "utf8" });
    const directories = output
      .trim()
      .split("\n")
      .filter((dir) => dir && dir !== ".") // 过滤空目录和 . 目录
      .filter((dir, index, arr) => arr.indexOf(dir) === index) // 去重
      .map((dir) => {
        // 移除配置的前缀
        if (packagesPrefix && dir.startsWith(`${packagesPrefix}/`)) {
          return dir.replace(`${packagesPrefix}/`, "");
        }
        return dir;
      })
      .map((dir) => dir.split("/")[0]) // 只取第一级目录
      .filter((dir) => dir !== packagesPrefix) // 过滤掉前缀目录本身
      .sort();

    return Array.from(new Set(directories));
  } catch (error) {
    console.warn("获取项目目录失败:", (error as Error).message);
    return ["src", "lib", "components", "utils", "docs", "test"]; // 默认常见目录
  }
}

/**
 * 获取当前 git 暂存区修改文件的父级目录
 * @param {ProjectScanConfig} config - 项目扫描配置
 * @returns {string} 用 / 分割的目录列表
 */
export function getModifiedFileScopes(config: ProjectScanConfig = {}): string {
  const { packagesPrefix = "packages", enableAutoDetection = true } = config;

  if (!enableAutoDetection) {
    return "";
  }

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
      return extractScopes(modifiedFiles, packagesPrefix);
    }

    return extractScopes(stagedFiles, packagesPrefix);
  } catch (error) {
    console.warn("获取 git 修改文件失败:", (error as Error).message);
    return "";
  }
}

/**
 * 从文件列表中提取父级目录
 * @param {string} fileList - 文件列表字符串
 * @param {string} packagesPrefix - 包目录前缀
 * @returns {string} 用 / 分割的目录列表
 */
export function extractScopes(
  fileList: string,
  packagesPrefix: string = "packages"
): string {
  const files = fileList
    .trim()
    .split("\n")
    .filter((file) => file.trim());
  const scopes = new Set<string>();

  files.forEach((file) => {
    const dirs = file.split("/").filter((dir) => dir !== packagesPrefix);
    scopes.add(dirs[0]);
  });

  return Array.from(scopes).join("/");
}

/**
 * 构建动态 scope 选择列表
 * @param staticScopes - 静态配置的 scope 列表
 * @param config - 项目扫描配置
 * @returns ScopeChoice[] - 格式化的选择列表
 */
export function buildScopeChoices(
  staticScopes: string[] = [],
  config: ProjectScanConfig = {}
): ScopeChoice[] {
  const autoScope = getModifiedFileScopes(config);
  const projectDirectories = getProjectDirectories(config);

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
